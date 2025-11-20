'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CodeBlock } from '@/components/chat/code-block';
import { CheckCircle2, ExternalLink } from 'lucide-react';

export interface DebugSuggestion {
  title: string;
  description: string;
  codeExample?: string;
  references?: string[];
}

interface DebugSuggestionsProps {
  suggestions: DebugSuggestion[];
  rawResponse?: string;
}

export function DebugSuggestions({ suggestions, rawResponse }: DebugSuggestionsProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold">Debugging Suggestions</h3>
        <Badge variant="secondary">{suggestions.length} solution{suggestions.length !== 1 ? 's' : ''}</Badge>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="p-6">
            <div className="space-y-4">
              {/* Title */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold">{suggestion.title}</h4>
                </div>
              </div>

              {/* Description */}
              <div className="pl-11">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {suggestion.description}
                  </p>
                </div>

                {/* Code Example */}
                {suggestion.codeExample && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Example Fix:</p>
                    <CodeBlock
                      code={suggestion.codeExample}
                      language={detectLanguage(suggestion.codeExample)}
                    />
                  </div>
                )}

                {/* References */}
                {suggestion.references && suggestion.references.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">References:</p>
                    <ul className="space-y-1">
                      {suggestion.references.map((ref, refIndex) => (
                        <li key={refIndex}>
                          <a
                            href={ref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {ref}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Raw Response (for debugging) */}
      {process.env.NODE_ENV === 'development' && rawResponse && (
        <details className="mt-4">
          <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
            View raw AI response
          </summary>
          <Card className="mt-2 p-4">
            <pre className="text-xs whitespace-pre-wrap overflow-x-auto">
              {rawResponse}
            </pre>
          </Card>
        </details>
      )}
    </div>
  );
}

// Helper function to detect code language
function detectLanguage(code: string): string {
  if (code.includes('pragma solidity') || code.includes('contract ')) {
    return 'solidity';
  }
  if (code.includes('function') && code.includes('=>')) {
    return 'javascript';
  }
  if (code.includes('const') || code.includes('let') || code.includes('var')) {
    return 'typescript';
  }
  if (code.includes('import') && code.includes('from')) {
    return 'javascript';
  }
  if (code.includes('def ') || code.includes('import ')) {
    return 'python';
  }
  return 'javascript';
}
