import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import Home from './pages/Home';
import Architecture from './pages/Architecture';
import Installation from './pages/Installation';
import Invest from './pages/Invest';
import './index.css';

// Scroll to anchor on route change
const ScrollToAnchor = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);
  return null;
};

const App = () => {
  return (
    <Router>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <ParticleBackground />
        <div style={{
          position: 'fixed',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(214,160,75,0.06) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />
        <Nav />
        <ScrollToAnchor />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/architecture" element={<Architecture />} />
            <Route path="/installation" element={<Installation />} />
            <Route path="/invest" element={<Invest />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  );
};

export default App;
