'use client';

import { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { User } from '@/types/auth';
import AuthModal from '@/components/auth/AuthModal';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header = memo(function Header({ user, onLogout }: HeaderProps) {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  return (
    <header className="main-header">
      <Link href="/">
        <h1 className="cursor-pointer hover:text-teal-600 transition-colors">Fedezd fel a gyerekbarát helyeket</h1>
      </Link>
      <div className="header-right">
        {!user ? (
          <div className="header-right-buttons">
            <Link
              href="/"
              className="my-lists-button"
            >
              <span>🔍</span>
              <span>Felfedezés</span>
            </Link>
            <div className="user-profile" id="loginTrigger">
              <div className="profile-info">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="profile-name cursor-pointer"
                >
                  Bejelentkezés
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="header-right-buttons">
            <Link
              href="/"
              className="my-lists-button"
            >
              <span>🔍</span>
              <span>Felfedezés</span>
            </Link>
            <Link
              href="/mylist"
              className="my-lists-button"
            >
              <span>📋</span>
              <span>Listám</span>
            </Link>
            <div className="user-profile hamburger-menu">
              <button
                className={`hamburger-button ${hamburgerOpen ? 'active' : ''}`}
                onClick={() => setHamburgerOpen(!hamburgerOpen)}
                aria-label="Menü"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
              <div
                className={`hamburger-overlay ${hamburgerOpen ? 'active' : ''}`}
                onClick={() => setHamburgerOpen(false)}
                aria-hidden
              />
              <div className={`hamburger-menu-dropdown ${hamburgerOpen ? 'active' : ''}`}>
                <button
                  className="hamburger-close"
                  aria-label="Menü bezárása"
                  onClick={() => setHamburgerOpen(false)}
                >
                  ×
                </button>
                <nav className="hamburger-nav">
                  <a href="#" className="hamburger-menu-item">
                    <Image
                      src="/assets/account.png"
                      alt="Fiókom"
                      className="menu-icon"
                      width={24}
                      height={24}
                    />
                    <span>Fiókom</span>
                  </a>
                  <Link
                    href="/recommendation"
                    className="hamburger-menu-item"
                    onClick={() => setHamburgerOpen(false)}
                  >
                    <Image
                      src="/assets/recommend.png"
                      alt="Ajánlás beküldése"
                      className="menu-icon"
                      width={24}
                      height={24}
                    />
                    <span>Ajánlás beküldése</span>
                  </Link>
                  <a
                    href="#"
                    className="hamburger-menu-item hamburger-menu-item-logout"
                    onClick={(e) => {
                      e.preventDefault();
                      onLogout();
                      setHamburgerOpen(false);
                    }}
                  >
                    <Image
                      src="/assets/logout.png"
                      alt="Kijelentkezés"
                      className="menu-icon"
                      width={24}
                      height={24}
                    />
                    <span>Kijelentkezés</span>
                  </a>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </header>
  );
});

export default Header;
