'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle } from 'lucide-react';

interface OnboardingProgressProps {
  completedSteps: string[];
  totalSteps: number;
  tutorialTitle: string;
}

export function OnboardingProgress({
  completedSteps,
  totalSteps,
  tutorialTitle,
}: OnboardingProgressProps) {
  const completionPercentage = totalSteps > 0 
    ? Math.round((completedSteps.length / totalSteps) * 100) 
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                {tutorialTitle}
              </span>
              <span className="text-sm font-bold text-primary">
                {completionPercentage}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>
              {completedSteps.length} of {totalSteps} steps completed
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
