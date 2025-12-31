import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Disc3 } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Disc3 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-wider">ANTHEM</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
      </nav>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-6 pt-24 pb-16"
      >
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-white/60 mb-8">Last updated: December 2024</p>

        <div className="prose prose-invert prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-white/80 leading-relaxed">
              Anthem ("we," "our," or "us") respects your privacy and is committed to protecting your personal data.
              This privacy policy explains how we collect, use, and safeguard your information when you use our
              AI-powered music generation service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <div className="text-white/80 leading-relaxed space-y-4">
              <p><strong>Account Information:</strong> When you create an account, we collect your email address and password (encrypted).</p>
              <p><strong>Profile Data:</strong> Display name, bio, and profile picture you choose to provide.</p>
              <p><strong>Trip & Story Content:</strong> The stories, locations, and memories you share to generate songs. This content is used solely to create your personalized music.</p>
              <p><strong>Generated Content:</strong> The AI-generated songs and artwork created for you.</p>
              <p><strong>Payment Information:</strong> Processed securely through Stripe. We do not store your credit card details.</p>
              <p><strong>Usage Data:</strong> How you interact with our service to improve the experience.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <ul className="text-white/80 leading-relaxed list-disc pl-6 space-y-2">
              <li>To generate personalized AI songs based on your stories</li>
              <li>To process payments and manage your credit balance</li>
              <li>To enable sharing features you choose to use</li>
              <li>To improve our AI models and service quality</li>
              <li>To communicate important updates about the service</li>
              <li>To prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
            <div className="text-white/80 leading-relaxed space-y-4">
              <p>We use trusted third-party services to power Anthem:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Supabase:</strong> Database and authentication</li>
                <li><strong>ElevenLabs:</strong> AI music generation</li>
                <li><strong>Google Gemini:</strong> AI artwork generation</li>
                <li><strong>Stripe:</strong> Payment processing</li>
              </ul>
              <p>Each service has its own privacy policy. Your story content is sent to AI services only for generation purposes.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing</h2>
            <div className="text-white/80 leading-relaxed space-y-4">
              <p>We do not sell your personal data. We share data only:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With AI services to generate your songs (your stories become lyrics)</li>
                <li>With payment processors to complete transactions</li>
                <li>When you choose to share songs publicly</li>
                <li>If required by law</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
            <div className="text-white/80 leading-relaxed space-y-4">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Delete your account and associated data</li>
                <li>Export your generated songs</li>
                <li>Opt out of marketing communications</li>
              </ul>
              <p>To exercise these rights, contact us at privacy@anthem.fm</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
            <p className="text-white/80 leading-relaxed">
              We implement industry-standard security measures including encryption, secure authentication,
              and regular security audits. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p className="text-white/80 leading-relaxed">
              Anthem is not intended for users under 13 years of age. We do not knowingly collect data from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Changes to This Policy</h2>
            <p className="text-white/80 leading-relaxed">
              We may update this policy periodically. We will notify you of significant changes via email or in-app notification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p className="text-white/80 leading-relaxed">
              Questions about this privacy policy? Contact us at privacy@anthem.fm
            </p>
          </section>
        </div>
      </motion.main>
    </div>
  );
};

export default Privacy;
