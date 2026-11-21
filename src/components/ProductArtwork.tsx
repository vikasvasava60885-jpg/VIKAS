import React, { useEffect, useState } from 'react';
import { ArtworkPreset } from '../types/store';

interface ProductArtworkProps {
  imageUrl?: string;
  preset?: ArtworkPreset;
  category?: string;
  title: string;
  className?: string;
}

function resolvePreset(preset?: ArtworkPreset, category?: string): ArtworkPreset {
  if (preset) return preset;
  const cat = (category || '').toLowerCase();
  if (cat.includes('mobile') || cat.includes('phone')) return 'phone';
  if (cat.includes('earbud') || cat.includes('tws')) return 'earbuds';
  if (cat.includes('headphone') || cat.includes('audio')) return 'headphones';
  if (cat.includes('watch')) return 'smartwatch';
  if (cat.includes('laptop') || cat.includes('mac') || cat.includes('pc')) return 'laptop';
  if (cat.includes('accessor') || cat.includes('power') || cat.includes('charger')) return 'powerbank';
  return 'generic';
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  imageUrl,
  preset,
  category,
  title,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  if (imageUrl && !imgError) {
    return (
      <img
        src={imageUrl}
        alt={title}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${className}`}
      />
    );
  }

  const activePreset = resolvePreset(preset, category);

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden bg-[#111114] ${className}`}
      role="img"
      aria-label={`${title} studio product render`}
    >
      {/* Subtle monochrome studio radial spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.03) 42%, rgba(10,10,12,0.95) 85%)',
        }}
      />
      {/* Horizon slate surface line */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] border-t border-white/[0.06] bg-gradient-to-b from-white/[0.025] to-black/60" />

      <div className="relative z-10 flex h-full w-full items-center justify-center p-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
        {activePreset === 'phone' && (
          <svg viewBox="0 0 240 180" className="h-full w-full max-w-[220px]" fill="none">
            <defs>
              <linearGradient id="phoneBody" x1="65" y1="22" x2="175" y2="158" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2A2A30" />
                <stop offset="0.5" stopColor="#141417" />
                <stop offset="1" stopColor="#09090B" />
              </linearGradient>
              <linearGradient id="phoneRim" x1="70" y1="20" x2="170" y2="160" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" stopOpacity="0.65" />
                <stop offset="0.5" stopColor="#A1A1AA" stopOpacity="0.2" />
                <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <ellipse cx="120" cy="154" rx="54" ry="8" fill="#000" fillOpacity="0.65" />
            <rect x="78" y="20" width="84" height="134" rx="16" fill="url(#phoneBody)" stroke="url(#phoneRim)" strokeWidth="1.5" />
            <rect x="83" y="25" width="74" height="124" rx="12" fill="#0D0D10" stroke="white" strokeOpacity="0.06" />
            {/* Camera Module */}
            <rect x="89" y="31" width="32" height="44" rx="9" fill="#18181C" stroke="white" strokeOpacity="0.24" />
            <circle cx="99" cy="42" r="5.5" fill="#09090B" stroke="white" strokeOpacity="0.45" strokeWidth="1.2" />
            <circle cx="99" cy="42" r="2.2" fill="#3F3F46" />
            <circle cx="99" cy="61" r="5.5" fill="#09090B" stroke="white" strokeOpacity="0.45" strokeWidth="1.2" />
            <circle cx="99" cy="61" r="2.2" fill="#3F3F46" />
            <circle cx="112" cy="51.5" r="4.5" fill="#09090B" stroke="white" strokeOpacity="0.35" strokeWidth="1.1" />
            <circle cx="112" cy="39" r="2" fill="#E4E4E7" fillOpacity="0.7" />
            {/* Side buttons */}
            <rect x="162" y="48" width="2" height="18" rx="1" fill="white" fillOpacity="0.35" />
            <rect x="162" y="72" width="2" height="12" rx="1" fill="white" fillOpacity="0.25" />
          </svg>
        )}

        {activePreset === 'headphones' && (
          <svg viewBox="0 0 240 180" className="h-full w-full max-w-[220px]" fill="none">
            <ellipse cx="120" cy="154" rx="58" ry="8" fill="#000" fillOpacity="0.65" />
            {/* Headband arc */}
            <path
              d="M66 102C66 60 88 30 120 30C152 30 174 60 174 102"
              stroke="white"
              strokeOpacity="0.45"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M66 102C66 60 88 30 120 30C152 30 174 60 174 102"
              stroke="#18181B"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Metallic Hinges */}
            <rect x="61" y="92" width="7" height="18" rx="3" fill="#D4D4D8" fillOpacity="0.65" />
            <rect x="172" y="92" width="7" height="18" rx="3" fill="#D4D4D8" fillOpacity="0.65" />
            {/* Left Earcup */}
            <rect x="50" y="102" width="28" height="44" rx="14" fill="#18181B" stroke="white" strokeOpacity="0.35" strokeWidth="1.4" />
            <rect x="74" y="106" width="10" height="36" rx="5" fill="#27272A" />
            {/* Right Earcup */}
            <rect x="162" y="102" width="28" height="44" rx="14" fill="#18181B" stroke="white" strokeOpacity="0.35" strokeWidth="1.4" />
            <rect x="156" y="106" width="10" height="36" rx="5" fill="#27272A" />
            {/* Subtle highlight ring */}
            <circle cx="64" cy="124" r="7" stroke="white" strokeOpacity="0.16" />
            <circle cx="176" cy="124" r="7" stroke="white" strokeOpacity="0.16" />
          </svg>
        )}

        {activePreset === 'smartwatch' && (
          <svg viewBox="0 0 240 180" className="h-full w-full max-w-[220px]" fill="none">
            <ellipse cx="120" cy="156" rx="44" ry="7" fill="#000" fillOpacity="0.65" />
            {/* Top & Bottom Straps */}
            <path d="M98 22H142L146 50H94L98 22Z" fill="#18181B" stroke="white" strokeOpacity="0.18" />
            <path d="M94 130H146L142 154H98L94 130Z" fill="#18181B" stroke="white" strokeOpacity="0.18" />
            {/* Watch Case */}
            <rect x="82" y="48" width="76" height="84" rx="22" fill="#27272A" stroke="white" strokeOpacity="0.5" strokeWidth="1.5" />
            <rect x="88" y="54" width="64" height="72" rx="17" fill="#070709" stroke="white" strokeOpacity="0.12" />
            {/* Crown */}
            <rect x="158" y="72" width="6" height="16" rx="2.5" fill="#D4D4D8" fillOpacity="0.7" />
            <rect x="158" y="96" width="4" height="12" rx="2" fill="#A1A1AA" fillOpacity="0.5" />
            {/* Minimalist Dial */}
            <circle cx="120" cy="90" r="22" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
            <path d="M120 72A18 18 0 1 1 103 96" stroke="white" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" />
            <text x="120" y="94" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="monospace">
              10:09
            </text>
          </svg>
        )}

        {activePreset === 'laptop' && (
          <svg viewBox="0 0 240 180" className="h-full w-full max-w-[220px]" fill="none">
            <ellipse cx="120" cy="148" rx="84" ry="8" fill="#000" fillOpacity="0.65" />
            {/* Display Lid */}
            <rect x="44" y="32" width="152" height="96" rx="8" fill="#18181B" stroke="white" strokeOpacity="0.4" strokeWidth="1.4" />
            <rect x="50" y="38" width="140" height="82" rx="4" fill="#0A0A0D" />
            {/* Subtle display reflection */}
            <path d="M52 118L112 40H148L88 118H52Z" fill="white" fillOpacity="0.04" />
            <circle cx="120" cy="35" r="1.2" fill="white" fillOpacity="0.5" />
            {/* Keyboard Deck / Base */}
            <path d="M26 128H214L204 142C202 144 198 145 194 145H46C42 145 38 144 36 142L26 128Z" fill="#27272A" stroke="white" strokeOpacity="0.35" strokeWidth="1.2" />
            <rect x="102" y="129" width="36" height="3" rx="1.5" fill="#09090B" />
          </svg>
        )}

        {activePreset === 'earbuds' && (
          <svg viewBox="0 0 240 180" className="h-full w-full max-w-[220px]" fill="none">
            <ellipse cx="96" cy="148" rx="44" ry="7" fill="#000" fillOpacity="0.65" />
            <ellipse cx="166" cy="148" rx="34" ry="6" fill="#000" fillOpacity="0.55" />
            {/* Charging Case */}
            <rect x="56" y="64" width="76" height="78" rx="22" fill="#18181B" stroke="white" strokeOpacity="0.4" strokeWidth="1.4" />
            <path d="M56 90H132" stroke="white" strokeOpacity="0.2" strokeWidth="1.2" />
            <circle cx="94" cy="102" r="2" fill="white" fillOpacity="0.8" />
            {/* Left & Right Earbuds */}
            <circle cx="158" cy="112" r="11" fill="#27272A" stroke="white" strokeOpacity="0.45" strokeWidth="1.2" />
            <rect x="155" y="118" width="6" height="24" rx="3" fill="#18181B" stroke="white" strokeOpacity="0.3" />
            <circle cx="182" cy="116" r="11" fill="#27272A" stroke="white" strokeOpacity="0.45" strokeWidth="1.2" />
            <rect x="179" y="122" width="6" height="22" rx="3" fill="#18181B" stroke="white" strokeOpacity="0.3" />
          </svg>
        )}

        {activePreset === 'powerbank' && (
          <svg viewBox="0 0 240 180" className="h-full w-full max-w-[220px]" fill="none">
            <ellipse cx="102" cy="150" rx="46" ry="7" fill="#000" fillOpacity="0.65" />
            <ellipse cx="168" cy="148" rx="30" ry="6" fill="#000" fillOpacity="0.55" />
            {/* Magnetic Power Bank */}
            <rect x="64" y="44" width="76" height="100" rx="12" fill="#18181B" stroke="white" strokeOpacity="0.4" strokeWidth="1.4" />
            <circle cx="102" cy="88" r="21" stroke="white" strokeOpacity="0.35" strokeWidth="2.5" />
            <path d="M102 114V124" stroke="white" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="102" cy="136" r="1.5" fill="white" fillOpacity="0.7" />
            {/* Coiled USB-C Cable */}
            <circle cx="168" cy="116" r="24" stroke="#3F3F46" strokeWidth="6" />
            <circle cx="168" cy="116" r="24" stroke="white" strokeOpacity="0.22" strokeWidth="1" />
            <rect x="142" y="84" width="12" height="18" rx="3" fill="#27272A" stroke="white" strokeOpacity="0.4" />
          </svg>
        )}

        {activePreset === 'generic' && (
          <svg viewBox="0 0 240 180" className="h-full w-full max-w-[220px]" fill="none">
            <ellipse cx="120" cy="148" rx="52" ry="8" fill="#000" fillOpacity="0.65" />
            <rect x="70" y="42" width="100" height="98" rx="18" fill="#18181B" stroke="white" strokeOpacity="0.38" strokeWidth="1.4" />
            <circle cx="120" cy="91" r="24" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />
            <path d="M108 91H132M120 79V103" stroke="white" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </div>
  );
};
