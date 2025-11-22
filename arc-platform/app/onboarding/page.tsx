'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  OnboardingProgress,
  TutorialStep,
  TutorialNavigation,
  OnboardingChecklist,
} from '@/components/onboarding';
import {
  tutorials,
  getTutorialById,
  getTutorialDuration,
  Tutorial,
} from '@/lib/tutorials/content';
import { BookOpen, Clock, Award } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface UserProgress {
  userId: string;
  completedSteps: string[];
  currentStep: string | null;
}

export default function OnboardingPage() {
  const { addToast } = useToast();
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState<UserProgress>({
    userId: '',
    completedSteps: [],
    currentStep: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load progress on mount
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const response = await fetch('/api/progress');
      if (response.ok) {
        const data = await response.json();
        setProgress(data.data);

        // If user has a current step, find and load that tutorial
        if (data.data.currentStep) {
          const tutorial = tutorials.find((t) =>
            t.steps.some((s) => s.id === data.data.currentStep)
          );
          if (tutorial) {
            setSelectedTutorial(tutorial);
            const stepIndex = tutorial.steps.findIndex(
              (s) => s.id === data.data.currentStep
            );
            if (stepIndex !== -1) {
              setCurrentStepIndex(stepIndex);
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
      addToast({
        title: 'Error',
        description: 'Failed to load your progress',
        variant: 'error',
      });
    }
  };

  const markStepComplete = async () => {
    if (!selectedTutorial) return;

    const currentStep = selectedTutorial.steps[currentStepIndex];
    setIsLoading(true);

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId: currentStep.id,
          currentStep: currentStep.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data.data);

        addToast({
          title: 'Step Completed!',
          description: 'Great job! Keep going.',
          variant: 'success',
        });

        // Auto-advance to next step if not last
        if (currentStepIndex < selectedTutorial.steps.length - 1) {
          setTimeout(() => {
            setCurrentStepIndex(currentStepIndex + 1);
          }, 500);
        } else {
          // Tutorial completed
          addToast({
            title: 'Tutorial Completed!',
            description: `You've completed ${selectedTutorial.title}`,
            variant: 'success',
            duration: 7000,
          });
        }
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
      addToast({
        title: 'Error',
        description: 'Failed to save your progress',
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepNavigation = (index: number) => {
    setCurrentStepIndex(index);
    if (selectedTutorial) {
      const step = selectedTutorial.steps[index];
      updateCurrentStep(step.id);
    }
  };

  const updateCurrentStep = async (stepId: string) => {
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepId: stepId,
          currentStep: stepId,
        }),
      });
    } catch (error) {
      console.error('Failed to update current step:', error);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      handleStepNavigation(currentStepIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedTutorial && currentStepIndex < selectedTutorial.steps.length - 1) {
      handleStepNavigation(currentStepIndex + 1);
    }
  };

  const selectTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setCurrentStepIndex(0);
    if (tutorial.steps.length > 0) {
      updateCurrentStep(tutorial.steps[0].id);
    }
  };

  const backToTutorials = () => {
    setSelectedTutorial(null);
    setCurrentStepIndex(0);
  };

  // Tutorial selection view
  if (!selectedTutorial) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Onboarding Guide</h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Learn everything you need to know about building on Arcboard blockchain
          </p>
        </div>

        {/* Overall Progress */}
        {progress.completedSteps.length > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Great Progress!</h3>
                  <p className="text-sm text-muted-foreground">
                    You've completed {progress.completedSteps.length} steps
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tutorial Categories */}
        <div className="space-y-8">
          {(['beginner', 'intermediate', 'advanced'] as const).map((category) => {
            const categoryTutorials = tutorials.filter((t) => t.category === category);
            if (categoryTutorials.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="text-2xl font-semibold mb-4 capitalize">{category}</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {categoryTutorials.map((tutorial) => {
                    const completedCount = tutorial.steps.filter((step) =>
                      progress.completedSteps.includes(step.id)
                    ).length;
                    const totalSteps = tutorial.steps.length;
                    const isCompleted = completedCount === totalSteps;
                    const isInProgress = completedCount > 0 && !isCompleted;

                    return (
                      <Card
                        key={tutorial.id}
                        className="hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => selectTutorial(tutorial)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Badge
                              variant={
                                category === 'beginner'
                                  ? 'default'
                                  : category === 'intermediate'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {category}
                            </Badge>
                            {isCompleted && (
                              <Badge variant="default" className="bg-green-600">
                                Completed
                              </Badge>
                            )}
                            {isInProgress && (
                              <Badge variant="default" className="bg-blue-600">
                                In Progress
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl">{tutorial.title}</CardTitle>
                          <CardDescription>{tutorial.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {totalSteps} steps
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {getTutorialDuration(tutorial.id)} min
                              </div>
                            </div>
                            {completedCount > 0 && (
                              <div>
                                <div className="flex items-center justify-between mb-1 text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium">
                                    {Math.round((completedCount / totalSteps) * 100)}%
                                  </span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary transition-all"
                                    style={{
                                      width: `${(completedCount / totalSteps) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Tutorial view
  const currentStep = selectedTutorial.steps[currentStepIndex];
  const isCurrentStepCompleted = progress.completedSteps.includes(currentStep.id);
  const tutorialCompletedSteps = selectedTutorial.steps.filter((step) =>
    progress.completedSteps.includes(step.id)
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={backToTutorials} className="mb-4 touch-manipulation">
          ← Back to Tutorials
        </Button>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{selectedTutorial.title}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{selectedTutorial.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <TutorialStep step={currentStep} isCompleted={isCurrentStepCompleted} />
          <TutorialNavigation
            currentStepIndex={currentStepIndex}
            totalSteps={selectedTutorial.steps.length}
            isCurrentStepCompleted={isCurrentStepCompleted}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onMarkComplete={markStepComplete}
            isLoading={isLoading}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <OnboardingProgress
            completedSteps={tutorialCompletedSteps.map((s) => s.id)}
            totalSteps={selectedTutorial.steps.length}
            tutorialTitle={selectedTutorial.title}
          />
          <OnboardingChecklist
            tutorial={selectedTutorial}
            completedSteps={progress.completedSteps}
            currentStepId={currentStep.id}
            onStepClick={handleStepNavigation}
          />
        </div>
      </div>
    </div>
  );
}
