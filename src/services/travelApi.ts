
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
  const API_URL = 'https://api.langflow.astra.datastax.com/lf/fe006637-75ba-4934-a97e-eaa0753cc574/api/v1/run/356caed8-e536-47f0-8046-XXXX';
  const API_KEY = 'AstraCS:kzIHnuCiopRfjsDeJYFxXZeQ:adbfc7181eaa8012ddb3616fe0f030ac94dc9971574efcba4ebeb2920354474d';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.result || data.text || 'No itinerary generated';
  } catch (error) {
    console.error('Failed to generate itinerary:', error);
    throw new Error('Failed to generate itinerary. Please try again.');
  }
}
