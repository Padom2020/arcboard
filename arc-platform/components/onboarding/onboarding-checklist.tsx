'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { Tutorial } from '@/lib/tutorials/content';

interface OnboardingChecklistProps {
  tutorial: Tutorial;
  completedSteps: string[];
  currentStepId: string | null;
  onStepClick: (stepIndex: number) => void;
}

export function OnboardingChecklist({
  tutorial,
  completedSteps,
  currentStepId,
  onStepClick,
}: OnboardingChecklistProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tutorial Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tutorial.steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = step.id === currentStepId;

            return (
              <button
                key={step.id}
                onClick={() => onStepClick(index)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  isCurrent
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-accent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium truncate">
                        {index + 1}. {step.title}
                      </span>
                      {isCurrent && (
                        <Badge variant="default" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {step.estimatedTime} min
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
