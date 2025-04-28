
import { supabase } from "@/integrations/supabase/client";

interface TravelFormData {
  destination: string;
  start_date: string;
  end_date: string;
  group_size: number;
  budget_amount: number;
  currency: string;
  accommodation_preference: string;
  travel_preferences: string[];
  additional_notes?: string;
}

export async function generateItinerary(formData: TravelFormData): Promise<string> {
  try {
    // Call our Supabase Edge Function instead of the Langflow API directly
    const { data, error } = await supabase.functions.invoke('proxy', {
      body: {
        input_value: {
          destination: formData.destination,
          start_date: formData.start_date,
          end_date: formData.end_date,
          group_size: formData.group_size,
          budget_amount: formData.budget_amount,
          currency: formData.currency,
          accommodation_preference: formData.accommodation_preference,
          travel_preferences: formData.travel_preferences,
          additional_notes: formData.additional_notes || ''
        }
      }
    });

    if (error) {
      console.error('Proxy function error:', error);
      throw new Error(`API Error: ${error.message}`);
    }

    // The Supabase function returns the data from Langflow API
    return data?.result || data?.text || 'No itinerary generated';
  } catch (error) {
    console.error('Failed to generate itinerary:', error);
    throw new Error('Failed to generate itinerary. Please try again.');
  }
}
