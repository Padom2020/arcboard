'use client';

import { useState, FormEvent } from 'react';
import { ContractTemplate, ContractParameter } from '@/lib/contracts/templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface ContractConfigFormProps {
  template: ContractTemplate;
  onGenerate: (parameters: Record<string, any>) => Promise<void>;
  isGenerating: boolean;
}

export function ContractConfigForm({
  template,
  onGenerate,
  isGenerating,
}: ContractConfigFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    template.parameters.forEach((param) => {
      if (param.defaultValue !== undefined) {
        initial[param.name] = param.defaultValue;
      }
    });
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (paramName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [paramName]: value,
    }));
    
    // Clear error for this field
    if (errors[paramName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[paramName];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    template.parameters.forEach((param) => {
      if (param.required) {
        const value = formData[param.name];
        
        if (value === undefined || value === null || value === '') {
          newErrors[param.name] = `${param.name} is required`;
        }
      }
      
      // Type-specific validation
      if (formData[param.name] !== undefined && formData[param.name] !== '') {
        if (param.type === 'number') {
          const numValue = Number(formData[param.name]);
          if (isNaN(numValue)) {
            newErrors[param.name] = 'Must be a valid number';
          }
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Convert number strings to actual numbers
    const processedData: Record<string, any> = {};
    template.parameters.forEach((param) => {
      const value = formData[param.name];
      
      if (value !== undefined && value !== '') {
        if (param.type === 'number') {
          processedData[param.name] = Number(value);
        } else {
          processedData[param.name] = value;
        }
      }
    });
    
    await onGenerate(processedData);
  };

  const renderField = (param: ContractParameter) => {
    const fieldId = `param-${param.name}`;
    const hasError = !!errors[param.name];
    
    switch (param.type) {
      case 'boolean':
        return (
          <div key={param.name} className="flex items-start space-x-3">
            <Checkbox
              id={fieldId}
              checked={formData[param.name] || false}
              onCheckedChange={(checked: boolean) => handleInputChange(param.name, checked)}
              disabled={isGenerating}
            />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor={fieldId}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {param.name}
                {param.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <p className="text-sm text-muted-foreground">
                {param.description}
              </p>
            </div>
          </div>
        );
      
      case 'number':
      case 'string':
      case 'address':
      default:
        return (
          <div key={param.name} className="space-y-2">
            <Label htmlFor={fieldId}>
              {param.name}
              {param.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              id={fieldId}
              type={param.type === 'number' ? 'number' : 'text'}
              placeholder={param.placeholder || ''}
              value={formData[param.name] || ''}
              onChange={(e) => handleInputChange(param.name, e.target.value)}
              disabled={isGenerating}
              className={hasError ? 'border-destructive' : ''}
            />
            <p className="text-sm text-muted-foreground">
              {param.description}
            </p>
            {hasError && (
              <p className="text-sm text-destructive">{errors[param.name]}</p>
            )}
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure {template.name}</CardTitle>
        <CardDescription>
          Fill in the parameters for your smart contract
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {template.parameters.map((param) => renderField(param))}
          
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Contract'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
