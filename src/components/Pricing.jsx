import React from 'react';

export default function Pricing() {
  return (
    <>
        <section id="pricing" className="py-40 bg-neutral-900 text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <div className="text-center mb-24 reveal">
                    <h2 className="text-5xl font-extrabold mb-6 tracking-tighter">Partnerships.</h2>
                    <p className="text-neutral-400 font-light text-xl max-w-2xl mx-auto">Transparent access to a world-class creative department, structured by depth of relationship, speed, and integration.</p>
                </div>

                <div className="pricing-toggle">
                    <button className="currency-btn active">GHS (₵)</button>
                    <button className="currency-btn">USD ($)</button>
                    <button className="currency-btn">NGN (₦)</button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
                    {/* Starter */}
                    <div className="bg-neutral-800 p-8 border border-white/5 flex flex-col justify-between">
                        <div>
                            <h4 className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-neutral-500 mb-6">Starter</h4>
                            <div className="mb-6">
                                <span className="text-2xl font-extrabold price-val" data-price-ghs="₵699" data-price-usd="$66" data-price-ngn="₦8,039">₵699</span>
                                <p className="text-[0.65rem] text-neutral-400 mt-2 uppercase tracking-wide">Fix</p>
                            </div>
                            <ul className="space-y-3 text-[0.7rem] text-neutral-400 font-light border-t border-white/5 pt-6">
                                <li>One creative project</li>
                                <li>14-day intensive cycle</li>
                                <li>One primary deliverable</li>
                                <li>One revision loop</li>
                                <li>Clear success criteria</li>
                            </ul>
                        </div>
                        <a href="https://wa.me/233554116131?text=Hi%20Benasa%20Studios,%20I'm%20interested%20in%20the%20Starter%20Tier." target="_blank" rel="noreferrer" className="w-full mt-10 py-4 border border-white/10 text-white text-[0.6rem] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition text-center">Start Trial</a>
                    </div>

                    {/* Standard */}
                    <div className="bg-neutral-800 p-8 border border-white/5 flex flex-col justify-between">
                        <div>
                            <h4 className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-neutral-500 mb-6">Standard</h4>
                            <div className="mb-6">
                                <span className="text-2xl font-extrabold price-val" data-price-ghs="₵1,299" data-price-usd="$122" data-price-ngn="₦14,939">₵1,299</span>
                                <p className="text-[0.65rem] text-neutral-400 mt-2 uppercase tracking-wide">Reliable / Monthly</p>
                            </div>
                            <ul className="space-y-3 text-[0.7rem] text-neutral-400 font-light border-t border-white/5 pt-6">
                                <li>Unlimited requests (one active)</li>
                                <li>Daily delivery cadence</li>
                                <li>Shared creative queue</li>
                                <li>Direct Slack integration</li>
                                <li>Execution-focused</li>
                            </ul>
                        </div>
                        <a href="https://wa.me/233554116131?text=Hi%20Benasa%20Studios,%20I'm%20interested%20in%20the%20Standard%20Monthly%20Tier." target="_blank" rel="noreferrer" className="w-full mt-10 py-4 border border-white/10 text-white text-[0.6rem] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition text-center">Open Dept</a>
                    </div>

                    {/* Plus */}
                    <div className="bg-white text-black p-8 flex flex-col justify-between relative">
                        {/* Bip and Label Container */}
                        <div className="absolute top-6 right-6 flex items-center justify-center">
                            <span className="status-bip"></span>
                        </div>
                        <div className="absolute -top-3 left-8 bg-black text-white px-3 py-1 text-[0.5rem] font-black uppercase tracking-widest">Growth</div>
                        <div>
                            <h4 className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-6">Plus</h4>
                            <div className="mb-6">
                                <span className="text-2xl font-extrabold price-val" data-price-ghs="₵1,599" data-price-usd="$150" data-price-ngn="₦18,389">₵1,599</span>
                                <p className="text-[0.65rem] text-neutral-600 mt-2 uppercase tracking-wide">Acceleration / Monthly</p>
                            </div>
                            <ul className="space-y-3 text-[0.7rem] text-neutral-600 font-light border-t border-black/5 pt-6">
                                <li>Priority handling</li>
                                <li>Two parallel active requests</li>
                                <li>Faster turnaround windows</li>
                                <li>Proactive recommendations</li>
                                <li>Monthly strategy session</li>
                            </ul>
                        </div>
                        <a href="https://wa.me/233554116131?text=Hi%20Benasa%20Studios,%20I'd%20like%20to%20get%20started%20with%20the%20Plus%20Tier." target="_blank" rel="noreferrer" className="w-full mt-10 py-4 bg-black text-white text-[0.6rem] font-bold uppercase tracking-widest hover:bg-neutral-800 transition text-center">Get Leverage</a>
                    </div>

                    {/* Enterprise */}
                    <div className="bg-neutral-800 p-8 border border-white/5 flex flex-col justify-between">
                        <div>
                            <h4 className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-neutral-500 mb-6">Enterprise</h4>
                            <div className="mb-6">
                                <span className="text-2xl font-extrabold">Custom</span>
                                <p className="text-[0.65rem] text-neutral-400 mt-2 uppercase tracking-wide">Integration & scale</p>
                            </div>
                            <ul className="space-y-3 text-[0.7rem] text-neutral-400 font-light border-t border-white/5 pt-6">
                                <li>Dedicated creative pod</li>
                                <li>Multi-timezone coverage</li>
                                <li>Defined SLAs & guarantees</li>
                                <li>Stakeholder alignment</li>
                                <li>Market/Brand strategy</li>
                            </ul>
                        </div>
                        <a href="https://wa.me/233554116131?text=Hi%20Benasa%20Studios,%20I'd%20like%20to%20get%20started%20with%20the%20Enterprise%20Tier." target="_blank" rel="noreferrer" className="w-full mt-10 py-4 border border-white/10 text-white text-[0.6rem] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition text-center">Build Pod</a>
                    </div>
                </div>

                <div className="mt-20 text-center reveal">
                    <div className="inline-block p-8 border border-white/5 bg-neutral-800/50 backdrop-blur-sm max-w-2xl">
                        <h4 className="text-[0.65rem] font-black uppercase tracking-[0.4em] mb-4 text-white">Agile Credits</h4>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">Additional flexibility is available through Agile Credits, which can be used alongside Standard plus tiers for short‑term spikes, launches, or overflow needs.</p>
                    </div>
                </div>
            </div>
        </section>

        <div className="comparison section-padding bg-neutral-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="mb-16">
                    <h2 className="text-4xl font-extrabold tracking-tighter mb-4">Tier Comparison</h2>
                    <p className="text-neutral-600 font-light">Feature breakdown across all partnership levels</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Starter</th>
                            <th>Standard</th>
                            <th>Plus</th>
                            <th>Enterprise</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Active Projects</td>
                            <td>1</td>
                            <td>1</td>
                            <td>2</td>
                            <td>Unlimited</td>
                        </tr>
                        <tr>
                            <td>Turnaround</td>
                            <td>14 days</td>
                            <td>2-3 days</td>
                            <td>24-48hrs</td>
                            <td>Custom SLA</td>
                        </tr>
                        <tr>
                            <td>Slack Access</td>
                            <td>No</td>
                            <td>Yes</td>
                            <td>Yes</td>
                            <td>Yes</td>
                        </tr>
                        <tr>
                            <td>Strategy</td>
                            <td>No</td>
                            <td>No</td>
                            <td>Monthly</td>
                            <td>Weekly</td>
                        </tr>
                        <tr>
                            <td>Pause/Cancel</td>
                            <td>N/A</td>
                            <td>Anytime</td>
                            <td>Anytime</td>
                            <td>Custom</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <section className="section-padding bg-neutral-50">
            <div className="max-w-5xl mx-auto px-6 lg:px-12">
                <div className="mb-16">
                    <h2 className="text-4xl font-extrabold tracking-tighter mb-4">Common Questions</h2>
                    <p className="text-neutral-600 font-light">Everything you need to know about working with us</p>
                </div>

                <div className="faq">
                    <div className="faq-item">
                        <div className="faq-question">What counts as "one request"? <span>+</span></div>
                        <div className="faq-answer">One design asset or one page. Example: A logo is one request. A 3-slide pitch deck is one request. A 10-page website is ~10 requests delivered sequentially.</div>
                    </div>

                    <div className="faq-item">
                        <div className="faq-question">How is this different from hiring a freelancer? <span>+</span></div>
                        <div className="faq-answer">Freelancers disappear. We're a studio—if your designer is sick, someone else picks it up. You get reliability, not heroics.</div>
                    </div>

                    <div className="faq-item">
                        <div className="faq-question">How is this different from an agency? <span>+</span></div>
                        <div className="faq-answer">Agencies charge $10K+ per project and take weeks. We're embedded in your workflow for a flat monthly fee. Think in-house team, not project-based vendor.</div>
                    </div>

                    <div className="faq-item">
                        <div className="faq-question">What if I only need work sometimes? <span>+</span></div>
                        <div className="faq-answer">Take the Starter tier for one-off projects, or use Standard and pause when you don't need us. You only pay for active months.</div>
                    </div>

                    <div className="faq-item">
                        <div className="faq-question">Do you work with international clients? <span>+</span></div>
                        <div className="faq-answer">Yes. 60% of our clients are outside Ghana (UK, US, Nigeria, Kenya, Canada). Time zones have never been an issue.</div>
                    </div>

                    <div className="faq-item">
                        <div className="faq-question">What happens to my files? <span>+</span></div>
                        <div className="faq-answer">You own everything. All source files, fonts, code—it's yours. We'll never use your work in our portfolio without permission.</div>
                    </div>

                    <div className="faq-item">
                        <div className="faq-question">What if we're not a good fit? <span>+</span></div>
                        <div className="faq-answer">Cancel anytime with 7 days notice. If you're unhappy in your first month, we'll refund you. We'd rather lose money than ruin our reputation.</div>
                    </div>
                </div>
            </div>
        </section>
    </>
  );
}
