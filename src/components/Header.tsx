import React from 'react';
import { Lock } from 'lucide-react';

interface HeaderProps {
  storeName: string;
  isAdminAuthenticated: boolean;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  storeName,
  isAdminAuthenticated,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line brand mark */}
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-md"
        >
          <svg
            viewBox="0 0 40 40"
            fill="none"
            className="h-8 w-8 shrink-0"
            aria-hidden="true"
          >
            <rect
              x="2"
              y="2"
              width="36"
              height="36"
              rx="10"
              stroke="white"
              strokeWidth="2.2"
            />
            <path
              d="M10.5 13L17 27L23.5 13M21.5 13L28 27L34.5 13"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-display text-base font-bold tracking-wider text-white sm:text-lg">
            {storeName}
          </span>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-7 text-sm font-medium text-zinc-400 md:flex"
        >
          <a
            href="#products"
            className="whitespace-nowrap shrink-0 py-1 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:text-white"
          >
            Products
          </a>
          <a
            href="#categories"
            className="whitespace-nowrap shrink-0 py-1 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:text-white"
          >
            Categories
          </a>
          <a
            href="#contact"
            className="whitespace-nowrap shrink-0 py-1 transition-colors duration-150 hover:text-white focus-visible:outline-none focus-visible:text-white"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex min-h-[40px] shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-white/20 bg-white/[0.06] px-4 py-2 text-xs font-semibold tracking-wide text-white transition-all duration-150 hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isAdminAuthenticated ? 'Admin Studio' : 'Admin Panel'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
