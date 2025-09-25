import { Trip, TransportMode, Coordinates, Expense, ExpenseCategory, Suggestion } from '../types';

const generatePath = (start: {lat: number, lng: number}, end: {lat: number, lng: number}, points: number, durationMinutes: number): Coordinates[] => {
    const path: Coordinates[] = [];
    const now = Date.now();
    for (let i = 0; i < points; i++) {
        const fraction = i / (points - 1);
        path.push({
            lat: start.lat + (end.lat - start.lat) * fraction + (Math.random() - 0.5) * 0.005, // add some jitter
            lng: start.lng + (end.lng - start.lng) * fraction + (Math.random() - 0.5) * 0.005, // add some jitter
            timestamp: now + (durationMinutes * 60 * 1000) * fraction,
        });
    }
    return path;
};

const createTrip = (
    id: string,
    mode: TransportMode,
    daysAgo: number,
    startHour: number,
    durationMinutes: number,
    startCoords: {lat: number, lng: number},
    endCoords: {lat: number, lng: number},
    companions: number = 0,
    originAddress?: string,
    destinationAddress?: string,
): Trip => {
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - daysAgo);
    startTime.setHours(startHour, 0, 0, 0);
    const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
    const path = generatePath(startCoords, endCoords, 50, durationMinutes);

    return {
        id,
        startTime: startTime.getTime(),
        endTime: endTime.getTime(),
        origin: path[0],
        destination: path[path.length - 1],
        mode,
        path,
        companions,
        originAddress,
        destinationAddress,
    };
};

export const demoTrips: Trip[] = [
    // Commutes during the week - Bangalore
    createTrip('demo-1', TransportMode.DRIVING, 2, 8, 30, {lat: 12.9716, lng: 77.5946}, {lat: 12.9345, lng: 77.6244}, 0, 'Bangalore City Center', 'Koramangala Office'), // Morning commute
    createTrip('demo-2', TransportMode.DRIVING, 2, 18, 45, {lat: 12.9345, lng: 77.6244}, {lat: 12.9716, lng: 77.5946}, 0, 'Koramangala Office', 'Bangalore City Center'), // Evening commute
    createTrip('demo-14', TransportMode.DRIVING, 1, 9, 35, {lat: 12.9716, lng: 77.5946}, {lat: 12.9345, lng: 77.6244}, 0, 'Bangalore City Center', 'Koramangala Office'),
    createTrip('demo-15', TransportMode.DRIVING, 1, 18, 50, {lat: 12.9345, lng: 77.6244}, {lat: 12.9716, lng: 77.5946}, 0, 'Koramangala Office', 'Bangalore City Center'),

    // Commutes during the week - Chennai
    createTrip('demo-3', TransportMode.TRANSIT, 3, 9, 55, {lat: 13.0827, lng: 80.2707}, {lat: 13.0067, lng: 80.2209}, 1, 'Chennai Central', 'Tidel Park'), // Transit commute
    createTrip('demo-4', TransportMode.TRANSIT, 3, 17, 60, {lat: 13.0067, lng: 80.2209}, {lat: 13.0827, lng: 80.2707}, 1, 'Tidel Park', 'Chennai Central'),

    // Biking and Walking - Bangalore
    createTrip('demo-5', TransportMode.BIKING, 4, 8, 20, {lat: 12.9545, lng: 77.5629}, {lat: 12.9716, lng: 77.5946}, 0, 'Jayanagar', 'Bangalore City Center'), // Biking
    createTrip('demo-6', TransportMode.WALKING, 4, 13, 15, {lat: 12.9716, lng: 77.5946}, {lat: 12.9750, lng: 77.5980}, 2, 'City Center', 'Lunch Spot'), // Walking for lunch
    createTrip('demo-10', TransportMode.BIKING, 9, 17, 25, {lat: 12.9279, lng: 77.6271}, {lat: 12.9090, lng: 77.6230}, 0, 'HSR Layout', 'Silk Board'),

    // Weekend trips - Bangalore to Mysore
    createTrip('demo-7', TransportMode.DRIVING, 6, 10, 90, {lat: 12.9716, lng: 77.5946}, {lat: 12.2958, lng: 76.6394}, 3, 'Bangalore', 'Mysore'), // Weekend road trip
    createTrip('demo-8', TransportMode.WALKING, 6, 14, 120, {lat: 12.3051, lng: 76.6552}, {lat: 12.3120, lng: 76.6500}, 3, 'Mysore Palace', 'Mysore Zoo'), // Sightseeing walk
    createTrip('demo-9', TransportMode.DRIVING, 7, 16, 100, {lat: 12.2958, lng: 76.6394}, {lat: 12.9716, lng: 77.5946}, 3, 'Mysore', 'Bangalore'), // Return trip

    // More varied data - Bangalore
    createTrip('demo-11', TransportMode.TRANSIT, 10, 11, 40, {lat: 12.9784, lng: 77.6408}, {lat: 12.9698, lng: 77.6100}, 1, 'Indiranagar', 'MG Road'),
    createTrip('demo-12', TransportMode.DRIVING, 11, 20, 20, {lat: 12.9698, lng: 77.6100}, {lat: 12.9345, lng: 77.6244}, 2, 'MG Road', 'Koramangala'), // Late night drive
    createTrip('demo-13', TransportMode.WALKING, 12, 19, 30, {lat: 12.9345, lng: 77.6244}, {lat: 12.9300, lng: 77.6280}, 2, 'Koramangala', 'Dinner Place'),
    
    // Some recent trips for today/yesterday if viewing
    createTrip('demo-16', TransportMode.WALKING, 0, 12, 10, {lat: 12.9279, lng: 77.6271}, {lat: 12.9250, lng: 77.6290}, 0, 'HSR Layout', 'Local Cafe'),
    createTrip('demo-17', TransportMode.BIKING, 0, 19, 15, {lat: 12.9784, lng: 77.6408}, {lat: 12.9716, lng: 77.5946}, 1, 'Indiranagar', 'Cubbon Park'),
];

