import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicy() {
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
              <h2 className="text-2xl font-bold">Privacy Policy</h2>
              <p className="text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Privacy Content */}
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardContent className="p-8 space-y-6">
              <section>
                <h3 className="text-xl font-semibold mb-3">1. Information We Collect</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We collect information you provide directly to us and information we obtain automatically when you use our Service.
                </p>
                
                <h4 className="text-lg font-medium mb-2">Information You Provide:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-3">
                  <li>Account information (name, email address)</li>
                  <li>Profile information and preferences</li>
                  <li>Code submissions and solutions</li>
                  <li>Communications with us</li>
                </ul>

                <h4 className="text-lg font-medium mb-2">Information We Collect Automatically:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Usage data and analytics</li>
                  <li>Device and browser information</li>
                  <li>IP address and location data</li>
                  <li>Performance and error logs</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">2. How We Use Your Information</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We use the information we collect to provide, maintain, and improve our Service:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Provide personalized coding challenges and feedback</li>
                  <li>Track your progress and maintain your profile</li>
                  <li>Analyze usage patterns to improve our Service</li>
                  <li>Communicate with you about your account and our Service</li>
                  <li>Ensure security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">3. Information Sharing</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>With your explicit consent</li>
                  <li>To comply with legal requirements</li>
                  <li>To protect our rights and safety</li>
                  <li>With service providers who assist in operating our Service</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">4. Data Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">5. Data Retention</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information for as long as necessary to provide our Service and fulfill the purposes outlined in this Privacy Policy. 
                  You may request deletion of your account and associated data at any time.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">6. Third-Party Services</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Our Service may integrate with third-party services:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li><strong>Google OAuth:</strong> For authentication (subject to Google's Privacy Policy)</li>
                  <li><strong>Supabase:</strong> For data storage and authentication</li>
                  <li><strong>Google AI:</strong> For challenge generation and code evaluation</li>
                  <li><strong>Analytics Services:</strong> For usage analytics and performance monitoring</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">7. Your Rights</h3>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Access and receive a copy of your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Delete your personal information</li>
                  <li>Restrict or object to processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">8. Cookies and Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your experience, analyze usage, and provide personalized content. 
                  You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">9. Children's Privacy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. 
                  If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">10. International Data Transfers</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place 
                  to protect your personal information in accordance with this Privacy Policy.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">11. Changes to This Policy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
                  and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-3">12. Contact Us</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us through our support channels. 
                  We will respond to your inquiries promptly.
                </p>
              </section>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Questions about our privacy practices?{' '}
              <Link href="/terms" className="text-primary hover:underline">
                View our Terms of Service
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