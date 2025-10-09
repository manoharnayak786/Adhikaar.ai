import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Copy, Save, ExternalLink, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

export const AnswerBlock = ({ answer, onSave }) => {
  const [copied, setCopied] = useState(false);

  if (!answer) return null;

  const handleCopy = () => {
    const text = `${answer.title}\n\n${answer.summary}\n\nSteps:\n${answer.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard', {
      className: 'bg-card border-success text-foreground',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSave(answer);
    toast.success('Saved to Case Wallet', {
      className: 'bg-card border-success text-foreground',
    });
  };

  return (
    <section className="mt-6 space-y-4" data-testid="answer-block">
      <Card className="rounded-lg border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <h2
              className="font-display text-lg sm:text-xl font-semibold"
              data-testid="answer-title"
            >
              {answer.title}
            </h2>
            <span
              className="text-xs text-muted-foreground whitespace-nowrap"
              data-testid="answer-updated"
            >
              {answer.updated || 'Updated: Today'}
            </span>
          </div>
          <p
            className="mt-2 text-muted-foreground leading-7"
            data-testid="answer-summary"
          >
            {answer.summary}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {answer.steps && answer.steps.length > 0 && (
              <div data-testid="answer-steps">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Action Steps
                </h3>
                <ol className="space-y-2">
                  {answer.steps.map((step, index) => (
                    <li key={index} className="text-sm leading-relaxed flex gap-2">
                      <span className="text-primary font-semibold">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                onClick={handleCopy}
                size="sm"
                className="bg-secondary text-secondary-foreground hover:opacity-90"
                data-testid="answer-copy-button"
              >
                {copied ? (
                  <>
                    <CheckCheck className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                onClick={handleSave}
                variant="outline"
                size="sm"
                data-testid="answer-save-button"
              >
                <Save className="h-4 w-4 mr-1" />
                Save to Wallet
              </Button>
            </div>

            {answer.sources && answer.sources.length > 0 && (
              <div className="mt-5 pt-5 border-t">
                <Accordion type="single" collapsible data-testid="answer-sources">
                  <AccordionItem value="sources" className="border-0">
                    <AccordionTrigger className="text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground py-2">
                      View {answer.sources.length} {answer.sources.length === 1 ? 'citation' : 'citations'}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ol className="mt-2 space-y-2">
                        {answer.sources.map((source, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-xs text-muted-foreground">{index + 1}.</span>
                            <div className="flex-1">
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-secondary hover:underline inline-flex items-center gap-1"
                                data-testid={`citation-${index + 1}`}
                              >
                                {source.title}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                              {source.type && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {source.type}
                                </Badge>
                              )}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {answer.template && (
        <Card className="rounded-lg border bg-card shadow-sm">
          <CardHeader>
            <h3 className="font-display text-lg font-semibold">Template</h3>
            <p className="text-sm text-muted-foreground">
              Ready-to-use template for your case
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-accent/20 border border-border rounded-md p-4 font-mono text-sm whitespace-pre-wrap">
              {answer.template}
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(answer.template);
                  toast.success('Template copied!');
                }}
                size="sm"
                data-testid="template-copy-button"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
};
