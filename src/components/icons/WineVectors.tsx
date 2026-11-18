import React from 'react';
import type { AromaKey, GlassType, WineCategory } from '../../types/sommelier';

export const VenueLogo: React.FC<{
  venueId: string;
  size?: 'sm' | 'md';
}> = ({ venueId, size = 'md' }) => {
  const isFrere = venueId === 'pilot_01';
  const heightClass = size === 'sm' ? 'h-7' : 'h-10';

  if (isFrere) {
    return (
      <div
        className={`inline-flex items-center gap-2.5 ${heightClass}`}
        aria-label="FRÈRE Seoul"
      >
        {/* Architectural arch monogram inspired by Samseong-dong Frère menu */}
        <svg
          viewBox="0 0 36 36"
          fill="none"
          className={size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'}
          aria-hidden="true"
        >
          <rect
            x="2"
            y="2"
            width="32"
            height="32"
            rx="8"
            fill="#F3EAD3"
            stroke="#8B6F3D"
            strokeWidth="1.2"
          />
          <path
            d="M11 26V15C11 11.1 14.1 8 18 8C21.9 8 25 11.1 25 15V26"
            stroke="#4A3820"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M14.5 18H21.5M18 13V26"
            stroke="#6B1D2F"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="leading-none">
          <div
            className={`font-display font-bold tracking-[0.18em] text-[var(--text-primary)] ${
              size === 'sm' ? 'text-[13px]' : 'text-[16px]'
            }`}
          >
            FRÈRE
          </div>
          <div className="mt-0.5 text-[9px] font-semibold tracking-[0.26em] text-[var(--text-secondary)]">
            SEOUL · SAMSEONG
          </div>
        </div>
      </div>
    );
  }

  // HAVRE Jeju Wine Bar emblem (double-border bistro crest + coastal arc)
  return (
    <div
      className={`inline-flex items-center gap-2.5 ${heightClass}`}
      aria-label="HAVRE Jeju"
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        className={size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'}
        aria-hidden="true"
      >
        <rect
          x="2"
          y="2"
          width="32"
          height="32"
          rx="8"
          fill="#F5EBEF"
          stroke="#6B1D2F"
          strokeWidth="1.2"
        />
        <rect
          x="5"
          y="5"
          width="26"
          height="26"
          rx="5.5"
          stroke="#6B1D2F"
          strokeWidth="0.7"
          strokeOpacity="0.45"
        />
        <path
          d="M12 10V26M24 10V26M12 18H24"
          stroke="#6B1D2F"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M9.5 23.5C13 21.5 16 25 18 23.5C20 22 23 24.5 26.5 22.8"
          stroke="#B8863B"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
      <div className="leading-none">
        <div
          className={`font-display font-bold tracking-[0.18em] text-[var(--text-primary)] ${
            size === 'sm' ? 'text-[13px]' : 'text-[16px]'
          }`}
        >
          HAVRE
        </div>
        <div className="mt-0.5 text-[9px] font-semibold tracking-[0.22em] text-[var(--text-secondary)]">
          JEJU · WINE BAR
        </div>
      </div>
    </div>
  );
};

export const SommelierBrandEmblem: React.FC<{ className?: string }> = ({
  className = 'brand-lockup-icon',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Stylized wine glass bowl + stem + luminous 'On' arc */}
    <path
      d="M10 6.5H22L21.2 13.4C20.9 16.3 18.7 18.5 16 18.5C13.3 18.5 11.1 16.3 10.8 13.4L10 6.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 18.5V26.5M12 26.5H20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M11.6 12.8C13.1 12.1 14.5 13.5 16 12.8C17.5 12.1 18.9 13.3 20.4 12.8"
      stroke="#6B1D2F"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M24.2 5.5C25.8 7.1 26.5 9.2 26.2 11.4"
      stroke="#B8863B"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const SommelierAvatar: React.FC<{
  personaId: string;
  size?: number;
}> = ({ personaId, size = 52 }) => {
  if (personaId === 'french_classic') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="32" fill="#EFE8E6" />
        {/* Hair */}
        <path d="M18 28C18 18 24 13 32 13C40 13 46 18 46 28V31H18V28Z" fill="#2A2426" />
        {/* Shoulders / Suit */}
        <path d="M12 58C14 47 21 43 32 43C43 43 50 47 52 58H12Z" fill="#2B1C22" />
        {/* Shirt V + Tie */}
        <path d="M27 43L32 51L37 43H27Z" fill="#FFFFFF" />
        {/* Face */}
        <circle cx="32" cy="29" r="10.5" fill="#F2CFC0" />
        {/* Hair bang */}
        <path d="M21 25C24 20 35 18 43 24C41 18 34 15 26 17C22 18 20 21 21 25Z" fill="#2A2426" />
        {/* Eyes & gentle smile */}
        <circle cx="28.2" cy="29.5" r="1.2" fill="#1C191A" />
        <circle cx="35.8" cy="29.5" r="1.2" fill="#1C191A" />
        <path d="M29.5 33.8C31 35 33 35 34.5 33.8" stroke="#6E4E46" strokeWidth="1.5" strokeLinecap="round" />
        {/* Sommelier pin */}
        <circle cx="40.5" cy="51.5" r="2.2" stroke="#D9B982" strokeWidth="1.2" />
      </svg>
    );
  }

  if (personaId === 'new_korean') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <circle cx="32" cy="32" r="32" fill="#ECE7E2" />
        {/* Long dark hair */}
        <path d="M17 28C17 17 24 12 32 12C40 12 47 17 47 28V43H17V28Z" fill="#231D1E" />
        {/* Jacket */}
        <path d="M12 58C14 47 21 43 32 43C43 43 50 47 52 58H12Z" fill="#6B1D2F" />
        {/* White collar */}
        <path d="M26.5 43L32 49.5L37.5 43H26.5Z" fill="#FAF8F6" />
        {/* Face */}
        <circle cx="32" cy="28.5" r="10" fill="#F6D7C8" />
        <path d="M22 25C25 20 36 20 42 25C40 18 25 18 22 25Z" fill="#231D1E" />
        <circle cx="28.5" cy="29" r="1.2" fill="#1C191A" />
        <circle cx="35.5" cy="29" r="1.2" fill="#1C191A" />
        <path d="M29.5 33.2C31 34.4 33 34.4 34.5 33.2" stroke="#7A564D" strokeWidth="1.5" strokeLinecap="round" />
        {/* Lapel glass emblem */}
        <path d="M40 49.5H43L42.5 52C42.2 52.8 40.8 52.8 40.5 52L40 49.5Z" stroke="#FAF8F6" strokeWidth="1.1" />
      </svg>
    );
  }

  // natural_explorer
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="#E3EAE6" />
      {/* Casual sweater */}
      <path d="M12 58C14 47 21 43 32 43C43 43 50 47 52 58H12Z" fill="#2D4A3E" />
      {/* Face */}
      <circle cx="32" cy="29" r="10.2" fill="#F3D0BF" />
      {/* Hair */}
      <path d="M21 25C21 17 26 14 32 14C38 14 43 17 43 25C39 22 26 22 21 25Z" fill="#24201F" />
      <circle cx="28.3" cy="29.3" r="1.2" fill="#1C191A" />
      <circle cx="35.7" cy="29.3" r="1.2" fill="#1C191A" />
      <path d="M29.5 33.6C31 34.8 33 34.8 34.5 33.6" stroke="#6E4E46" strokeWidth="1.5" strokeLinecap="round" />
      {/* Tastevin emblem */}
      <path d="M40 50.5H43L42.6 52.8C42.3 53.5 40.7 53.5 40.4 52.8L40 50.5Z" stroke="#E8F0EC" strokeWidth="1.1" />
    </svg>
  );
};

