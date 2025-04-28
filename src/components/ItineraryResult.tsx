
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface ItineraryResultProps {
  itinerary: string;
}

const ItineraryResult: React.FC<ItineraryResultProps> = ({ itinerary }) => {
  const downloadItinerary = () => {
    const element = document.createElement('a');
    const file = new Blob([itinerary], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'travel-itinerary.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast.success('Itinerary downloaded successfully!');
  };

  return (
    <Card className="travel-card-shadow border-t-4 border-t-travel-500 bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-semibold">Your Travel Itinerary</CardTitle>
        <Button 
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={downloadItinerary}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </CardHeader>
      <CardContent className="prose prose-slate max-w-none">
        <ReactMarkdown>
          {itinerary}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default ItineraryResult;
