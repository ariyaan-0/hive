import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';

const MainLayout = () => {
  const navigate = useNavigate();

  const handleSignout = () => {
    // In actual implementation, clear auth tokens here.
    navigate('/auth');
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
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
