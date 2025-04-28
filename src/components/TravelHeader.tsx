
import React from 'react';
import { Compass } from 'lucide-react';

const TravelHeader: React.FC = () => {
  return (
    <header className="py-6 md:py-10 mb-6 md:mb-10">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-travel-100 p-3 rounded-full">
            <Compass className="h-8 w-8 text-travel-500" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Travel Itinerary Generator</h1>
        <p className="text-muted-foreground max-w-lg">
          Fill in your travel details below and we'll create a personalized itinerary just for you.
        </p>
      </div>
    </header>
  );
};

export default TravelHeader;
