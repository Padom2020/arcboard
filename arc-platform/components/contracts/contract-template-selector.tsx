'use client';

import { ContractTemplate } from '@/lib/contracts/templates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ContractTemplateSelectorProps {
  templates: ContractTemplate[];
  selectedTemplateId?: string;
  onSelectTemplate: (templateId: string) => void;
}

export function ContractTemplateSelector({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: ContractTemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => {
        const isSelected = selectedTemplateId === template.id;
        
        return (
          <Card
            key={template.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              isSelected && 'ring-2 ring-primary'
            )}
            onClick={() => onSelectTemplate(template.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {template.icon && (
                    <span className="text-2xl">{template.icon}</span>
                  )}
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </div>
                <Badge variant="outline">{template.category}</Badge>
              </div>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {template.parameters.filter((p) => p.required).length} required parameters
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
