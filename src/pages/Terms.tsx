import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Disc3 } from 'lucide-react';

const Terms = () => {
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
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-white/60 mb-8">Last updated: December 2024</p>

        <div className="prose prose-invert prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-white/80 leading-relaxed">
              By accessing or using Anthem ("the Service"), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-white/80 leading-relaxed">
              Anthem is an AI-powered music generation platform that creates personalized songs based on your
              stories and memories. The Service uses artificial intelligence to generate unique audio content
              and artwork.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <div className="text-white/80 leading-relaxed space-y-4">
              <p>To use certain features, you must create an account. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Credits and Payments</h2>
            <div className="text-white/80 leading-relaxed space-y-4">
              <p><strong>Credits:</strong> Song generation requires credits. Each song costs 1 credit to generate.</p>
              <p><strong>Purchases:</strong> Credits are purchased through our payment processor (Stripe). All sales are final.</p>
              <p><strong>Refunds:</strong> We may offer refunds at our discretion for technical issues that prevent song generation. Credits do not expire.</p>
              <p><strong>Pricing:</strong> We reserve the right to modify pricing at any time. Existing credit balances remain valid.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. User Content</h2>
            <div className="text-white/80 leading-relaxed space-y-4">
              <p><strong>Your Content:</strong> You retain ownership of the stories, text, and memories you provide ("User Content").</p>
              <p><strong>License to Us:</strong> By submitting User Content, you grant us a license to use it for generating your songs and improving our service.</p>
              <p><strong>Restrictions:</strong> You agree not to submit content that is:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Illegal, harmful, or offensive</li>
                <li>Infringing on others' intellectual property</li>
                <li>Containing personal data of others without consent</li>
                <li>Spam or misleading</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Generated Content Ownership</h2>
            <div className="text-white/80 leading-relaxed space-y-4">
              <p><strong>Your Songs:</strong> You own the songs generated for you through Anthem. You may use, download, share, and distribute them freely for personal and commercial purposes.</p>
              <p><strong>AI-Generated Nature:</strong> You acknowledge that songs are created by AI and may have similarities to other AI-generated content. We do not guarantee uniqueness or copyright protection.</p>
              <p><strong>No Guarantees:</strong> AI generation results vary. We do not guarantee specific quality, style, or output.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Prohibited Uses</h2>
            <div className="text-white/80 leading-relaxed">
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Attempt to reverse engineer our AI systems</li>
                <li>Abuse, harass, or harm others through the Service</li>
                <li>Circumvent usage limits or payment requirements</li>
                <li>Use automated systems to access the Service without permission</li>
                <li>Resell or redistribute credits</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-white/80 leading-relaxed">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE UNINTERRUPTED
              SERVICE, ERROR-FREE OPERATION, OR SPECIFIC RESULTS. AI-GENERATED CONTENT QUALITY MAY VARY.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-white/80 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ANTHEM SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL
              NOT EXCEED THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Account Termination</h2>
            <div className="text-white/80 leading-relaxed space-y-4">
              <p>We may suspend or terminate your account if you violate these terms. You may delete your account at any time through Settings.</p>
              <p>Upon termination, your right to use the Service ceases. Downloaded songs remain yours.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p className="text-white/80 leading-relaxed">
              We may modify these terms at any time. Continued use after changes constitutes acceptance.
              We will notify you of significant changes via email or in-app notification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
            <p className="text-white/80 leading-relaxed">
              These terms are governed by the laws of the United States. Any disputes shall be resolved
              in the courts of [Your State/Jurisdiction].
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Contact</h2>
            <p className="text-white/80 leading-relaxed">
              Questions about these terms? Contact us at legal@anthem.fm
            </p>
          </section>
        </div>
      </motion.main>
    </div>
  );
};

export default Terms;
