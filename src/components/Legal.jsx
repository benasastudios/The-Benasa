import React from 'react';

export default function Legal() {
  return (
    <div id="legal-page" className="page-transition bg-white min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
            <button className="text-[0.6rem] font-bold uppercase tracking-widest text-neutral-400 mb-12 flex items-center hover:text-black transition">
                <i className="fas fa-arrow-left mr-2"></i> Back to Studio
            </button>
            <h1 className="text-4xl font-extrabold mb-12 tracking-tighter uppercase">Legal Terms</h1>
            <div className="space-y-12 text-neutral-600 font-light leading-relaxed">
                <div>
                    <h3 className="text-black font-bold uppercase text-xs tracking-widest mb-4">01. Service Agreement</h3>
                    <p>By engaging Benasa Studios, you enter into a professional services agreement. All work is delivered as "work for hire," meaning full intellectual property rights transfer to the client upon final payment of the respective invoice.</p>
                </div>
                <div>
                    <h3 className="text-black font-bold uppercase text-xs tracking-widest mb-4">02. Subscription & Tiers</h3>
                    <p>Monthly subscriptions (Standard Pack) are billed in advance. You may pause or cancel at any time with 7 days notice before the next billing cycle.</p>
                </div>
                <div>
                    <h3 className="text-black font-bold uppercase text-xs tracking-widest mb-4">03. Payment Terms</h3>
                    <p>Payments are due within 5 business days of invoice receipt. Overdue accounts exceeding 15 days will incur a late fee of 5% per month.</p>
                </div>
                <div>
                    <h3 className="text-black font-bold uppercase text-xs tracking-widest mb-4">04. Liability & Disclaimer</h3>
                    <p>Benasa Studios provides creative and technical services on an "as-is" basis. Total liability is limited to the fees paid by the client in the 3 months preceding the claim.</p>
                </div>
            </div>
        </div>
    </div>
  );
}
