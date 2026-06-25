import { useEffect, useState } from 'react';
import './Navbar.css';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Events', href: '#events' },
  { label: 'Impact', href: '#benefits' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#footer' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [revealToggle, setRevealToggle] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleItemClick = () => {
    setOpen(false);
  };

  const handleEventsClick = (e) => {
    e.preventDefault();
    setOpen(false);
    const st = window.__eventsST;
    if (st && window.__lenis) {
      window.__lenis.scrollTo(Math.max(0, st.start - 0));
    } else if (st) {
      window.scrollTo({ top: Math.max(0, st.start - 0), behavior: 'smooth' });
    } else {
      const el = document.getElementById('events');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleImpactClick = (e) => {
    e.preventDefault();
    setOpen(false);
    const el = document.getElementById('benefits');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (window.__lenis) {
        window.__lenis.scrollTo(Math.max(0, top));
      } else {
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      }
    }
  };

  const handleFooterClick = (event) => {
    event.preventDefault();
    setOpen(false);

    const targetScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: Math.max(targetScrollTop, 0), behavior: 'smooth' });
  };

  return (
    <nav
      className={`site-nav ${open ? 'is-open' : ''} ${isScrolled ? 'is-scrolled' : ''} ${revealToggle ? 'show-toggle' : ''}`}
      aria-label="Main navigation"
    >
      <div
        className="site-nav__reveal-zone"
        onMouseEnter={() => setRevealToggle(true)}
        onMouseLeave={() => setRevealToggle(false)}
        aria-hidden="true"
      />
      <ul className="site-nav__list" id="site-nav-list">
        {NAV_ITEMS.map((item) => (
          <li key={item.href} className="site-nav__item">
            <a
              href={item.href}
              onClick={
                item.href === '#footer' ? handleFooterClick
                  : item.href === '#events' ? handleEventsClick
                    : item.href === '#benefits' ? handleImpactClick
                      : handleItemClick
              }
              className="site-nav__link"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="site-nav__toggle"
        onClick={() => setOpen((value) => !value)}
        onMouseEnter={() => setRevealToggle(true)}
        onMouseLeave={() => setRevealToggle(false)}
        aria-expanded={open}
        aria-controls="site-nav-list"
      >
        {open ? 'Close' : 'Menu'}
      </button>
    </nav>
  );
};

export default Navbar;
