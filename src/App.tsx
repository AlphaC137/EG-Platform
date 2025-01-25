import React, { useState, useEffect } from 'react';
import { Sprout, ShoppingCart } from 'lucide-react';
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Marketplace } from './components/Marketplace';
import { KnowledgeHub } from './components/KnowledgeHub';
import { VendorRegistration } from './components/VendorRegistration';
import { VendorProfile } from './components/VendorProfile';
import { AuthModal } from './components/auth/AuthModal';
import { UserMenu } from './components/auth/UserMenu';
import { CartDrawer } from './components/cart/CartDrawer';
import { supabase } from './lib/supabase';
import { useAuthStore, useCartStore } from './lib/store';

function App() {
  const [currentPage, setCurrentPage] = useState<
    | 'home'
    | 'marketplace'
    | 'knowledge-hub'
    | 'vendor-registration'
    | 'vendor-profile'
  >('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  const handleSignIn = () => {
    setAuthView('signin');
    setShowAuthModal(true);
  };

  const handleNavigation = (path: string) => {
    if (path === '/marketplace') {
      setCurrentPage('marketplace');
    } else if (path === '/knowledge-hub') {
      setCurrentPage('knowledge-hub');
    } else if (path === '/vendor-registration') {
      if (!user) {
        setAuthView('signup');
        setShowAuthModal(true);
        return;
      }
      setCurrentPage('vendor-registration');
    } else if (path === '/vendor/profile') {
      if (!user) {
        setAuthView('signin');
        setShowAuthModal(true);
        return;
      }
      setCurrentPage('vendor-profile');
    } else if (path === '/') {
      setCurrentPage('home');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <Sprout className="w-8 h-8 text-primary" />
            <span className="ml-2 font-heading font-bold text-xl text-primary">
              EG Business
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation('/marketplace')}
              className={`text-gray-600 hover:text-primary ${
                currentPage === 'marketplace'
                  ? 'text-primary font-semibold'
                  : ''
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => handleNavigation('/farmers')}
              className="text-gray-600 hover:text-primary"
            >
              Farmers
            </button>
            <button
              onClick={() => handleNavigation('/knowledge-hub')}
              className={`text-gray-600 hover:text-primary ${
                currentPage === 'knowledge-hub'
                  ? 'text-primary font-semibold'
                  : ''
              }`}
            >
              Knowledge Hub
            </button>
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            {user ? (
              <UserMenu />
            ) : (
              <button onClick={handleSignIn} className="btn-primary">
                Sign In
              </button>
            )}
          </div>
        </nav>
      </header>

      <main>
        {currentPage === 'home' && (
          <>
            <Hero handleNavigation={handleNavigation} />
            <FeaturedProducts />
          </>
        )}
        {currentPage === 'marketplace' && <Marketplace />}
        {currentPage === 'knowledge-hub' && <KnowledgeHub />}
        {currentPage === 'vendor-registration' && <VendorRegistration />}
        {currentPage === 'vendor-profile' && <VendorProfile />}
      </main>

      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-heading font-bold text-xl mb-4">
                EG Business
              </h3>
              <p className="text-gray-200">
                Connecting farmers and consumers for a sustainable future.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleNavigation('/about')}
                    className="text-gray-200 hover:text-white"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/how-it-works')}
                    className="text-gray-200 hover:text-white"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/sustainability')}
                    className="text-gray-200 hover:text-white"
                  >
                    Sustainability
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleNavigation('/faq')}
                    className="text-gray-200 hover:text-white"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/contact')}
                    className="text-gray-200 hover:text-white"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/shipping')}
                    className="text-gray-200 hover:text-white"
                  >
                    Shipping Info
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-200 mb-4">
                Stay updated with our latest offers and farming tips.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: Implement newsletter subscription
                  alert('Newsletter subscription coming soon!');
                }}
              >
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none text-gray-900"
                  />
                  <button
                    type="submit"
                    className="bg-accent px-4 py-2 rounded-r-lg hover:bg-accent/90 transition-colors"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-green-700 text-center text-gray-200">
            <p>
              &copy; {new Date().getFullYear()} EG Business. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView={authView}
      />

      <CartDrawer isOpen={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
}

export default App;