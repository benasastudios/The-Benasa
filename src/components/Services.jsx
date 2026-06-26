import React from 'react';

const Services = () => {
    return (
        <section id="services" className="section-padding bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-end mb-20">
                    <h2 className="text-5xl font-extrabold tracking-tighter">Units.</h2>
                    <p className="text-neutral-400 text-sm uppercase font-bold tracking-widest pb-2">Capabilities</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-0">
                    <div className="service-card p-12 border border-neutral-100 bg-white group overflow-hidden relative cursor-pointer" onClick={() => typeof window.selectService !== 'undefined' && window.selectService('Design')}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                        <span className="tag text-neutral-300 border-neutral-200 mb-8 inline-block relative z-10">Unit 01</span>
                        <h3 className="text-2xl font-extrabold mb-6 uppercase tracking-tight relative z-10">Design</h3>
                        <ul className="space-y-4 text-neutral-500 text-sm font-light mb-12 relative z-10">
                            <li>Identity & Systems</li>
                            <li>Digital Advertising</li>
                            <li>Interface Design</li>
                            <li>Capital Raising Assets</li>
                        </ul>
                        <div className="line-growth opacity-20"></div>
                    </div>

                    <div className="service-card p-12 border border-neutral-100 bg-white group overflow-hidden relative cursor-pointer" onClick={() => typeof window.selectService !== 'undefined' && window.selectService('Technology')}>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-neutral-50 rounded-full -ml-16 -mb-16 group-hover:scale-150 transition-transform duration-1000"></div>
                        <span className="tag text-neutral-300 border-neutral-200 mb-8 inline-block relative z-10">Unit 02</span>
                        <h3 className="text-2xl font-extrabold mb-6 uppercase tracking-tight relative z-10">Technology</h3>
                        <ul className="space-y-4 text-neutral-500 text-sm font-light mb-12 relative z-10">
                            <li>Performance Web</li>
                            <li>CMS Infrastructure</li>
                            <li>Interaction Design</li>
                            <li>Technical Maintenance</li>
                        </ul>
                        <div className="line-growth opacity-20"></div>
                    </div>

                    <div className="p-12 border border-neutral-100 bg-neutral-900 text-white flex flex-col justify-between overflow-hidden relative group">
                        <div className="absolute inset-0 abstract-pattern invert opacity-10 animate-drift"></div>
                        <div className="relative z-10">
                            <span className="tag text-neutral-500 border-neutral-700 mb-8 inline-block">Future</span>
                            <h3 className="text-2xl font-extrabold mb-6 uppercase tracking-tight text-white">Scale</h3>
                        </div>
                        <p className="text-neutral-400 text-xs font-light tracking-wide leading-relaxed relative z-10">
                            Currently optimizing for Design and Technology. Video Content and Strategy units arriving 2026.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Services;
