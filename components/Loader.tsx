import React from 'react';

interface LoaderProps {
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ className }) => {
  const defaultClasses = "w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin";
  return (
    <div className={className || defaultClasses}></div>
  );
};

export default Loader;
