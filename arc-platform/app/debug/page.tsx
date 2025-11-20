'use client';

import { useState } from 'react';
import { DebugForm, DebugSuggestions, DebugSuggestion } from '@/components/debug';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, MessageSquare, RefreshCw } from 'lucide-react';

interface DebugResponse {
  suggestions: DebugSuggestion[];
  rawResponse?: string;
}

export default function DebugPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [debugResponse, setDebugResponse] = useState<DebugResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    errorMessage: string;
    codeSnippet?: string;
    context?: string;
  } | null>(null);

  const handleSubmit = async (data: {
    errorMessage: string;
    codeSnippet?: string;
    context?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setDebugResponse(null);
    setSubmittedData(data);

    try {
      const response = await fetch('/api/debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get debugging suggestions');
      }

      const result = await response.json();
      setDebugResponse(result);
    } catch (err: any) {
      console.error('Debug error:', err);
      setError(err.message || 'An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewDebug = () => {
    setDebugResponse(null);
    setError(null);
    setSubmittedData(null);
  };

  const handleFollowUp = () => {
    // For follow-up, we'll keep the submitted data visible but allow new submission
    setDebugResponse(null);
    setError(null);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Debugging Assistant</h1>
        <p className="text-muted-foreground">
          Get AI-powered help to debug your ARC blockchain development issues
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div>
          <DebugForm onSubmit={handleSubmit} isLoading={isLoading} />

          {/* How it works */}
          {!debugResponse && !error && (
            <Card className="mt-6 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                How it works
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">1.</span>
                  <span>Paste your error message and relevant code snippet</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">2.</span>
                  <span>Our AI analyzes the error in the context of ARC blockchain</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">3.</span>
                  <span>Get structured solutions with code examples and explanations</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">4.</span>
                  <span>Submit follow-up questions if you need more help</span>
                </li>
              </ul>
            </Card>
          )}
        </div>

        {/* Right Column - Results */}
        <div>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {debugResponse && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Results</h2>
                <Button
                  onClick={handleNewDebug}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  New Debug Session
                </Button>
              </div>

              <DebugSuggestions
                suggestions={debugResponse.suggestions}
                rawResponse={debugResponse.rawResponse}
              />

              {/* Follow-up section */}
              <Card className="p-6 bg-muted/50">
                <h3 className="font-semibold mb-2">Need more help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If these suggestions don't solve your issue, you can submit a follow-up
                  with additional details or try our AI Assistant for a conversational approach.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleFollowUp}
                    variant="outline"
                    size="sm"
                  >
                    Submit Follow-up
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/assistant'}
                    variant="outline"
                    size="sm"
                  >
                    Try AI Assistant
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Submitted data display (for context) */}
          {submittedData && debugResponse && (
            <Card className="mt-6 p-6">
              <h3 className="font-semibold mb-3">Your Submission</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground mb-1">Error Message:</p>
                  <p className="font-mono text-xs bg-muted p-2 rounded whitespace-pre-wrap">
                    {submittedData.errorMessage}
                  </p>
                </div>
                {submittedData.codeSnippet && (
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Code Snippet:</p>
                    <p className="font-mono text-xs bg-muted p-2 rounded whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {submittedData.codeSnippet}
                    </p>
                  </div>
                )}
                {submittedData.context && (
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Context:</p>
                    <p className="text-xs bg-muted p-2 rounded">
                      {submittedData.context}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
