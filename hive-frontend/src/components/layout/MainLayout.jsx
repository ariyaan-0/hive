import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Compass, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { logout } = useAuth();

  const handleSignout = () => {
    logout();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-(--color-surface) border-b border-(--color-divider) shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <h1 className="font-heading italic font-bold text-(--text-2xl) text-(--color-primary-500) tracking-tight">
                Hive
              </h1>
            </Link>
            
            <nav className="hidden md:flex items-center gap-2">
              
              <NavLink 
                to="/chat" 
                className={({ isActive }) =>
                  `px-4 py-2 text-(--text-lg) transition-all duration-200 font-heading font-bold italic ${
                    isActive 
                      ? 'bg-(--color-primary-500) text-white rounded-full shadow-[var(--shadow-tab-active)]' 
                      : 'text-(--color-text-muted) hover:text-(--color-primary-500)'
                  }`
                }
              >
                Chats
              </NavLink>

              <NavLink 
                to="/explore" 
                className={({ isActive }) =>
                  `px-4 py-2 text-(--text-lg) transition-all duration-200 font-heading font-bold italic ${
                    isActive 
                      ? 'bg-(--color-primary-500) text-white rounded-full shadow-[var(--shadow-tab-active)]' 
                      : 'text-(--color-text-muted) hover:text-(--color-primary-500)'
                  }`
                }
              >
                Explore
              </NavLink>

              <NavLink 
                to="/profile" 
                className={({ isActive }) =>
                  `px-4 py-2 text-(--text-lg) transition-all duration-200 font-heading font-bold italic ${
                    isActive 
                      ? 'bg-(--color-primary-500) text-white rounded-full shadow-[var(--shadow-tab-active)]' 
                      : 'text-(--color-text-muted) hover:text-(--color-primary-500)'
                  }`
                }
              >
                Profile
              </NavLink>
            </nav>
          </div>

          <button 
            onClick={handleSignout}
            className="px-4 py-2 text-(--text-lg) font-heading font-bold italic text-(--color-text-muted) hover:text-(--color-primary-500) transition-colors"
          >
            Signout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-(--color-surface) border-t border-(--color-divider) flex justify-around items-center h-16 z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] px-2">
        <Link to="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === '/' ? 'text-(--color-primary-500)' : 'text-(--color-text-muted)'}`}>
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/chat" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === '/chat' ? 'text-(--color-primary-500)' : 'text-(--color-text-muted)'}`}>
          <MessageCircle className="w-6 h-6" />
          <span className="text-[10px] font-medium">Chats</span>
        </Link>
        <Link to="/explore" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === '/explore' ? 'text-(--color-primary-500)' : 'text-(--color-text-muted)'}`}>
          <Compass className="w-6 h-6" />
          <span className="text-[10px] font-medium">Explore</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname.startsWith('/profile') ? 'text-(--color-primary-500)' : 'text-(--color-text-muted)'}`}>
          <User className="w-6 h-6" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default MainLayout;
