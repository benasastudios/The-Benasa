import React from 'react';

export default function Dashboard() {
  return (
    <div id="dashboard-page" className="page-transition bg-white min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-12 tracking-tighter uppercase">Dashboard</h1>
            <p className="text-neutral-600 font-light">
                Dashboard content goes here.
            </p>
        </div>

        {/* Auth Modal Placeholder */}
        <div id="auth-modal" className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 hidden">
            <div className="bg-white p-8 max-w-md w-full relative">
                <button className="absolute top-4 right-4 text-neutral-400 hover:text-black transition">
                    <i className="fas fa-times"></i>
                </button>
                <h2 className="text-2xl font-extrabold mb-6 tracking-tighter">Authentication</h2>
            </div>
        </div>
    </div>
  );
}