export const WineBottleIllustration: React.FC<{
  category: WineCategory;
  producer?: string;
  vintage?: number;
  className?: string;
}> = ({ category, producer, vintage, className = 'w-12 h-28' }) => {
  const palette: Record<
    WineCategory,
    { glass: string; highlight: string; foil: string; label: string; wineBand: string }
  > = {
    sparkling: {
      glass: '#2B3B2B',
      highlight: '#455A44',
      foil: '#B8863B',
      label: '#F7F3EC',
      wineBand: '#C99B4E',
    },
    white: {
      glass: '#4E5B3C',
      highlight: '#6D7D57',
      foil: '#8A8479',
      label: '#FAF7F1',
      wineBand: '#D8C78A',
    },
    rose_orange: {
      glass: '#8F6A56',
      highlight: '#B48870',
      foil: '#6B1D2F',
      label: '#FAF6F2',
      wineBand: '#D97B6C',
    },
    red: {
      glass: '#25171A',
      highlight: '#4A2C33',
      foil: '#6B1D2F',
      label: '#F8F4F0',
      wineBand: '#6B1D2F',
    },
    dessert: {
      glass: '#6A5629',
      highlight: '#91783B',
      foil: '#B8863B',
      label: '#FDF8EE',
      wineBand: '#B8863B',
    },
  };

  const p = palette[category];
  const shortProducer = (producer ?? 'CELLAR').slice(0, 8).toUpperCase();

  return (
    <svg
      viewBox="0 0 64 164"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Bottle neck & body */}
      <path
        d="M26 8H38V40C38 48 50 54 50 70V148C50 153.5 45.5 156 32 156C18.5 156 14 153.5 14 148V70C14 54 26 48 26 40V8Z"
        fill={p.glass}
      />
      {/* Foil capsule */}
      <path d="M26 8H38V27H26V8Z" fill={p.foil} />
      {/* Glass sheen highlight */}
      <path
        d="M20 72C20 61 27 56 28 45V30"
        stroke={p.highlight}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Front paper label */}
      <rect x="17" y="76" width="30" height="46" rx="2.5" fill={p.label} />
      <rect x="17" y="81" width="30" height="3.5" fill={p.wineBand} />
      <text
        x="32"
        y="97"
        textAnchor="middle"
        fill="#1C191A"
        fontSize="5.2"
        fontWeight="700"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        {shortProducer}
      </text>
      <text
        x="32"
        y="109"
        textAnchor="middle"
        fill="#6E6568"
        fontSize="6.5"
        fontWeight="600"
        fontFamily="Plus Jakarta Sans, sans-serif"
      >
        {vintage ?? 'NV'}
      </text>
    </svg>
  );
};

