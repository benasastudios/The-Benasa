import React, { useState } from 'react';

const Navigation = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    return (
        <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-xl border-b border-black/5 top-0" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center space-x-3 cursor-pointer group" onClick={scrollToTop}>
                        <div className="w-8 h-8 bg-black flex items-center justify-center transition-transform group-hover:rotate-90">
                            <span className="text-white font-bold text-xs">B</span>
                        </div>
                        <span className="text-lg font-extrabold tracking-tighter uppercase">Benasa Studios</span>
                    </div>
                    
                    <div className="hidden md:flex space-x-12 font-semibold text-[0.8rem] uppercase tracking-widest text-neutral-500">
                        <a href="#model" className="hover:text-black transition">Model</a>
                        <a href="#services" className="hover:text-black transition">Units</a>
                        <a href="#pricing" className="hover:text-black transition">Tiers</a>
                        <a href="#about" className="hover:text-black transition">Story</a>
                        <a href="#contact" className="hover:text-black transition">Connect</a>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <button 
                        className={`md:hidden flex flex-col space-y-1.5 ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={toggleMobileMenu}
                    >
                        <span className={`w-6 h-0.5 bg-black transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-[8px]' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-black transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-6 h-0.5 bg-black transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`}></span>
                    </button>
                </div>
                
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-black/5">
                        <div className="px-6 py-4 space-y-3">
                            <a href="#model" className="block py-2 font-semibold text-[0.8rem] uppercase tracking-widest text-neutral-500 hover:text-black transition" onClick={toggleMobileMenu}>Model</a>
                            <a href="#services" className="block py-2 font-semibold text-[0.8rem] uppercase tracking-widest text-neutral-500 hover:text-black transition" onClick={toggleMobileMenu}>Units</a>
                            <a href="#pricing" className="block py-2 font-semibold text-[0.8rem] uppercase tracking-widest text-neutral-500 hover:text-black transition" onClick={toggleMobileMenu}>Tiers</a>
                            <a href="#about" className="block py-2 font-semibold text-[0.8rem] uppercase tracking-widest text-neutral-500 hover:text-black transition" onClick={toggleMobileMenu}>Story</a>
                            <a href="#contact" className="block py-2 font-semibold text-[0.8rem] uppercase tracking-widest text-neutral-500 hover:text-black transition" onClick={toggleMobileMenu}>Connect</a>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
