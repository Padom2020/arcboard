'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Copy, Download } from 'lucide-react';

interface GeneratedContract {
  code: string;
  language: 'solidity';
  template: string;
  parameters: Record<string, any>;
}

interface ContractPreviewProps {
  contract: GeneratedContract;
}

export function ContractPreview({ contract }: ContractPreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(contract.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // Extract contract name from the code (look for "contract <Name>")
    const contractNameMatch = contract.code.match(/contract\s+(\w+)/);
    const contractName = contractNameMatch ? contractNameMatch[1] : 'Contract';
    
    const blob = new Blob([contract.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${contractName}.sol`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Generated Contract</CardTitle>
            <CardDescription>
              Your {contract.template.toUpperCase()} smart contract is ready
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              size="sm"
              variant="outline"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
            <Button
              onClick={handleDownload}
              size="sm"
              variant="default"
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden border">
          <div className="bg-muted px-4 py-2 text-xs font-mono text-muted-foreground border-b">
            solidity
          </div>
          <SyntaxHighlighter
            language="solidity"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}
            showLineNumbers
          >
            {contract.code}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
}
