import React, { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { UseCaseChips } from '../components/UseCaseChips';
import { AnswerBlock } from '../components/AnswerBlock';
import { SOSPanel } from '../components/SOSPanel';
import { ShieldCheck, Zap, Lock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Home() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setAnswer(null);
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/ask`, {
        query,
        lang: 'en',
        context: { useCase: selectedCase },
      });
      setAnswer(response.data);
      toast.success('Answer generated successfully!');
    } catch (error) {
      console.error('Search error:', error);
      
      let errorMessage = 'Failed to process your question. Please try again.';
      
      if (error.response) {
        // Server responded with error
        if (error.response.status === 429) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (error.response.status === 504) {
          errorMessage = 'The request timed out. Please try with a simpler question.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.detail || 'Invalid question. Please check your input.';
        } else if (error.response.data?.detail) {
          errorMessage = error.response.data.detail;
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToWallet = async (answerData) => {
    try {
      await axios.post(`${BACKEND_URL}/api/v1/wallet/save`, {
        title: answerData.title,
        content: JSON.stringify(answerData),
        tags: [selectedCase],
      });
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-12 md:py-20 overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(53, 224, 184, 0.18) 0%, rgba(108, 168, 255, 0.12) 45%, rgba(11, 15, 20, 0) 70%)',
        }}
      >
        <div className="noise-bg absolute inset-0 opacity-[0.06]" />
        <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1
              className="font-display tracking-tight text-4xl sm:text-5xl lg:text-6xl font-bold"
              data-testid="hero-headline"
            >
              Know your rights.
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Act with confidence.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="hero-subhead">
              India-specific, cited legal guidance in seconds. Powered by AI, verified by law.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-10 max-w-3xl mx-auto">
            <SearchBar onSearch={handleSearch} loading={loading} />
          </div>

          {/* Use Case Chips */}
          <div className="mt-8">
            <UseCaseChips selectedCase={selectedCase} onSelect={setSelectedCase} />
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-6 border-y bg-card/30">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" />
              <span>Bank-grade encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              <span>Answers in under 5 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <span>No data resale</span>
            </div>
          </div>
        </div>
      </section>

      {/* Answer + SOS */}
      <section className="py-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {loading && (
                <div className="space-y-3" data-testid="answer-loading">
                  <div className="h-5 w-2/3 bg-accent/50 rounded animate-pulse" />
                  <div className="h-4 w-full bg-accent/40 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-accent/40 rounded animate-pulse" />
                </div>
              )}
              {answer && !loading && <AnswerBlock answer={answer} onSave={handleSaveToWallet} />}
              {!answer && !loading && (
                <div className="text-center py-16" data-testid="answer-empty-state">
                  <p className="text-muted-foreground">
                    Ask a question to get started with your legal query
                  </p>
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-20">
                <SOSPanel />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 border-t">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-muted-foreground">
            Adhikaar.ai provides general legal information. This is not legal advice and does not create an
            attorney-client relationship. For specific legal matters, please consult a qualified attorney.
          </p>
        </div>
      </section>
    </div>
  );
}
