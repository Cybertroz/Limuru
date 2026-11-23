import React, { useEffect, useState } from 'react';
import { ChevronDown, ShoppingBag, User } from 'lucide-react';
import { ABOUT_NAV_ITEMS } from '../data/content';
import type { AuthUser, PageRoute } from '../types/dairy';
import { buildHashUrl } from '../utils/routing';
import { LimuruDairyLogo } from './BrandMark';

interface HeaderProps {
  activePage: PageRoute;
  cartCount: number;
  orderCount?: number;
  authUser?: AuthUser | null;
  cartBtnRef: React.RefObject<HTMLButtonElement | null>;
  onNavigate: (page: PageRoute, sectionId?: string) => void;
  onScrollToFooter: () => void;
  onOpenCart: () => void;
  onOpenProfile?: () => void;
}

export function Header({
  activePage,
  cartCount,
  orderCount = 0,
  authUser = null,
  cartBtnRef,
  onNavigate,
  onScrollToFooter,
  onOpenCart,
  onOpenProfile,
}: HeaderProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartPulseKey, setCartPulseKey] = useState(0);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const headerRef = React.useRef<HTMLElement | null>(null);
  const hoverOpenedAtRef = React.useRef<number>(0);
  const prevCartCountRef = React.useRef(cartCount);

  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setCartPulseKey((k) => k + 1);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    if (!aboutMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAboutMenuOpen(false);
    };
    const onClickOutside = (e: PointerEvent | MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setAboutMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onClickOutside);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onClickOutside);
    };
  }, [aboutMenuOpen]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 12);
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(Math.min(100, Math.round((scrollTop / docHeight) * 100)));
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, [activePage]);

  const handleNavClick = (page: PageRoute, sectionId?: string) => {
    setAboutMenuOpen(false);
    onNavigate(page, sectionId);
  };

  return (
    <header
      ref={headerRef}
      className={`safe-header sticky top-0 z-40 text-[#0d2433] border-b border-[#0a74b5]/18 transition-all duration-200 animate-header-in ${
        isScrolled
          ? 'bg-[#8fd5f7]/92 backdrop-blur-md shadow-[0_10px_30px_-14px_rgba(13,36,51,0.24)]'
          : 'bg-gradient-to-r from-[#8fd5f7] via-[#a3defa] to-[#8fd5f7] shadow-[0_8px_28px_-14px_rgba(13,36,51,0.16)]'
      }`}
    >
      {/* Ultra-thin blue scroll progress bar */}
      <div
        data-testid="scroll-progress-bar"
        className="h-[3px] bg-gradient-to-r from-[#27a8ec] via-[#0a74b5] to-[#0d2433] transition-[width] duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <div className="site-container">
        <div className="flex flex-wrap min-[861px]:flex-nowrap items-center justify-between gap-x-4 gap-y-1 py-2.5 min-[861px]:h-[80px] min-[861px]:py-0">
          {/* Left: Clean Cooperative Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="order-1 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a74b5] transition-transform duration-300 hover:scale-[1.03]"
            aria-label="Limuru Dairy Home"
          >
            <LimuruDairyLogo compact />
          </a>

          {/* Navigation Links (centered inline >860px; single horizontal scrolling row <=860px) */}
          <nav
            aria-label="Primary navigation"
            data-testid="primary-nav"
            className="nav-scroll-row order-3 min-[861px]:order-2 text-[12.5px] min-[1080px]:text-[13.5px] font-semibold tracking-[0.01em]"
          >
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
              style={{ animationDelay: '60ms' }}
              className={`animate-nav-item nav-link-animated whitespace-nowrap shrink-0 py-1.5 ${
                activePage === 'home'
                  ? 'is-active text-[#0a74b5]'
                  : 'text-[#0d2433]'
              }`}
            >
              Home
            </a>

            {/* About us trigger + section dropdown toggle */}
            <div
              className="relative inline-flex items-center shrink-0 animate-nav-item"
              style={{ animationDelay: '105ms' }}
              onMouseEnter={() => {
                if (typeof window !== 'undefined' && window.innerWidth > 860) {
                  if (!aboutMenuOpen) {
                    hoverOpenedAtRef.current = Date.now();
                  }
                  setAboutMenuOpen(true);
                }
              }}
              onMouseLeave={() => {
                if (typeof window !== 'undefined' && window.innerWidth > 860) {
                  setAboutMenuOpen(false);
                }
              }}
            >
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('about');
                }}
                className={`nav-link-animated whitespace-nowrap shrink-0 py-1.5 ${
                  activePage === 'about'
                    ? 'is-active text-[#0a74b5]'
                    : 'text-[#0d2433]'
                }`}
              >
                About us
              </a>
              <button
                type="button"
                aria-expanded={aboutMenuOpen}
                aria-haspopup="true"
                aria-label="Toggle About us sections"
                onClick={() => {
                  setAboutMenuOpen((prev) => {
                    if (prev && Date.now() - hoverOpenedAtRef.current < 450) {
                      return true;
                    }
                    return !prev;
                  });
                }}
                className="ml-0.5 p-1 text-[#0d2433] hover:text-[#0a74b5] cursor-pointer"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    aboutMenuOpen ? 'rotate-180 text-[#0a74b5]' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Desktop Dropdown (>860px) */}
              {aboutMenuOpen && (
                <div
                  className="hidden min-[861px]:block animate-dropdown-in absolute left-0 top-full pt-3 w-60 z-50"
                  role="menu"
                  aria-label="About us sections"
                >
                  <div className="bg-white/98 backdrop-blur-xl shadow-[0_22px_50px_-14px_rgba(13,36,51,0.22)] border border-[#c3e8fb] py-2">
                    {ABOUT_NAV_ITEMS.map((item) => (
                      <a
                        key={item.id}
                        href={buildHashUrl(item.route, item.sectionId)}
                        role="menuitem"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.route, item.sectionId);
                        }}
                        className="block px-5 py-2.5 text-[14px] font-medium text-[#0d2433] border-l-2 border-transparent hover:border-[#0a74b5] hover:bg-[#eef8fe] hover:text-[#0a74b5] transition-all"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href="#farmer-services"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('farmer-services');
              }}
              style={{ animationDelay: '135ms' }}
              className={`animate-nav-item nav-link-animated whitespace-nowrap shrink-0 py-1.5 ${
                activePage === 'farmer-services'
                  ? 'is-active text-[#0a74b5]'
                  : 'text-[#0d2433]'
              }`}
            >
              Farmer Services
            </a>

            <a
              href="#certifications"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('certifications');
              }}
              style={{ animationDelay: '165ms' }}
              className={`animate-nav-item nav-link-animated whitespace-nowrap shrink-0 py-1.5 ${
                activePage === 'certifications'
                  ? 'is-active text-[#0a74b5]'
                  : 'text-[#0d2433]'
              }`}
            >
              Certifications
            </a>

            <a
              href="#shop"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('shop');
              }}
              style={{ animationDelay: '195ms' }}
              className={`animate-nav-item nav-link-animated whitespace-nowrap shrink-0 py-1.5 ${
                activePage === 'shop'
                  ? 'is-active text-[#0a74b5]'
                  : 'text-[#0d2433]'
              }`}
            >
              Shop
            </a>

            <a
              href="#gallery"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('gallery');
              }}
              style={{ animationDelay: '225ms' }}
              className={`animate-nav-item nav-link-animated whitespace-nowrap shrink-0 py-1.5 ${
                activePage === 'gallery'
                  ? 'is-active text-[#0a74b5]'
                  : 'text-[#0d2433]'
              }`}
            >
              Gallery
            </a>

            <a
              href="#media"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('media');
              }}
              style={{ animationDelay: '255ms' }}
              className={`animate-nav-item nav-link-animated whitespace-nowrap shrink-0 py-1.5 ${
                activePage === 'media'
                  ? 'is-active text-[#0a74b5]'
                  : 'text-[#0d2433]'
              }`}
            >
              Media Centre
            </a>

            <a
              href="#footer-contact"
              onClick={(e) => {
                e.preventDefault();
                setAboutMenuOpen(false);
                onScrollToFooter();
              }}
              style={{ animationDelay: '285ms' }}
              className="animate-nav-item nav-link-animated whitespace-nowrap shrink-0 py-1.5 text-[#0d2433]"
            >
              Contact us
            </a>
          </nav>

          {/* Right: Profile & Cart Buttons */}
          <div className="order-2 min-[861px]:order-3 flex items-center gap-2 shrink-0">
            {onOpenProfile && (
              <button
                type="button"
                onClick={onOpenProfile}
                data-testid="header-profile-btn"
                aria-label={
                  authUser
                    ? `Signed in as ${authUser.email}. Open User Profile and My Orders`
                    : 'Sign in or view My Orders'
                }
                title={authUser ? `Signed in: ${authUser.email}` : 'Sign in via Email & My Orders'}
                className="inline-flex items-center gap-1.5 bg-white/85 hover:bg-white text-[#0d2433] px-3 sm:px-3.5 py-2 text-xs font-bold uppercase tracking-[0.08em] border border-[#0a74b5]/30 hover:border-[#0a74b5] transition-all cursor-pointer min-h-[40px]"
              >
                <span className="relative inline-flex items-center">
                  <User className="w-4 h-4 text-[#0a74b5]" aria-hidden="true" />
                  {authUser && (
                    <span
                      data-testid="header-auth-dot"
                      className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#16a34a] border border-white"
                      aria-hidden="true"
                    />
                  )}
                </span>
                <span className="hidden min-[480px]:inline max-w-[110px] truncate">
                  {authUser ? authUser.displayName.split(' ')[0] : 'My Orders'}
                </span>
                {orderCount > 0 && (
                  <span
                    data-testid="header-order-count"
                    className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1 bg-[#0d2433] text-white text-[10px] font-black tabular-nums"
                  >
                    {orderCount}
                  </span>
                )}
              </button>
            )}

            <button
              ref={cartBtnRef}
              type="button"
              onClick={onOpenCart}
              aria-label={`Open shopping cart with ${cartCount} items`}
              className="btn-shine inline-flex items-center gap-2 bg-[#0d2433] hover:bg-[#0a74b5] text-white px-3.5 sm:px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] shadow-[0_8px_20px_-8px_rgba(13,36,51,0.4)] hover:-translate-y-0.5 transition-all cursor-pointer min-h-[40px]"
            >
              <ShoppingBag className="w-4 h-4 text-[#8fd5f7]" aria-hidden="true" />
              <span className="hidden sm:inline">Cart</span>
              <span
                key={cartPulseKey}
                data-testid="cart-count"
                className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 bg-[#27a8ec] text-[#0d2433] text-[11px] font-extrabold tabular-nums ${
                  cartPulseKey > 0 ? 'animate-cart-pop' : ''
                }`}
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Phone About Us Section Sub-Row (<=860px, rendered outside scrolling nav so never clipped) */}
      {aboutMenuOpen && (
        <div
          className="min-[861px]:hidden bg-white border-t border-[#c3e8fb] shadow-lg"
          role="menu"
          aria-label="About us sections"
        >
          <div className="site-container py-2.5 flex items-center gap-2 overflow-x-auto">
            {ABOUT_NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={buildHashUrl(item.route, item.sectionId)}
                role="menuitem"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.route, item.sectionId);
                }}
                className="shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-semibold bg-[#eef8fe] text-[#0d2433] hover:text-[#0a74b5] border border-[#c3e8fb]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
