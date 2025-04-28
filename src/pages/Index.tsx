
import React from 'react';
import TravelForm from '@/components/TravelForm';
import TravelHeader from '@/components/TravelHeader';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 px-4 py-6 md:py-10">
      <div className="container max-w-4xl mx-auto">
        <TravelHeader />
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <TravelForm />
        </div>
      </div>
      <footer className="text-center text-sm text-muted-foreground mt-12 pb-6">
        © {new Date().getFullYear()} Travel Itinerary Generator • Created with Lovable
      </footer>
    </div>
  );
};

export default Index;
