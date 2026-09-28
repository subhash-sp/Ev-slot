import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AppDataProvider } from './contexts/AppDataContext';
import { ToastProvider } from './contexts/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Stations } from './pages/Stations';
import { StationDetails } from './pages/StationDetails';
import { BookSlot } from './pages/BookSlot';
import { BookingSuccess } from './pages/BookingSuccess';
import { MyBookings } from './pages/MyBookings';
import { HowItWorks } from './pages/HowItWorks';
import { Support } from './pages/Support';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <AppDataProvider>
        <ToastProvider>
          <ScrollToTop />
          <div className="flex min-h-screen w-full flex-col bg-slate-50 font-sans text-slate-900 antialiased">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stations" element={<Stations />} />
                <Route path="/stations/:id" element={<StationDetails />} />
                <Route path="/book/:id" element={<BookSlot />} />
                <Route path="/booking/success/:bookingId" element={<BookingSuccess />} />
                <Route path="/bookings" element={<MyBookings />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/support" element={<Support />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ToastProvider>
      </AppDataProvider>
    </BrowserRouter>);

}