
import { z } from 'zod';

export const travelFormSchema = z.object({
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

export type TravelFormValues = z.infer<typeof travelFormSchema>;
