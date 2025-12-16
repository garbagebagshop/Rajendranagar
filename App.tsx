
import React, { useEffect, useState, Suspense } from 'react';
import { IconWhatsApp, IconPhone, IconHome, IconSearch, IconHeart, IconUser, IconMenu, IconX } from './components/Icons';
import { Link, navigate } from './components/Link';
import { Area } from './types';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Admin = React.lazy(() => import('./pages/Admin'));
const AreaPage = React.lazy(() => import('./pages/AreaPage'));
const PropertyDetail = React.lazy(() => import('./pages/PropertyDetail'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Sitemap = React.lazy(() => import('./pages/Sitemap'));
const RajendraNagarInfo = React.lazy(() => import('./pages/RajendraNagarInfo'));
const PostProperty = React.lazy(() => import('./pages/PostProperty'));
const ManageAds = React.lazy(() => import('./pages/ManageAds'));

const App: React.FC = () => {
  // Helper to extract clean path from hash
  const getPath = () => window.location.hash.slice(1) || '/';

  const [path, setPath] = useState(getPath());
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleNavigation = () => {
      setPath(getPath());
      setIsMenuOpen(false); // Close menu on navigation
    };

    // Ensure we have a hash on load
    if (!window.location.hash) {
      window.location.hash = '/';
    }

    window.addEventListener('hashchange', handleNavigation);
    return () => window.removeEventListener('hashchange', handleNavigation);
  }, []);

  useEffect(() => {
    if (path === '/' || path.startsWith('/area')) setActiveTab('home');
    else if (path === '/contact') setActiveTab('menu');
    else if (path === '/manage-ads') setActiveTab('user');
    else setActiveTab('');
    
    // Scroll to top on path change
    window.scrollTo(0, 0);
  }, [path]);

  // Disable scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const handleNavigate = (href: string) => {
    setIsMenuOpen(false);
    navigate(href);
  };

  // Routing Logic
  let Component = <Home />;
  if (path === '/admin') Component = <Admin />;
  else if (path === '/post-property') Component = <PostProperty />;
  else if (path === '/manage-ads') Component = <ManageAds />;
  else if (path.startsWith('/area/')) Component = <AreaPage areaName={decodeURIComponent(path.replace('/area/', ''))} />;
  else if (path.startsWith('/p/')) {
    const id = path.replace('/p/', '').replace(/\/$/, ''); // Remove trailing slash
    Component = <PropertyDetail propertyId={id} />;
  }
  else if (path === '/privacy') Component = <PrivacyPolicy />;
  else if (path === '/terms') Component = <Terms />;
  else if (path === '/contact') Component = <Contact />;
  else if (path === '/sitemap') Component = <Sitemap />;
  else if (path === '/rajendra-nagar-info') Component = <RajendraNagarInfo />;

  // Admin Layout (Simple)
  if (path === '/admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
        <Suspense fallback={<div className="p-10 text-center text-gold">Loading...</div>}>
          {Component}
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-body flex flex-col pb-20 md:pb-0">
      
      {/* Desktop Navbar - Dark Luxury with Gradient Border */}
      <nav className="hidden md:block bg-slate-900/90 backdrop-blur-md border-gold-gradient-bottom px-6 py-4 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2 group">
            <span className="text-gold-gradient text-3xl group-hover:scale-110 transition-transform duration-300">✦</span> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 group-hover:text-white transition-colors">Rajendranagar</span>
            <span className="text-gold">.online</span>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-slate-300 hover:text-gold transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/post-property" className="text-sm font-bold text-gold hover:text-white transition-colors relative group border border-gold/30 px-4 py-1.5 rounded-full hover:bg-gold/10">
              Post for Free
            </Link>
            <Link href="/manage-ads" className="text-sm font-semibold text-slate-300 hover:text-gold transition-colors relative group">
              My Ads
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-slate-300 hover:text-gold transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all group-hover:w-full"></span>
            </Link>
            
            <a href="https://wa.me/916281256601" target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 px-6 py-2.5 rounded-full text-sm shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <IconWhatsApp className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile Header - App Style Dark */}
      <header className="md:hidden bg-slate-900/95 backdrop-blur-md px-4 py-3 sticky top-0 z-50 flex justify-between items-center border-gold-gradient-bottom shadow-md">
        <Link href="/" className="flex flex-col items-start" onClick={() => setIsMenuOpen(false)}>
          <span className="font-display font-bold text-lg text-white leading-tight">
            Rajendra Nagar
          </span>
          <span className="text-[10px] text-gold font-medium tracking-wider uppercase">
            Property listing
          </span>
        </Link>
        <div className="flex items-center gap-3">
           <Link href="/post-property" className="bg-gold text-slate-900 font-bold text-xs px-3 py-2 rounded-lg shadow-md active:scale-95 transition-transform" onClick={() => setIsMenuOpen(false)}>
             + Post
           </Link>
           <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="text-white p-1 focus:outline-none active:scale-90 transition-transform"
             aria-label="Toggle Menu"
           >
             {isMenuOpen ? <IconX className="w-7 h-7" /> : <IconMenu className="w-7 h-7" />}
           </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] z-40 bg-slate-950/95 backdrop-blur-xl transition-all duration-300 animate-fade-in overflow-y-auto pb-20">
          <div className="p-6 flex flex-col gap-8">
            <div className="space-y-4">
              <h3 className="text-gold text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-2">Main Menu</h3>
              <nav className="flex flex-col gap-5 text-lg font-medium text-white">
                <button onClick={() => handleNavigate('/')} className="text-left hover:text-gold flex items-center gap-3">
                  <IconHome className="w-5 h-5 text-slate-400" /> Home
                </button>
                <button onClick={() => handleNavigate('/post-property')} className="text-left hover:text-gold flex items-center gap-3">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gold text-slate-900 text-xs font-bold">+</span>
                  <span>Post Free Ad</span> 
                  <span className="text-[10px] bg-gold text-slate-900 px-1.5 py-0.5 rounded font-bold ml-auto">FREE</span>
                </button>
                <button onClick={() => handleNavigate('/manage-ads')} className="text-left hover:text-gold flex items-center gap-3">
                  <IconUser className="w-5 h-5 text-slate-400" /> My Ads
                </button>
                <button onClick={() => handleNavigate('/rajendra-nagar-info')} className="text-left hover:text-gold flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center text-slate-400">ℹ</span> Local Guide
                </button>
              </nav>
            </div>

            <div className="space-y-4">
               <h3 className="text-gold text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-2">Support</h3>
               <div className="grid grid-cols-2 gap-3">
                  <a href="https://wa.me/916281256601" target="_blank" rel="noopener noreferrer" className="bg-slate-800 p-4 rounded-xl flex flex-col items-center gap-2 text-sm text-white hover:bg-slate-700 border border-slate-700">
                    <IconWhatsApp className="w-6 h-6 text-green-500" /> WhatsApp
                  </a>
                  <a href="tel:+916281256601" className="bg-slate-800 p-4 rounded-xl flex flex-col items-center gap-2 text-sm text-white hover:bg-slate-700 border border-slate-700">
                    <IconPhone className="w-6 h-6 text-blue-500" /> Call Support
                  </a>
               </div>
               <button onClick={() => handleNavigate('/contact')} className="w-full text-left py-2 text-sm text-slate-300 hover:text-white">
                 Contact Page &rarr;
               </button>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
               <button onClick={() => handleNavigate('/privacy')} className="block text-sm text-slate-500 hover:text-white">Privacy Policy</button>
               <button onClick={() => handleNavigate('/terms')} className="block text-sm text-slate-500 hover:text-white">Terms of Service</button>
               <button onClick={() => handleNavigate('/sitemap')} className="block text-sm text-slate-500 hover:text-white">Sitemap</button>
            </div>
            
            <div className="pt-4 text-center">
               <button onClick={() => handleNavigate('/admin')} className="text-xs text-slate-600 hover:text-slate-400">Admin Access</button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow">
        <Suspense fallback={<div className="h-screen flex items-center justify-center text-gold font-bold animate-pulse">Loading...</div>}>
          {Component}
        </Suspense>
      </main>
      
      {/* Footer - Deep Dark */}
      <footer className="hidden md:block bg-slate-900 text-slate-400 py-16 text-sm border-t border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-white font-display font-bold text-xl mb-6">Rajendranagar<span className="text-gold">.online</span></h3>
            <p className="opacity-70 leading-relaxed mb-6">
              The premier real estate platform for South Hyderabad. We are committed to transparency, zero brokerage, and verified listings.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Service Areas</h4>
            <ul className="space-y-2 opacity-80">
              {Object.values(Area).slice(0, 6).map((area) => (
                <li key={area}><Link href={`/area/${encodeURIComponent(area)}`} className="hover:text-gold transition-colors">{area}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Company</h4>
            <ul className="space-y-2 opacity-80">
              <li><Link href="/post-property" className="hover:text-gold text-white font-bold">Post Free Ad</Link></li>
              <li><Link href="/manage-ads" className="hover:text-gold">Manage My Ads</Link></li>
              <li><Link href="/contact" className="hover:text-gold">Contact Us</Link></li>
              <li><Link href="/rajendra-nagar-info" className="hover:text-gold">Local Guide</Link></li>
              <li><Link href="/privacy" className="hover:text-gold">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gold">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
             <h4 className="text-white font-bold mb-6 border-b border-gray-700 pb-2 inline-block">Contact</h4>
             <div className="space-y-4">
               <a href="tel:+916281256601" className="flex items-center gap-3 hover:text-white group">
                 <div className="bg-white/5 p-2 rounded-full group-hover:bg-gold group-hover:text-slate-900 transition-colors"><IconPhone className="w-4 h-4" /></div>
                 <span className="font-bold">+91 62812 56601</span>
               </a>
               <a href="https://wa.me/916281256601" className="flex items-center gap-3 hover:text-white group">
                 <div className="bg-white/5 p-2 rounded-full group-hover:bg-green-500 transition-colors"><IconWhatsApp className="w-4 h-4" /></div>
                 <span className="font-bold">Chat on WhatsApp</span>
               </a>
             </div>
             <div className="mt-8 pt-4 border-t border-gray-800 text-xs opacity-50">
               <Link href="/admin">Admin Login</Link>
             </div>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-gray-800 opacity-50 text-xs">
          &copy; {new Date().getFullYear()} Rajendranagar Online. All Rights Reserved.
        </div>
      </footer>

      {/* Mobile Bottom Nav - Dark Theme */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-6 py-3 pb-safe z-50 flex justify-between items-center shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
        <Link href="/" className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' ? 'text-gold' : 'text-slate-500'}`} onClick={() => setActiveTab('home')}>
          <IconHome className={`w-6 h-6 ${activeTab === 'home' ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('search')?.scrollIntoView({behavior:'smooth'}), 100); }} className="flex flex-col items-center gap-1 text-slate-500 hover:text-gold group">
          <div className="bg-slate-800 p-2 rounded-full -mt-6 border border-slate-700 shadow-lg group-active:scale-95 transition-transform border-gold/20">
             <IconSearch className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-bold">Search</span>
        </button>
        <Link href="/manage-ads" className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'user' ? 'text-gold' : 'text-slate-500'}`} onClick={() => setActiveTab('user')}>
          <IconUser className="w-6 h-6" />
          <span className="text-[10px] font-bold">My Ads</span>
        </Link>
      </nav>
    </div>
  );
};

export default App;
