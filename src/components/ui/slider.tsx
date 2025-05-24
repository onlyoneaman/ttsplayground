import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const Slider: React.FC<SliderProps> = ({ value, onValueChange, min = 0, max = 100, step = 1, className, ...props }) => {
  return (
    <SliderPrimitive.Root
      className={cn("relative flex w-full touch-none select-none items-center h-6", className)}
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={onValueChange}
      {...props}
    >
      <SliderPrimitive.Track className="bg-muted-foreground/20 relative h-2 w-full grow overflow-hidden rounded-full">
        <SliderPrimitive.Range className="absolute h-full bg-primary rounded-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background shadow transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" />
    </SliderPrimitive.Root>
  );
};
