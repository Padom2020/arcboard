'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DebugFormProps {
  onSubmit: (data: { errorMessage: string; codeSnippet?: string; context?: string }) => void;
  isLoading?: boolean;
}

export function DebugForm({ onSubmit, isLoading = false }: DebugFormProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [context, setContext] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validate error message
    if (!errorMessage.trim()) {
      setValidationError('Error message is required');
      return;
    }

    if (errorMessage.length > 5000) {
      setValidationError('Error message is too long (max 5000 characters)');
      return;
    }

    if (codeSnippet && codeSnippet.length > 10000) {
      setValidationError('Code snippet is too long (max 10000 characters)');
      return;
    }

    onSubmit({
      errorMessage: errorMessage.trim(),
      codeSnippet: codeSnippet.trim() || undefined,
      context: context.trim() || undefined,
    });
  };

  const handleClear = () => {
    setErrorMessage('');
    setCodeSnippet('');
    setContext('');
    setValidationError('');
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Describe Your Issue</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Provide details about the error you're encountering, and our AI assistant will help you debug it.
          </p>
        </div>

        {validationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        <div className="space-y-2">
          <Label htmlFor="errorMessage">
            Error Message <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="errorMessage"
            placeholder="Paste your error message here..."
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
            disabled={isLoading}
            rows={4}
            className="font-mono text-sm"
            required
          />
          <p className="text-xs text-muted-foreground">
            {errorMessage.length}/5000 characters
          </p>
        </div>

        {/* Code Snippet */}
        <div className="space-y-2">
          <Label htmlFor="codeSnippet">
            Code Snippet <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <Textarea
            id="codeSnippet"
            placeholder="Paste the relevant code that's causing the error..."
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            disabled={isLoading}
            rows={8}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            {codeSnippet.length}/10000 characters
          </p>
        </div>

        {/* Additional Context */}
        <div className="space-y-2">
          <Label htmlFor="context">
            Additional Context <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <Textarea
            id="context"
            placeholder="Provide any additional context (e.g., what you were trying to do, environment details, etc.)"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            disabled={isLoading}
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isLoading || !errorMessage.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Get Debugging Help'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            disabled={isLoading}
          >
            Clear
          </Button>
        </div>
      </form>
    </Card>
  );
}
