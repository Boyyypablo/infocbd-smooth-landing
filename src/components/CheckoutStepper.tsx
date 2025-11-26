import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  label: string;
}

interface CheckoutStepperProps {
  currentStep: number;
  steps: Step[];
}

export const CheckoutStepper = ({ currentStep, steps }: CheckoutStepperProps) => {
  return (
    <div className="flex items-center justify-between mb-6 md:mb-8 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const isUpcoming = step.number > currentStep;

        return (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                  isCompleted && "bg-[#6B2C91] text-white",
                  isCurrent && "bg-[#6B2C91] text-white ring-4 ring-[#6B2C91]/20",
                  isUpcoming && "bg-gray-200 text-gray-500"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              {/* Label */}
              <div className="mt-2 text-center min-w-[80px]">
                <p
                  className={cn(
                    "text-xs md:text-sm font-medium whitespace-nowrap",
                    isCurrent && "text-[#6B2C91]",
                    isCompleted && "text-[#6B2C91]",
                    isUpcoming && "text-gray-500"
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 transition-all",
                  isCompleted ? "bg-[#6B2C91]" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

