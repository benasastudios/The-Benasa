import React from 'react';

export default function Privacy() {
  return (
    <div id="privacy-page" className="page-transition bg-white min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
            <button className="text-[0.6rem] font-bold uppercase tracking-widest text-neutral-400 mb-12 flex items-center hover:text-black transition">
                <i className="fas fa-arrow-left mr-2"></i> Back to Studio
            </button>
            <h1 className="text-4xl font-extrabold mb-12 tracking-tighter uppercase">Privacy Policy</h1>
            <div className="space-y-12 text-neutral-600 font-light leading-relaxed">
                <div>
                    <h3 className="text-black font-bold uppercase text-xs tracking-widest mb-4">01. Data Collection & Protection</h3>
                    <p>We collect only the data necessary to provide our services. This includes your name, email, phone number, and company information when you register or submit inquiries. We do not sell your data to third parties. All information is stored securely and treated with strict confidentiality. We comply with international data protection standards including GDPR principles.</p>
                </div>
                <div>
                    <h3 className="text-black font-bold uppercase text-xs tracking-widest mb-4">02. Analytics & Performance</h3>
                    <p>We use analytics to understand how visitors interact with our site and improve our services. This includes tracking page views, user interactions, and general usage patterns. No personally identifiable information is collected through analytics, and all data is aggregated and anonymized.</p>
                </div>
                <div>
                    <h3 className="text-black font-bold uppercase text-xs tracking-widest mb-4">03. Geolocation & Currency Detection</h3>
                    <p>We may collect approximate geolocation data (country/region only, not precise GPS coordinates) to automatically detect your currency preference and display pricing in your local currency (GHS, USD, NGN). This geolocation data is not stored permanently and is processed only to enhance your user experience. We do not track your precise location, and you can manually override your currency preference at any time. This data is never shared with third parties.</p>
                </div>
                <div>
                    <h3 className="text-black font-bold uppercase text-xs tracking-widest mb-4">04. Anonymous Visitor Identifiers & Third-Party Services</h3>
                    <p>We use anonymous visitor identifiers (stored locally in your browser) to enhance your experience and prevent duplicate tracking. These identifiers are unique to your browser and do not contain personally identifiable information. We use Firebase (Google) for authentication, analytics, and database services; analytics data helps us understand how visitors use our site. We use Netlify for website hosting, deployment, and form submissions. Netlify may collect information about your visit including IP address and browser type for security and performance purposes. Both Firebase and Netlify have their own privacy policies that govern how they handle data. You can review their policies at firebase.google.com/support/privacy and netlify.com/privacy respectively. By using our site, you acknowledge and accept the privacy practices of these third-party services.</p>
                </div>
                <div>
                    <h3 className="text-black font-bold uppercase text-xs tracking-widest mb-4">05. Your Rights & Contact</h3>
                    <p>You have the right to request access to, correction of, or deletion of your personal data. To exercise these rights or if you have privacy concerns, contact us at <a href="mailto:privacy@benasastudios.com" className="underline">privacy@benasastudios.com</a>. We are committed to responding to all privacy requests within 30 days.</p>
                </div>
            </div>
        </div>
    </div>
  );
}
