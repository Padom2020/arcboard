'use client';

import { useState, useEffect } from 'react';
import { ContractTemplateSelector, ContractConfigForm, ContractPreview } from '@/components/contracts';
import { ContractTemplate } from '@/lib/contracts/templates';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/toast';

interface GeneratedContract {
  code: string;
  language: 'solidity';
  template: string;
  parameters: Record<string, any>;
}

export default function ContractsPage() {
  const { addToast } = useToast();
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
  const [generatedContract, setGeneratedContract] = useState<GeneratedContract>();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>();
  const [generateError, setGenerateError] = useState<string>();

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch('/api/contracts/templates');
        
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }
        
        const data = await response.json();
        setTemplates(data.templates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTemplates();
  }, []);

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setGeneratedContract(undefined);
    setGenerateError(undefined);
  };

  const handleGenerate = async (parameters: Record<string, any>) => {
    if (!selectedTemplateId) return;
    
    setIsGenerating(true);
    setGenerateError(undefined);
    
    try {
      const response = await fetch('/api/contracts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          parameters,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate contract');
      }
      
      setGeneratedContract(data.contract);
      addToast({
        title: 'Success!',
        description: 'Smart contract generated successfully',
        variant: 'success',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setGenerateError(errorMessage);
      addToast({
        title: 'Generation Failed',
        description: errorMessage,
        variant: 'error',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setSelectedTemplateId(undefined);
    setGeneratedContract(undefined);
    setGenerateError(undefined);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </div>
    );
  }

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Smart Contract Generator</h1>
        <p className="text-muted-foreground">
          Generate secure smart contracts using OpenZeppelin templates
        </p>
      </div>

      {!selectedTemplateId ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Select a Template</h2>
          <ContractTemplateSelector
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={handleSelectTemplate}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={handleReset}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Button>

          {generateError && (
            <Alert variant="destructive">
              <AlertDescription>{generateError}</AlertDescription>
            </Alert>
          )}

          {!generatedContract ? (
            selectedTemplate && (
              <ContractConfigForm
                template={selectedTemplate}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            )
          ) : (
            <div className="space-y-6">
              <ContractPreview contract={generatedContract} />
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setGeneratedContract(undefined)}
                >
                  Generate Another Contract
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
