import { GoogleGenAI, Type } from "@google/genai";
import { Coordinates, TransportMode, Expense, ExpenseCategory, Trip, Suggestion, Weather, RouteSuggestion } from '../types';
import { getModeDistribution, getPeakHours, getTripsByDay } from '../utils/dataProcessing';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const transportModeSchema = {
  type: Type.OBJECT,
  properties: {
    mode: {
      type: Type.STRING,
      enum: [
        TransportMode.WALKING,
        TransportMode.BIKING,
        TransportMode.DRIVING,
        TransportMode.TRANSIT,
        TransportMode.UNKNOWN,
      ],
      description: 'The determined mode of transportation.',
    },
  },
  required: ['mode'],
};

export const detectTransportMode = async (path: Coordinates[]): Promise<TransportMode> => {
  if (path.length < 2) {
    return TransportMode.UNKNOWN;
  }
  
  const sampledPath = path.length > 50 ? path.filter((_, i) => i % Math.floor(path.length / 50) === 0) : path;
  
  const pathData = sampledPath.map(p => `lat:${p.lat.toFixed(5)},lng:${p.lng.toFixed(5)},t:${p.timestamp}`).join('; ');
  
  const prompt = `Analyze the following sequence of GPS coordinates (latitude, longitude, timestamp) to determine the most likely mode of transport. Consider the speed, pauses, and overall path pattern. The data is: ${pathData}. Respond with one of the following modes: WALKING, BIKING, DRIVING, TRANSIT, or UNKNOWN if uncertain.`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: transportModeSchema,
        },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result.mode && Object.values(TransportMode).includes(result.mode)) {
        return result.mode as TransportMode;
    }
    
    return TransportMode.UNKNOWN;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return TransportMode.UNKNOWN;
  }
};

const expenseSchema = {
    type: Type.OBJECT,
    properties: {
        amount: {
            type: Type.NUMBER,
            description: 'The numeric value of the expense amount.',
        },
        currency: {
            type: Type.STRING,
            description: 'The currency of the expense (e.g., USD, EUR, INR).',
        },
        description: {
            type: Type.STRING,
            description: 'A brief description of the expense item or service.',
        },
        category: {
            type: Type.STRING,
            enum: Object.values(ExpenseCategory),
            description: 'The category of the expense.',
        },
    },
    required: ['amount', 'currency', 'description', 'category'],
};

export const detectExpenseFromText = async (text: string): Promise<Omit<Expense, 'id' | 'timestamp' | 'tripId'>> => {
    const prompt = `Analyze the following text to extract expense details. The text could be from a receipt, an online payment confirmation, or a booking message. Identify the amount, currency, a short description, and categorize it into one of the following: ${Object.values(ExpenseCategory).join(', ')}.

Text to analyze: "${text}"`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: expenseSchema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (
            typeof result.amount === 'number' &&
            typeof result.currency === 'string' &&
            typeof result.description === 'string' &&
            Object.values(ExpenseCategory).includes(result.category)
        ) {
            return result as Omit<Expense, 'id' | 'timestamp' | 'tripId'>;
        } else {
            throw new Error("Parsed expense data is invalid or incomplete.");
        }

    } catch (error) {
        console.error("Error calling Gemini API for expense extraction:", error);
        throw new Error("Failed to parse expense from text. Please check the format or enter manually.");
    }
};

const suggestionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            estimatedBudget: { type: Type.STRING, description: 'A summary of the total estimated budget, e.g., "Approx. $500 for two"' },
            budgetDetails: {
                type: Type.ARRAY,
                description: 'A detailed breakdown of the estimated budget.',
                items: {
                    type: Type.OBJECT,
                    properties: {
                        item: {
                            type: Type.STRING,
                            description: 'The budget item (e.g., Accommodation, Food, Flights).',
                        },
                        cost: {
                            type: Type.STRING,
                            description: 'The estimated cost for this item (e.g., $200, ₹5000).',
                        },
                    },
                    required: ['item', 'cost']
                }
            },
            transportMode: {
                type: Type.STRING,
                enum: [...Object.values(TransportMode), "MULTIPLE"],
            },
            reason: { type: Type.STRING, description: "A short, personalized reason why the user might like this suggestion based on their history." },
            imageUrl: {
                type: Type.STRING,
                description: 'A URL for a relevant, high-quality image for the suggested trip. Use a placeholder service like picsum.photos.',
            }
        },
        required: ['title', 'description', 'estimatedBudget', 'budgetDetails', 'transportMode', 'reason', 'imageUrl'],
    },
};

