// src/components/Navbar.tsx
import React, { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";

const NAV_ITEMS = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#team", label: "Team" },
  { href: "#news", label: "News" },
  { href: "#contacts", label: "Contacts" },
];

type SocialLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "#",
    label: "Facebook",
    icon: <FaFacebookF className="h-4 w-4" />,
  },
  {
    href: "https://x.com", // badilisha kwenye account yako halisi ya X kama ipo
    label: "X (Twitter)",
    icon: <FaXTwitter className="h-4 w-4" />,
  },
  {
    href: "https://www.instagram.com/vitohub/",
    label: "Instagram",
    icon: <FaInstagram className="h-4 w-4" />,
  },
];

const Navbar: React.FC = () => {
  const [active, setActive] = useState<string>("#home");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Zuia scroll nyuma ya drawer ukiwa mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = (
    e: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setActive(href);
    setIsOpen(false);

    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* DESKTOP / TOP BAR */}
      <header className="fixed inset-x-0 top-0 z-960 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          {/* Logo – mwanzo kabisa */}
          <div className="flex items-center">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="inline-flex items-center"
            >
              <img
                src="images/vt4-1.png"
                alt="VitoTech"
                className="h-8 w-auto"
              />
            </a>
          </div>

          {/* Nav links katikati */}
          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`border-b-2 pb-1 text-sm font-medium tracking-wide transition-colors md:text-base ${
                  active === item.href
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-slate-900 hover:border-indigo-400 hover:text-indigo-500"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Social icons – mwisho kulia (desktop) */}
          <div className="ml-4 hidden items-center gap-4 text-slate-600 lg:flex">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                className="rounded-full border border-transparent p-1.5 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noreferrer noopener"
                    : undefined
                }
              >
                {link.icon}
              </a>
            ))}
          </div>

          {/* Mobile hamburger – icon yenye mistari mitatu */}
          <button
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-800 transition hover:bg-slate-50 lg:hidden"
            aria-label="Open menu"
            onClick={() => setIsOpen(true)}
          >
            <RxHamburgerMenu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Backdrop (mobile) – juu ya content zote, chini kidogo ya drawer */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-960 bg-slate-900/40 transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* MOBILE DRAWER – juu ya kila kitu */}
      <aside
        className={`fixed inset-y-0 left-0 z-960 w-72 transform bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 pt-4 pb-3">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-800 hover:bg-slate-50"
          >
            <RxCross2 className="h-5 w-5" />
          </button>

          <div className="flex items-center">
            <img
              src="images/vt4-1.png"
              alt="VitoTech"
              className="h-8 w-auto"
            />
          </div>
        </div>

        {/* Social icons (mobile) */}
        <div className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 text-slate-600">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-label={link.label}
              className="rounded-full border border-transparent p-1.5 text-xl transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http")
                  ? "noreferrer noopener"
                  : undefined
              }
            >
              {link.icon}
            </a>
          ))}
        </div>

        {/* Mobile nav links */}
        <nav className="mt-2 flex flex-col">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`px-4 py-3 text-base font-medium tracking-wide ${
                active === item.href
                  ? "text-indigo-600 underline"
                  : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
