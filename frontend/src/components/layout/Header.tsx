'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { User } from '@/types/auth';
import AuthModal from '@/components/auth/AuthModal';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  return (
    <header className="main-header">
      <h1>Fedezd fel a gyerekbarát helyeket</h1>
      <div className="header-right">
        {!user ? (
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
        ) : (
          <div className="header-right-buttons">
            <button className="my-lists-button">
              <span>📋</span>
              <span>Listám</span>
            </button>
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
              {hamburgerOpen && (
                <div className="hamburger-menu-dropdown active">
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
                    <a href="#" className="hamburger-menu-item">
                      <Image
                        src="/assets/recommend.png"
                        alt="Ajánlás beküldése"
                        className="menu-icon"
                        width={24}
                        height={24}
                      />
                      <span>Ajánlás beküldése</span>
                    </a>
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
              )}
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
}
