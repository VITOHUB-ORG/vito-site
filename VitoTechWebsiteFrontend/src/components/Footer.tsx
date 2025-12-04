// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-[#0b0c1b] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        {/* Top links (AI Automation | Windows/Mac... | ...) */}
        <div className="border-b border-white/10 pb-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.22em]">
            <li>
              <a href="#" className="hover:text-indigo-400">
                AI Automation
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-400">
                Windows/Mac OS Software
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-400">
                Android/iOS Apps
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-400">
                Graphics Design
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-400">
                Cloud Solutions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-indigo-400">
                Customer Support
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom bar: ©, social icons, rights */}
        <div className="mt-6 flex flex-col items-center gap-4 text-xs text-gray-400 md:flex-row md:justify-between">
          {/* Left: © year + VitoTech */}
          <p>
            <span>&copy; </span>
            <span className="copyright-year">2025</span>{" "}
            <span className="font-semibold text-white">VitoTech</span>
          </p>

          {/* Center: social icons (tunatumia FontAwesome uliyonayo tayari) */}
          <ul className="flex items-center gap-4 text-lg">
            <li>
              <a
                href="#"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:border-indigo-400 hover:text-indigo-400"
              >
                <span className="fa fa-facebook" />
              </a>
            </li>
            <li>
              <a
                href="https://www.vitohub.org/"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:border-indigo-400 hover:text-indigo-400"
              >
                <span className="fa fa-google" />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/vitohub/"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:border-indigo-400 hover:text-indigo-400"
              >
                <span className="fa fa-instagram" />
              </a>
            </li>
          </ul>

          {/* Right: rights text */}
          <p className="text-center md:text-right">
            <span>All rights reserved. </span>
            <span>Design&nbsp;by&nbsp;VitoTech Co.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
