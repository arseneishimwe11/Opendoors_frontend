import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Briefcase, Home, Building, GraduationCap, Menu, X, Heart, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '../contexts/ThemeContext';
import logoLight from '../assets/logo.png';
import logoDark from '../assets/logo_white.png';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home, badge: undefined, highlight: false },
    { name: 'Jobs', href: '/jobs', icon: Briefcase, badge: undefined, highlight: false },
    { name: 'Internships', href: '/internships', icon: GraduationCap, badge: undefined, highlight: false },
    { name: 'Scholarships', href: '/scholarships', icon: BookOpen, badge: undefined, highlight: false },
    { name: 'Events', href: '/events', icon: Calendar, badge: undefined, highlight: false },
    // { name: 'Companies', href: '/companies', icon: Building, badge: undefined, highlight: false },
    { name: 'Saved', href: '/saved', icon: Heart, badge: undefined, highlight: false },
  ];

  return (
    <>
      {/* Premium Glassmorphism Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gray-900/20 backdrop-blur-3xl border-b border-white/5' 
          : 'bg-white/60 backdrop-blur-3xl border-b border-gray-200/30 shadow-sm'
      }`}>
        {/* Glassmorphism overlay */}
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-gray-900/40 via-slate-900/30 to-gray-900/40' 
            : 'bg-gradient-to-r from-white/60 via-gray-50/40 to-white/60'
        }`} />
        
        {/* Main Header Content */}
        <div className="relative container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section - Premium & Compact */}
            <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
              <div className="relative transition-all duration-300 group-hover:scale-110">
                <img 
                  src={theme === 'dark' ? logoDark : logoLight} 
                  alt="OpenDoors Logo" 
                  className="w-10 h-10 object-contain"
                />
                <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-lg font-bold transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  OpenDoors
                </h1>
                <p className={`text-xs font-medium leading-none ${
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-600'
                }`}>
                  Rwanda's Opportunity Platform
                </p>
              </div>
            </Link>

            {/* Enhanced Navigation - Centered */}
            <nav className="hidden lg:flex items-center">
              <div className={`flex items-center p-1 rounded-xl transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-white/5 backdrop-blur-sm border border-white/10' 
                  : 'bg-white/70 backdrop-blur-sm border border-gray-200/40 shadow-sm'
              }`}>
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`relative flex items-center space-x-2 px-3 py-2 mx-[2px] rounded-lg transition-all duration-300 group ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                            : 'text-gray-800 hover:bg-white/80 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 transition-all duration-300 ${
                        isActive ? 'text-white' : ''
                      } ${item.highlight && !isActive ? 'text-blue-500' : ''}`} />
                      <span className="font-medium text-sm">{item.name}</span>
                      {item.badge && (
                        <Badge variant={isActive ? "secondary" : "outline"} className={`text-xs h-5 ${
                          isActive 
                            ? 'bg-white/20 text-white border-white/30' 
                            : theme === 'dark'
                              ? 'border-blue-500 text-blue-300 bg-blue-900/20'
                              : 'border-blue-400 text-blue-600 bg-blue-100/60'
                        } ${item.highlight ? 'animate-pulse' : ''}`}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-lg transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-300 hover:text-white' 
                    : 'hover:bg-white/70 text-gray-800 hover:text-gray-900 shadow-sm'
                }`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 transition-transform duration-500" />
                ) : (
                  <Moon className="w-4 h-4 transition-transform duration-500" />
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden w-9 h-9 rounded-lg transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'hover:bg-white/10 text-gray-300' 
                    : 'hover:bg-white/50 text-gray-700'
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Premium Mobile Navigation */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-40 lg:hidden`}>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div className={`absolute top-16 left-4 right-4 rounded-2xl overflow-hidden transition-all duration-300 ${
            theme === 'dark' 
              ? 'bg-gray-900/95 border border-gray-700/50' 
              : 'bg-white/95 border border-gray-200/20'
          } backdrop-blur-xl shadow-2xl`}>
            <div className="p-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-1 mb-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? theme === 'dark'
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                          : theme === 'dark'
                            ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                            : 'text-gray-700 hover:bg-gray-100/60 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className={`w-5 h-5 ${
                          isActive ? 'text-white' : ''
                        }`} />
                        <span className="font-medium text-base">{item.name}</span>
                      </div>
                      {item.badge && (
                        <Badge variant={isActive ? "secondary" : "outline"} className={`text-xs h-5 ${
                          isActive 
                            ? 'bg-white/20 text-white border-white/30' 
                            : theme === 'dark'
                              ? 'border-blue-600 text-blue-300 bg-blue-900/20'
                              : 'border-blue-400 text-blue-600 bg-blue-100/60'
                        }`}>
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16" />

    </>
  );
}
