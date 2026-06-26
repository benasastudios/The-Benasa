import React from 'react';

const Philosophy = () => {
    return (
        <section id="model" className="section-padding bg-neutral-50 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid md:grid-cols-2 gap-24 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-10 tracking-tight">Institutional <br/><span className="text-neutral-400 font-light italic text-3xl">Memory.</span></h2>
                        <p className="text-neutral-500 mb-12 text-lg leading-relaxed font-light">We don't believe in the agency-client friction. We believe in becoming the silent creative engine of your business.</p>
                        
                        <div className="grid grid-cols-1 gap-12">
                            <div className="border-l-2 border-black pl-8 py-2">
                                <h4 className="font-bold text-xs uppercase tracking-widest mb-2">01. Direct Sync</h4>
                                <p className="text-neutral-500 text-sm">We occupy your Slack or Teams. No middleman. No ticket queues.</p>
                            </div>
                            <div className="border-l-2 border-neutral-200 pl-8 py-2">
                                <h4 className="font-bold text-xs uppercase tracking-widest mb-2">02. Brand DNA</h4>
                                <p className="text-neutral-500 text-sm">One onboarding. Eternal execution. We remember everything.</p>
                            </div>
                            <div className="border-l-2 border-neutral-200 pl-8 py-2">
                                <h4 className="font-bold text-xs uppercase tracking-widest mb-2">03. Elasticity</h4>
                                <p className="text-neutral-500 text-sm">Scale your department up or down based on your growth cycles.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative flex items-center justify-center py-20">
                        <div className="relative w-80 h-80 flex items-center justify-center">
                            <div className="absolute inset-0 border border-black/5 rounded-full animate-float"></div>
                            <div className="absolute inset-10 border border-black/10 rounded-full animate-float" style={{animationDelay: "-1s"}}></div>
                            <div className="absolute inset-20 border border-black/20 rounded-full animate-float" style={{animationDelay: "-2s"}}></div>
                            <div className="z-10 bg-white p-8 minimal-border shadow-xl shadow-black/5">
                                <span className="text-[0.6rem] font-bold tracking-[0.3em] uppercase">Studio Logic</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Philosophy;
