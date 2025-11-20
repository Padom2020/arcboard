'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { TutorialStep as TutorialStepType } from '@/lib/tutorials/content';
import { MarkdownContent } from './markdown-content';

interface TutorialStepProps {
  step: TutorialStepType;
  isCompleted: boolean;
}

export function TutorialStep({ step, isCompleted }: TutorialStepProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">{step.title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {step.estimatedTime} min
              </Badge>
              {isCompleted && (
                <Badge variant="default" className="bg-green-600">
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <MarkdownContent content={step.content} />
      </CardContent>
    </Card>
  );
}
