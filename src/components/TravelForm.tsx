
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader } from 'lucide-react';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import ItineraryResult from './ItineraryResult';

const currencies = [
  { value: 'USD', label: 'USD (US Dollar)' },
  { value: 'EUR', label: 'EUR (Euro)' },
  { value: 'GBP', label: 'GBP (British Pound)' },
  { value: 'INR', label: 'INR (Indian Rupee)' },
  { value: 'AUD', label: 'AUD (Australian Dollar)' },
  { value: 'CAD', label: 'CAD (Canadian Dollar)' },
  { value: 'JPY', label: 'JPY (Japanese Yen)' },
];

const accommodationTypes = [
  { value: 'hotel', label: 'Hotel' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'resort', label: 'Resort' },
];

const travelPreferences = [
  { value: 'adventure', label: 'Adventure' },
  { value: 'relaxation', label: 'Relaxation' },
  { value: 'culture', label: 'Culture' },
  { value: 'nature', label: 'Nature' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'budget', label: 'Budget' },
  { value: 'family', label: 'Family' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'food', label: 'Food & Dining' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'shopping', label: 'Shopping' },
];

// This simulates the API call
const generateItinerary = async (data: FormValues): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return a mock response based on the form data
  return `
# ${data.destination} Itinerary
## ${format(data.startDate, 'MMM d')} - ${format(data.endDate, 'MMM d, yyyy')}

### Trip Overview
- **Destination:** ${data.destination}
- **Duration:** ${Math.ceil((data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
- **Group Size:** ${data.groupSize} people
- **Budget:** ${data.budgetAmount} ${data.budgetCurrency}
- **Accommodation:** ${data.accommodation}

### Daily Plan

#### Day 1 - Arrival & Settling In
- Morning: Arrival at ${data.destination} airport
- Afternoon: Check-in at your ${data.accommodation.toLowerCase()}
- Evening: Welcome dinner at a local restaurant

#### Day 2 - Exploring ${data.destination}
- Morning: Visit to the main attractions
- Afternoon: ${data.preferences.includes('culture') ? 'Museum tour' : 'Leisure time'}
- Evening: ${data.preferences.includes('nightlife') ? 'Experience local nightlife' : 'Relax at accommodation'}

#### Day 3 - Adventure Day
- Full day: ${data.preferences.includes('adventure') ? 'Hiking and outdoor activities' : 'City tour and shopping'}
- Evening: ${data.preferences.includes('food') ? 'Cooking class with local cuisine' : 'Dinner at recommended restaurant'}

### Recommendations
Based on your preferences (${data.preferences.join(', ')}), we suggest:
- ${data.preferences.includes('nature') ? 'Visit the national park outside the city' : 'Take a guided city tour'}
- ${data.preferences.includes('luxury') ? 'Book a spa day at a 5-star hotel' : 'Explore local markets'}
- ${data.preferences.includes('budget') ? 'Use public transportation to save money' : 'Rent a car for convenience'}

${data.notes ? `### Additional Notes\n${data.notes}` : ''}

Enjoy your trip to ${data.destination}!
  `;
};

// Define the form schema with Zod
const formSchema = z.object({
  destination: z.string().min(2, { message: 'Destination must be at least 2 characters' }),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  groupSize: z.coerce.number().min(1, { message: 'Group size must be at least 1' }),
  budgetAmount: z.coerce.number().min(1, { message: 'Budget amount must be at least 1' }),
  budgetCurrency: z.string({ required_error: 'Please select a currency' }),
  accommodation: z.string({ required_error: 'Please select an accommodation type' }),
  preferences: z.array(z.string()).min(1, { message: 'Select at least one preference' }),
  notes: z.string().optional(),
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type FormValues = z.infer<typeof formSchema>;

const TravelForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      groupSize: 2,
      budgetAmount: 1000,
      budgetCurrency: 'USD',
      accommodation: 'hotel',
      preferences: [],
      notes: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      setItinerary(null);
      
      const result = await generateItinerary(data);
      
      setItinerary(result);
      toast.success('Itinerary generated successfully!');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast.error('Failed to generate itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for adding/removing preferences
  const togglePreference = (value: string) => {
    const currentPreferences = form.getValues('preferences');
    const updatedPreferences = currentPreferences.includes(value)
      ? currentPreferences.filter(pref => pref !== value)
      : [...currentPreferences, value];
    
    form.setValue('preferences', updatedPreferences, { shouldValidate: true });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Paris, Tokyo, New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => 
                          date < new Date() || 
                          (form.getValues('startDate') && date < form.getValues('startDate'))
                        }
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="groupSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Size</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="budgetAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Amount</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budgetCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accommodation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Accommodation Preference</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select accommodation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accommodationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferences"
              render={() => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Travel Preferences</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {travelPreferences.map((pref) => {
                        const isSelected = form.getValues('preferences').includes(pref.value);
                        return (
                          <Badge
                            key={pref.value}
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer hover:bg-muted-foreground/10",
                              isSelected && "bg-travel-500 hover:bg-travel-600"
                            )}
                            onClick={() => togglePreference(pref.value)}
                          >
                            {pref.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any special requests or information?"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include any special requirements or preferences not covered above.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full travel-gradient"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" /> Generating Itinerary...
              </>
            ) : (
              'Generate Itinerary'
            )}
          </Button>
        </form>
      </Form>

      {itinerary && !isLoading && (
        <div className="mt-8 animate-fade-in">
          <ItineraryResult itinerary={itinerary} />
        </div>
      )}
    </div>
  );
};

export default TravelForm;