export const GlassSilhouetteIcon: React.FC<{
  type: GlassType;
  active?: boolean;
  size?: number;
}> = ({ type, active = true, size = 28 }) => {
  const strokeColor = active ? 'currentColor' : 'currentColor';
  const fillTint = active ? 'rgba(107, 29, 47, 0.16)' : 'none';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={active ? 'text-[#6B1D2F] dark:text-[#E092A4]' : 'opacity-30'}
      aria-hidden="true"
    >
      {type === 'flute' && (
        <>
          <path
            d="M13 4H19L18.2 14.5C18 16.5 17 17.8 16 17.8C15 17.8 14 16.5 13.8 14.5L13 4Z"
            fill={fillTint}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M16 17.8V27M11.5 27H20.5" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {type === 'white' && (
        <>
          <path
            d="M11 6H21L20.3 13.2C20 16.1 18.2 18 16 18C13.8 18 12 16.1 11.7 13.2L11 6Z"
            fill={fillTint}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M16 18V27M11.5 27H20.5" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {type === 'burgundy' && (
        <>
          <path
            d="M10.5 6H21.5C23 11 23 18 16 18.5C9 18 9 11 10.5 6Z"
            fill={fillTint}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M16 18.5V27M11.5 27H20.5" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {type === 'bordeaux' && (
        <>
          <path
            d="M10.5 4.5H21.5L21 12.8C20.7 16.2 18.6 18.5 16 18.5C13.4 18.5 11.3 16.2 11 12.8L10.5 4.5Z"
            fill={fillTint}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M16 18.5V27M11.5 27H20.5" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {type === 'dessert' && (
        <>
          <path
            d="M12.5 8.5H19.5L19 14.2C18.8 16.2 17.5 17.5 16 17.5C14.5 17.5 13.2 16.2 13 14.2L12.5 8.5Z"
            fill={fillTint}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M16 17.5V27M12 27H20" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};

export const AromaVectorIcon: React.FC<{
  aroma: AromaKey;
  size?: number;
}> = ({ aroma, size = 34 }) => {
  switch (aroma) {
    case 'cherry':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M19 7C16 11 14 16 13.5 20M19 7C21 11 22.5 16 23 20.5" stroke="#5A7348" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M19 7C21.5 6.5 24 7.5 25 9.5C22.5 10 20.5 9 19 7Z" fill="#DCE5D2" stroke="#5A7348" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="12.5" cy="24" r="5" fill="#F2D7DD" stroke="#6B1D2F" strokeWidth="1.5" />
          <circle cx="23.5" cy="25" r="5" fill="#E8C2CB" stroke="#6B1D2F" strokeWidth="1.5" />
        </svg>
      );
    case 'blackcurrant':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M18 6V12M18 9L13 13M18 10L23 14" stroke="#5A7348" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="13" cy="18" r="3.6" fill="#D5CBE0" stroke="#4B2854" strokeWidth="1.5" />
          <circle cx="22.5" cy="18.5" r="3.6" fill="#D5CBE0" stroke="#4B2854" strokeWidth="1.5" />
          <circle cx="17.5" cy="22.5" r="3.8" fill="#C4B5D4" stroke="#4B2854" strokeWidth="1.5" />
          <circle cx="13.5" cy="26.5" r="3.2" fill="#D5CBE0" stroke="#4B2854" strokeWidth="1.5" />
          <circle cx="22" cy="26.5" r="3.2" fill="#C4B5D4" stroke="#4B2854" strokeWidth="1.5" />
        </svg>
      );
    case 'citrus':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M7 22C7 14.5 12.5 9 20 9C24 9 27.5 11.5 29 15L18 26C14 26 9.5 25 7 22Z" fill="#FAECC9" stroke="#B8863B" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M18 11.5V22.5M12.5 17H23.5M14 13L21 20" stroke="#B8863B" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'pear_apple':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M18 6V10" stroke="#5A7348" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18 7.5C20.5 6.5 23 7.5 24 9.5C21.5 10 19.5 9 18 7.5Z" fill="#DCE5D2" stroke="#5A7348" strokeWidth="1.5" strokeLinejoin="round" />
          <path
            d="M18 10.5C15 10.5 13.5 13 13 16C12.5 19 9.5 20.5 9.5 24.5C9.5 28.5 13 30.5 18 30.5C23 30.5 26.5 28.5 26.5 24.5C26.5 20.5 23.5 19 23 16C22.5 13 21 10.5 18 10.5Z"
            fill="#EAEED7"
            stroke="#6C7D47"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'white_flower':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <circle cx="18" cy="10.5" r="4" fill="#FAF4E8" stroke="#6E6568" strokeWidth="1.5" />
          <circle cx="25" cy="15.5" r="4" fill="#FAF4E8" stroke="#6E6568" strokeWidth="1.5" />
          <circle cx="22.5" cy="23.5" r="4" fill="#FAF4E8" stroke="#6E6568" strokeWidth="1.5" />
          <circle cx="13.5" cy="23.5" r="4" fill="#FAF4E8" stroke="#6E6568" strokeWidth="1.5" />
          <circle cx="11" cy="15.5" r="4" fill="#FAF4E8" stroke="#6E6568" strokeWidth="1.5" />
          <circle cx="18" cy="17.5" r="3.2" fill="#F2D99B" stroke="#B8863B" strokeWidth="1.5" />
        </svg>
      );
    case 'oak_cedar':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <rect x="8" y="10" width="20" height="16" rx="4" fill="#EBDDD1" stroke="#6F4C36" strokeWidth="1.5" />
          <path d="M8 14.5H28M8 21.5H28M14 10V26M22 10V26" stroke="#6F4C36" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'pepper_spice':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <circle cx="13" cy="14" r="3" fill="#E3D7D5" stroke="#4D3D3F" strokeWidth="1.5" />
          <circle cx="23" cy="13" r="2.6" fill="#E3D7D5" stroke="#4D3D3F" strokeWidth="1.5" />
          <circle cx="18" cy="20" r="3.4" fill="#D4C2BF" stroke="#4D3D3F" strokeWidth="1.5" />
          <circle cx="12.5" cy="25.5" r="2.5" fill="#E3D7D5" stroke="#4D3D3F" strokeWidth="1.5" />
          <circle cx="24" cy="24.5" r="2.8" fill="#D4C2BF" stroke="#4D3D3F" strokeWidth="1.5" />
        </svg>
      );
    case 'butter_brioche':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M8 21C8 14 12.5 10 18 10C23.5 10 28 14 28 21C28 24 26 26 23 26H13C10 26 8 24 8 21Z" fill="#F8E7C2" stroke="#A6762E" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M14 11.5C14.5 14 15.5 15.5 17 16.5M20 11C20.5 13.5 21.5 15 23 16" stroke="#A6762E" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'mineral_stone':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M8 24L13 12L21 9L28 17L24 26H11L8 24Z" fill="#E5E4E2" stroke="#5A5D62" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M13 12L18 19L28 17M18 19L16 26" stroke="#5A5D62" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'honey':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M18 8L22.5 10.6V15.8L18 18.4L13.5 15.8V10.6L18 8Z" fill="#F9E3A6" stroke="#B8863B" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M13.5 15.8L18 18.4V23.6L13.5 26.2L9 23.6V18.4L13.5 15.8Z" fill="#F4D582" stroke="#B8863B" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M22.5 15.8L27 18.4V23.6L22.5 26.2L18 23.6V18.4L22.5 15.8Z" fill="#F4D582" stroke="#B8863B" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case 'leather_earth':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M8 23C11 16 16 12 24 12C26.5 12 28 14 28 16.5C28 21.5 22.5 26 15 26C11 26 8 25 8 23Z" fill="#E6D5C8" stroke="#6B4433" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M12 22C16 20 20 17.5 24 15" stroke="#6B4433" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2.5" />
        </svg>
      );
    case 'herbal_mint':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <path d="M18 28V13" stroke="#42694E" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M18 20C12 20 9.5 15.5 10 11C14.5 11 18 14 18 20Z" fill="#D4E8D9" stroke="#42694E" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M18 17C24 17 26.5 12.5 26 8C21.5 8 18 11 18 17Z" fill="#C4DFCA" stroke="#42694E" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
  }
};
