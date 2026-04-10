import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { firebaseUser, profile, signOut } = useAuth();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Study at UCT', href: '/study' },
    { label: 'Campus Life', href: '/campus-life' },
    { label: 'Research', href: '/research' },
    { label: 'News', href: '/news' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setLocation('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-12 h-12 bg-gradient-to-br from-[#003366] to-[#1a4d7a] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">UCT</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-[#003366] leading-tight">UNIVERSITY OF</h1>
              <h1 className="text-sm font-bold text-[#003366] leading-tight">CAPE TOWN</h1>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}
                className="text-gray-700 hover:text-[#003366] font-medium transition-colors duration-200 text-sm">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {firebaseUser ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-[#003366] hover:bg-gray-100 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-[#003366] flex items-center justify-center">
                      {profile?.photoURL
                        ? <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                        : <User className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-sm">{profile?.preferredName || profile?.firstName || 'Dashboard'}</span>
                  </Button>
                </Link>
                <Button onClick={handleSignOut} variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2">
                  <LogOut className="w-4 h-4" />Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-[#003366] hover:bg-gray-100">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-[#003366] hover:bg-[#1a4d7a] text-white">Register</Button>
                </Link>
              </>
            )}
          </div>

          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4 border-t border-gray-200">
            <div className="flex flex-col gap-2 pt-4">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4 px-4 border-t border-gray-200">
                {firebaseUser ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full text-[#003366] border-[#003366]">My Dashboard</Button>
                    </Link>
                    <Button onClick={handleSignOut} variant="outline" className="w-full text-red-600 border-red-200">
                      <LogOut className="w-4 h-4 mr-2" />Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="outline" className="w-full text-[#003366] border-[#003366]">Sign In</Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full bg-[#003366] hover:bg-[#1a4d7a] text-white">Register</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
