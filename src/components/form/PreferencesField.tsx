
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { UseFormReturn } from 'react-hook-form';
import { travelPreferences } from '@/lib/form-constants';
import { TravelFormValues } from '@/lib/form-schemas';

interface PreferencesFieldProps {
  form: UseFormReturn<TravelFormValues>;
}

const PreferencesField: React.FC<PreferencesFieldProps> = ({ form }) => {
  const togglePreference = (value: string) => {
    const currentPreferences = form.getValues('preferences');
    const updatedPreferences = currentPreferences.includes(value)
      ? currentPreferences.filter(pref => pref !== value)
      : [...currentPreferences, value];
    
    form.setValue('preferences', updatedPreferences, { shouldValidate: true });
  };

  return (
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
  );
};

export default PreferencesField;
