import React from 'react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-white text-black pt-32 pb-16 px-6 border-t border-neutral-100" role="contentinfo">
            <div className="max-w-7xl mx-auto lg:px-12">
                <div className="grid md:grid-cols-2 gap-32 mb-32">
                    <div>
                        <h2 className="text-5xl font-extrabold mb-8 tracking-tighter">Benasa Studios</h2>
                        <p className="text-lg font-light mb-6">Your Remote Creative Department</p>
                        <div className="space-y-3 text-sm text-neutral-600 font-light mb-12">
                            <p>🌍 Clients in 🇬🇭 🇳🇬 🇬🇧 🇺🇸 🇨🇦 🇰🇪</p>
                            <p>🔒 NDA protected</p>
                            <p>⚡ 2hr response</p>
                            <p>✓ 200+ projects</p>
                            <p>⭐ 4.9/5 rating</p>
                        </div>
                        <div className="space-y-2 text-xs text-neutral-500 font-bold uppercase tracking-widest">
                            <p><a href="#pricing" onClick={() => typeof window.showPage !== 'undefined' && window.showPage('home')} className="hover:text-black transition">Pricing</a> • <a href="#model" onClick={() => typeof window.showPage !== 'undefined' && window.showPage('home')} className="hover:text-black transition">About</a></p>
                            <p><a href="#contact" onClick={() => typeof window.showPage !== 'undefined' && window.showPage('home')} className="hover:text-black transition">Contact</a></p>
                        </div>
                    </div>
                    <div>
                        {/* Netlify Forms Configuration Applied Here */}
                        <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" aria-label="Contact form to inquire about studio services" className="space-y-6">
                            {/* Hidden field for Netlify bot protection */}
                            <p className="hidden">
                                <label>Don’t fill this out if you're human: <input name="bot-field" /></label>
                            </p>
                            {/* Form Name for Netlify dashboard */}
                            <input type="hidden" name="form-name" value="contact" />
                            
                            <div className="grid grid-cols-2 gap-6">
                                <input type="text" name="name" placeholder="NAME" required className="w-full bg-transparent border-b border-neutral-200 py-4 text-xs outline-none focus:border-black transition" />
                                <input type="email" name="email" placeholder="EMAIL" required className="w-full bg-transparent border-b border-neutral-200 py-4 text-xs outline-none focus:border-black transition" />
                            </div>
                            <select id="form-pack" name="package" className="w-full bg-transparent border-b border-neutral-200 py-4 text-xs outline-none focus:border-black transition">
                                <option value="Starter">Starter</option>
                                <option value="Standard">Standard</option>
                                <option value="Plus">Plus</option>
                                <option value="Enterprise">Enterprise</option>
                            </select>
                            <textarea name="message" placeholder="PROJECT NOTES" rows="3" className="w-full bg-transparent border-b border-neutral-200 py-4 text-xs outline-none focus:border-black transition"></textarea>
                            <button type="submit" className="btn-black w-full py-5 text-[0.7rem] font-bold uppercase tracking-widest">Send Request</button>
                        </form>
                        <div id="form-success" className="hidden text-center py-10">
                            <p className="text-sm font-bold uppercase tracking-widest">Inquiry Received</p>
                        </div>
                    </div>
                </div>
                <div className="pt-12 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center text-[0.6rem] text-neutral-400 font-bold uppercase tracking-widest">
                    <p>Benasa Studios © 2026 • Accra, Ghana</p>
                    <div className="flex space-x-12 mt-6 md:mt-0">
                        <button onClick={() => typeof window.showPage !== 'undefined' && window.showPage('privacy')}>Privacy</button>
                        <button onClick={() => typeof window.showPage !== 'undefined' && window.showPage('legal')}>Legal</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