export const demoExpenses: Expense[] = [
    // Commute expenses (linked to trips)
    {
        id: 'demo-exp-1',
        amount: 150,
        currency: 'INR',
        description: 'Fuel for the week',
        category: ExpenseCategory.OTHER,
        timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).getTime(),
        tripId: 'demo-1',
    },
    {
        id: 'demo-exp-2',
        amount: 50,
        currency: 'INR',
        description: 'Metro card top-up',
        category: ExpenseCategory.TICKET,
        timestamp: new Date(new Date().setDate(new Date().getDate() - 3)).getTime(),
        tripId: 'demo-3',
    },
    {
        id: 'demo-exp-3',
        amount: 80,
        currency: 'INR',
        description: 'Lunch near office',
        category: ExpenseCategory.FOOD,
        timestamp: new Date(new Date().setDate(new Date().getDate() - 2)).getTime(),
        tripId: 'demo-2',
    },

    // Weekend trip to Mysore expenses (linked to trips)
    {
        id: 'demo-exp-4',
        amount: 1200,
        currency: 'INR',
        description: 'Hotel for one night',
        category: ExpenseCategory.ACCOMMODATION,
        timestamp: new Date(new Date().setDate(new Date().getDate() - 6)).getTime(),
        tripId: 'demo-7',
    },
    {
        id: 'demo-exp-5',
        amount: 450,
        currency: 'INR',
        description: 'Dinner at Mysore restaurant',
        category: ExpenseCategory.FOOD,
        timestamp: new Date(new Date().setDate(new Date().getDate() - 6)).getTime(),
        tripId: 'demo-7',
    },
    {
        id: 'demo-exp-6',
        amount: 200,
        currency: 'INR',
        description: 'Mysore Palace entry tickets',
        category: ExpenseCategory.TICKET,
        timestamp: new Date(new Date().setDate(new Date().getDate() - 6)).getTime(),
        tripId: 'demo-8',
    },
    {
        id: 'demo-exp-7',
        amount: 300,
        currency: 'INR',
        description: 'Souvenirs',
        category: ExpenseCategory.SHOPPING,
        timestamp: new Date(new Date().setDate(new Date().getDate() - 7)).getTime(),
        tripId: 'demo-9',
    },

    // General expenses (not linked to a specific trip)
    {
        id: 'demo-exp-8',
        amount: 65,
        currency: 'INR',
        description: 'Coffee with a friend',
        category: ExpenseCategory.FOOD,
        timestamp: new Date(new Date().setDate(new Date().getDate() - 4)).getTime(),
    },
    {
        id: 'demo-exp-9',
        amount: 2500,
        currency: 'INR',
        description: 'New headphones',
        category: ExpenseCategory.SHOPPING,
        timestamp: new Date(new Date().setDate(new Date().getDate() - 5)).getTime(),
    },
     {
        id: 'demo-exp-10',
        amount: 120,
        currency: 'INR',
        description: 'Movie ticket',
        category: ExpenseCategory.TICKET,
        timestamp: new Date(new Date().setDate(new Date().getDate() - 8)).getTime(),
    }
];

export const demoSuggestions: Suggestion[] = [
    {
        title: "Weekend Hiking Trip to Nandi Hills",
        description: "Escape the city bustle for a refreshing weekend of hiking and breathtaking sunrise views at Nandi Hills. It's a perfect short trip for nature lovers and adventure seekers.",
        estimatedBudget: "Approx. ₹3,500 for two",
        budgetDetails: [
            { item: "Car Fuel / Cab", cost: "₹1,500" },
            { item: "Accommodation (1 night)", cost: "₹1,200" },
            { item: "Food & Entry Fees", cost: "₹800" },
        ],
        transportMode: TransportMode.DRIVING,
        reason: "A great option for a quick, active getaway, similar to your shorter road trips but with a focus on nature.",
        imageUrl: "https://picsum.photos/seed/nandihills/800/400",
    },
    {
        title: "Coastal Adventure in Pondicherry",
        description: "Explore the charming French Quarter, relax on serene beaches, and indulge in delicious Franco-Tamil cuisine. A vibrant cultural experience awaits.",
        estimatedBudget: "Approx. ₹10,000 for two (3 days)",
        budgetDetails: [
            { item: "Bus/Train Tickets", cost: "₹2,500" },
            { item: "Guesthouse Stay", cost: "₹4,500" },
            { item: "Food & Activities", cost: "₹3,000" },
        ],
        transportMode: TransportMode.TRANSIT,
        reason: "Builds on your longer journeys, offering a mix of relaxation and cultural exploration with manageable travel.",
        imageUrl: "https://picsum.photos/seed/pondi/800/400",
    },
    {
        title: "Explore the Heritage of Hampi",
        description: "Step back in time amidst the ancient ruins of the Vijayanagara Empire. A paradise for history buffs and photographers, with stunning landscapes and incredible architecture.",
        estimatedBudget: "Approx. ₹7,000 for two",
        budgetDetails: [
            { item: "Overnight Bus", cost: "₹2,000" },
            { item: "Homestay (2 nights)", cost: "₹2,500" },
            { item: "Local Transport & Food", cost: "₹2,500" },
        ],
        transportMode: "MULTIPLE",
        reason: "For a more immersive historical trip, expanding on your interest in exploring new cities like Mysore.",
        imageUrl: "https://picsum.photos/seed/hampi/800/400",
    },
];