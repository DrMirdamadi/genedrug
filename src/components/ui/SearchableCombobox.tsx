import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/utils';
import { Drug } from '@/types/drug';

interface SearchableComboboxProps {
  value: string;
  onChange: (value: string) => void;
  options: Drug[];
  placeholder?: string;
  isLoading?: boolean;
  error?: string;
}

export function SearchableCombobox({
  value,
  onChange,
  options,
  placeholder = 'Select a drug...',
  isLoading,
  error,
}: SearchableComboboxProps) {
  return (
    <div className="relative">
      <SelectPrimitive.Root value={value} onValueChange={onChange}>
        <SelectPrimitive.Trigger
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500'
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="relative z-50 min-w-[200px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80">
            <SelectPrimitive.Viewport className="p-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : options.length === 0 ? (
                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none">
                  No results found
                </div>
              ) : (
                options.map((drug) => (
                  <SelectPrimitive.Item
                    key={drug.id}
                    value={drug.id}
                    className="relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <SelectPrimitive.ItemIndicator>
                        <Check className="h-4 w-4" />
                      </SelectPrimitive.ItemIndicator>
                    </span>
                    <SelectPrimitive.ItemText>{drug.name}</SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))
              )}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
} 