export const getTripSuggestions = async (trips: Trip[], expenses: Expense[]): Promise<Suggestion[]> => {
    const prompt = `Based on the user's travel history and expenses, suggest 3 personalized future trips.
    For each suggestion, provide a title, a brief description, an estimated total budget summary string, a detailed budget breakdown (e.g., for transport, food, lodging), the likely transport mode (${Object.values(TransportMode).join('/')} or MULTIPLE), a short reason why the user might like it based on their history, and a relevant image URL from a service like picsum.photos.

    User's Trips Summary:
    - They have taken ${trips.length} trips.
    - Common transport modes: ${getModeDistribution(trips).map(m => m.name).join(', ')}.
    - Trips often happen on these days: ${getTripsByDay(trips).filter(d => d.trips > 0).map(d => d.day).join(', ')}.
    - Trips often start around these hours: ${getPeakHours(trips).filter(h => h.trips > 0).map(h => h.hour).join(', ')}.

    User's Expenses Summary:
    - They have logged ${expenses.length} expenses.
    - They spend on categories like: ${[...new Set(expenses.map(e => e.category))].join(', ')}.

    Please provide creative and relevant suggestions.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: suggestionSchema,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result as Suggestion[];
    } catch (error) {
        console.error("Error calling Gemini API for trip suggestions:", error);
        throw new Error("Could not generate trip suggestions at this time.");
    }
};

export const getDashboardInsights = async (trips: Trip[]): Promise<string> => {
    const prompt = `Analyze the following trip data summary and generate a few concise, actionable insights for a transport planner or researcher. Focus on patterns, anomalies, and potential recommendations.

    Data Summary:
    - Total Trips: ${trips.length}
    - Transport Mode Distribution: ${JSON.stringify(getModeDistribution(trips))}
    - Peak Travel Times (by hour): ${JSON.stringify(getPeakHours(trips))}
    - Trips by Day of the Week: ${JSON.stringify(getTripsByDay(trips))}

    Based on this data, what are the key takeaways? For example, are certain modes of transport underutilized? Are there clear rush hours? Do weekends show different travel behavior? Keep the insights to 2-3 bullet points.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for dashboard insights:", error);
        throw new Error("Failed to generate AI insights.");
    }
};

const routeSuggestionSchema = {
    type: Type.OBJECT,
    properties: {
        mode: {
            type: Type.STRING,
            enum: Object.values(TransportMode),
            description: 'The suggested mode of transportation.',
        },
        routeDescription: {
            type: Type.STRING,
            description: 'A brief, user-friendly description of the suggested route or travel method.'
        },
        reason: {
            type: Type.STRING,
            description: 'A short explanation for why this route/mode was suggested, considering the weather and destination.'
        }
    },
    required: ['mode', 'routeDescription', 'reason'],
};

export const getRouteSuggestion = async (origin: Coordinates, destination: string, weather: Weather): Promise<RouteSuggestion> => {
    const prompt = `I am at latitude ${origin.lat} and longitude ${origin.lng}. I want to go to "${destination}". The current weather is ${weather.condition} with a temperature of ${weather.temperature}°C. 
    
    Based on this information, suggest the best mode of transport and a brief route description. 
    - If it's Rainy, avoid suggesting Walking or Biking if possible.
    - If it's Sunny and the distance is short, Walking or Biking could be good options.
    - For longer distances, suggest Driving or Transit.
    - Provide a short reason for your suggestion.
    
    Choose a transport mode from: ${Object.values(TransportMode).filter(m => m !== TransportMode.UNKNOWN).join(', ')}.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: routeSuggestionSchema,
            },
        });
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result as RouteSuggestion;
    } catch (error) {
        console.error("Error calling Gemini API for route suggestion:", error);
        throw new Error("Could not get a route suggestion right now.");
    }
};