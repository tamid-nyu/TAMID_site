import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header, ScrollToTop, Seo } from '@components';
import {
  Home,
  OurMission,
  OurBoard,
  OurMembers,
  Mentorship,
  Events,
  Contact,
  NotFound,
} from './pages';
import './App.css';

const ClientToaster = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          fontWeight: 500,
        },
        success: {
          style: {
            background: '#10b981',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        },
        error: {
          style: {
            background: '#dc2626',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#dc2626',
          },
        },
      }}
    />
  );
};

export const AppContent = () => (
  <>
    <ScrollToTop />
    <Seo />
    <ClientToaster />
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/our-mission" element={<OurMission />} />
          <Route path="/our-board" element={<OurBoard />} />
          <Route path="/our-members" element={<OurMembers />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  </>
);

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
