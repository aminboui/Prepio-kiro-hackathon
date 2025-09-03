import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with back link */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Prepio</span>
        </Link>
      </div>

      <div className="flex items-start justify-center min-h-screen p-4 pt-20">
        <div className="w-full max-w-4xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              Prepio
              </h1>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Terms of Service</h2>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Terms Content */}
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-8 space-y-6">
              <section>
                <h3 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using Prepio ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">2. Description of Service</h3>
                <p className="text-muted-foreground leading-relaxed">
                 Prepio is an AI-powered coding education platform that provides personalized coding challenges, instant feedback, 
                  and progress tracking to help developers improve their programming skills. The service includes:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>AI-generated coding challenges</li>
                  <li>Automated code evaluation and feedback</li>
                  <li>Progress tracking and analytics</li>
                  <li>Gamification features including levels and badges</li>
                  <li>User profiles and achievement systems</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">3. User Accounts</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To access certain features of the Service, you may be required to create an account. You are responsible for:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and complete information</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">4. Acceptable Use</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                  <li>Use the service for any illegal or unauthorized purpose</li>
                  <li>Attempt to gain unauthorized access to any portion of the Service</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Submit malicious code or attempt to exploit vulnerabilities</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">5. Intellectual Property</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of Prepio. 
                  The Service is protected by copyright, trademark, and other laws. You may not reproduce, distribute, or create derivative works without our express written permission.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">6. User Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You retain ownership of any code or content you submit to the Service. By submitting content, you grant us a non-exclusive, 
                  worldwide, royalty-free license to use, reproduce, and display such content solely for the purpose of providing the Service.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">7. Privacy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, 
                  to understand our practices regarding the collection and use of your information.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">8. Disclaimers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The Service is provided "as is" and "as available" without any warranties of any kind. We do not warrant that the Service will be 
                  uninterrupted, error-free, or completely secure. Your use of the Service is at your own risk.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">9. Limitation of Liability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall Prepio be liable for any indirect, incidental, special, consequential, or punitive damages, 
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">10. Changes to Terms</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 
                  30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">11. Contact Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us through our support channels.
                </p>
              </section>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Questions about our terms?{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                View our Privacy Policy
              </Link>
              {' '}or{' '}
              <Link href="/" className="text-primary hover:underline">
                return to Prepio
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}