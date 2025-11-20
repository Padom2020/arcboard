'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface TutorialNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  isCurrentStepCompleted: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onMarkComplete: () => void;
  isLoading?: boolean;
}

export function TutorialNavigation({
  currentStepIndex,
  totalSteps,
  isCurrentStepCompleted,
  onPrevious,
  onNext,
  onMarkComplete,
  isLoading = false,
}: TutorialNavigationProps) {
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isLoading}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        {!isCurrentStepCompleted && (
          <Button
            onClick={onMarkComplete}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Mark Complete
          </Button>
        )}

        {isCurrentStepCompleted && !isLastStep && (
          <Button
            onClick={onNext}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            Next Step
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}

        {isCurrentStepCompleted && isLastStep && (
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <CheckCircle className="h-5 w-5" />
            Tutorial Complete!
          </div>
        )}
      </div>
    </div>
  );
}
