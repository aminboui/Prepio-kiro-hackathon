'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the token and type from URL parameters
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token || !type) {
          setStatus('error');
          setMessage('Invalid confirmation link. Please check your email and try again.');
          return;
        }

        if (!supabase) {
          setStatus('error');
          setMessage('Service temporarily unavailable. Please try again later.');
          return;
        }

        // Verify the email confirmation
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any,
        });

        if (error) {
          console.error('Email confirmation error:', error);
          setStatus('error');
          setMessage('Failed to verify your email. The link may have expired or already been used.');
        } else {
          setStatus('success');
          setMessage('Your email has been successfully verified! Welcome to Prepio.');
          
          // Start countdown for redirect
          const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                router.push('/');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, router]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-12 w-12 text-primary animate-spin" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
        return <XCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-primary';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Branding */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            Prepio
            </h1>
          </div>
        </div>

        {/* Confirmation Card */}
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
          <CardContent className="p-8 text-center space-y-6">
            {/* Status Icon */}
            <div className="flex justify-center">
              {getStatusIcon()}
            </div>

            {/* Status Message */}
            <div className="space-y-2">
              <h2 className={`text-xl font-bold ${getStatusColor()}`}>
                {status === 'loading' && 'Verifying Your Email...'}
                {status === 'success' && 'Email Verified Successfully!'}
                {status === 'error' && 'Verification Failed'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {message}
              </p>
            </div>

            {/* Success State - Countdown */}
            {status === 'success' && (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    🎉 You can now access all Prepio features including progress tracking, achievements, and personalized challenges!
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Redirecting to Prepio in <span className="font-bold text-primary">{countdown}</span> seconds...
                </p>
                <Button 
                  onClick={() => router.push('/')}
                  className="w-full"
                >
                  Continue to Prepio
                </Button>
              </div>
            )}

            {/* Error State - Actions */}
            {status === 'error' && (
              <div className="space-y-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    💡 Try signing up again or contact support if the problem persists.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/auth/signup')}
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => router.push('/')}
                    className="flex-1"
                  >
                    Go to Prepio
                  </Button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {status === 'loading' && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Please wait while we verify your email address...
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            Need help?{' '}
            <Link href="/" className="text-primary hover:underline">
              Return to Prepio
            </Link>
            {' '}or contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>}>
      <ConfirmContent />
    </Suspense>
  );
}