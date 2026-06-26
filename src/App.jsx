import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Philosophy from './components/Philosophy';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Story from './components/Story';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Legal from './components/Legal';
import Privacy from './components/Privacy';

// Landing Page combining all the main sections
const LandingPage = () => {
  return (
    <>
      <Hero />
      <Philosophy />
      <Services />
      <Pricing />
      <Story />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="antialiased text-[#0A0A0A] bg-[#FFFFFF] font-['Plus_Jakarta_Sans']">
        <Navigation />
        
        <main className="page-transition">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
