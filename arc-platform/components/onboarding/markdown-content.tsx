'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  // Simple markdown parser for basic formatting
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactElement[] = [];
    let currentList: string[] = [];
    let currentCodeBlock: { language: string; code: string } | null = null;
    let codeLines: string[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-4 ml-4">
            {currentList.map((item, i) => (
              <li key={i} className="text-muted-foreground">
                {parseInline(item)}
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const flushCodeBlock = () => {
      if (currentCodeBlock) {
        elements.push(
          <div key={`code-${elements.length}`} className="my-4 rounded-lg overflow-hidden">
            <SyntaxHighlighter
              language={currentCodeBlock.language || 'javascript'}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
              }}
            >
              {codeLines.join('\n')}
            </SyntaxHighlighter>
          </div>
        );
        currentCodeBlock = null;
        codeLines = [];
      }
    };

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (currentCodeBlock) {
          flushCodeBlock();
        } else {
          flushList();
          const language = line.slice(3).trim();
          currentCodeBlock = { language, code: '' };
        }
        return;
      }

      if (currentCodeBlock) {
        codeLines.push(line);
        return;
      }

      // Handle headers
      if (line.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={index} className="text-3xl font-bold mt-6 mb-4">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-semibold mt-5 mb-3">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl font-semibold mt-4 mb-2">
            {line.slice(4)}
          </h3>
        );
      }
      // Handle lists
      else if (line.match(/^[-*]\s/)) {
        currentList.push(line.slice(2));
      }
      // Handle empty lines
      else if (line.trim() === '') {
        flushList();
        if (elements.length > 0 && elements[elements.length - 1].type !== 'br') {
          elements.push(<br key={`br-${index}`} />);
        }
      }
      // Handle paragraphs
      else {
        flushList();
        if (line.trim()) {
          elements.push(
            <p key={index} className="text-muted-foreground leading-relaxed my-3">
              {parseInline(line)}
            </p>
          );
        }
      }
    });

    flushList();
    flushCodeBlock();

    return elements;
  };

  const parseInline = (text: string) => {
    const parts: (string | React.ReactElement)[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold text
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      if (boldMatch && boldMatch.index !== undefined) {
        if (boldMatch.index > 0) {
          parts.push(remaining.slice(0, boldMatch.index));
        }
        parts.push(
          <strong key={`bold-${key++}`} className="font-semibold text-foreground">
            {boldMatch[1]}
          </strong>
        );
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
        continue;
      }

      // Inline code
      const codeMatch = remaining.match(/`(.+?)`/);
      if (codeMatch && codeMatch.index !== undefined) {
        if (codeMatch.index > 0) {
          parts.push(remaining.slice(0, codeMatch.index));
        }
        parts.push(
          <code
            key={`code-${key++}`}
            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground"
          >
            {codeMatch[1]}
          </code>
        );
        remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
        continue;
      }

      // Links
      const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);
      if (linkMatch && linkMatch.index !== undefined) {
        if (linkMatch.index > 0) {
          parts.push(remaining.slice(0, linkMatch.index));
        }
        parts.push(
          <a
            key={`link-${key++}`}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {linkMatch[1]}
          </a>
        );
        remaining = remaining.slice(linkMatch.index + linkMatch[0].length);
        continue;
      }

      // No more special formatting
      parts.push(remaining);
      break;
    }

    return parts;
  };

  return <div className="prose prose-sm max-w-none">{parseMarkdown(content)}</div>;
}
