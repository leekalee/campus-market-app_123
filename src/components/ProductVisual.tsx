import React, { useState } from 'react';
import { BookOpen, Coffee, Laptop, MapPin, Shirt } from 'lucide-react';

interface ProductVisualProps {
  imageUrl: string;
  alt: string;
  category?: string;
  className?: string;
}

function SeedSvgScene({ kind }: { kind: string }) {
  if (kind === 'svg://calculator') {
    return (
      <svg
        viewBox="0 0 400 300"
        className="h-full w-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Casio Scientific Calculator"
      >
        <defs>
          <linearGradient id="deskCalc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F1E5D1" />
            <stop offset="100%" stopColor="#DEC8A8" />
          </linearGradient>
          <linearGradient id="calcBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#262A34" />
            <stop offset="100%" stopColor="#14171F" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#deskCalc)" />
        {/* Graph paper sheet */}
        <g transform="translate(28, 30) rotate(-6)">
          <rect width="230" height="240" rx="6" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M20 40 H210 M20 75 H210 M20 110 H210 M20 145 H210 M20 180 H210" stroke="#E2E8F0" strokeWidth="1.5" />
          <path d="M55 20 V220 M95 20 V220 M135 20 V220 M175 20 V220" stroke="#E2E8F0" strokeWidth="1.5" />
          <path d="M35 160 Q95 75 185 110" fill="none" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        {/* Calculator */}
        <g transform="translate(155, 28) rotate(8)">
          <rect x="4" y="8" width="142" height="232" rx="16" fill="rgba(15,23,42,0.18)" />
          <rect width="142" height="232" rx="16" fill="url(#calcBody)" stroke="#334155" strokeWidth="2" />
          {/* LCD screen */}
          <rect x="16" y="22" width="110" height="46" rx="6" fill="#B6C6B4" stroke="#0F172A" strokeWidth="2" />
          <text x="26" y="42" fill="#1E293B" fontSize="11" fontFamily="monospace" fontWeight="700">
            fx-991EX
          </text>
          <text x="118" y="59" textAnchor="end" fill="#0F172A" fontSize="16" fontFamily="monospace" fontWeight="700">
            3.14159
          </text>
          {/* Solar panel */}
          <rect x="78" y="8" width="46" height="9" rx="2" fill="#3B2F2F" />
          {/* Buttons grid */}
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={18 + col * 28}
                y={90 + row * 31}
                width="22"
                height="20"
                rx="4"
                fill={row === 3 && col === 3 ? '#2563EB' : row === 0 && col === 3 ? '#DC2626' : '#475569'}
              />
            ))
          )}
        </g>
        {/* Coffee mug corner */}
        <circle cx="352" cy="56" r="32" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="3" />
        <circle cx="352" cy="56" r="23" fill="#6F4E37" />
      </svg>
    );
  }

  if (kind === 'svg://kettle') {
    return (
      <svg
        viewBox="0 0 400 300"
        className="h-full w-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Xiaomi Electric Kettle"
      >
        <defs>
          <linearGradient id="dormWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EFF6FF" />
            <stop offset="100%" stopColor="#DBEAFE" />
          </linearGradient>
          <linearGradient id="kettleBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="65%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#dormWall)" />
        {/* Wooden dorm desk */}
        <rect x="0" y="218" width="400" height="82" fill="#D6B58D" />
        <line x1="0" y1="218" x2="400" y2="218" stroke="#B89368" strokeWidth="3" />
        {/* Warm sunbeam */}
        <polygon points="0,0 190,0 290,218 40,218" fill="rgba(255,255,255,0.42)" />
        {/* Kettle handle */}
        <path
          d="M242 96 C288 96, 290 185, 250 185"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Kettle spout */}
        <path d="M138 92 L114 96 L136 122 Z" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
        {/* Kettle base */}
        <rect x="132" y="206" width="126" height="14" rx="4" fill="#334155" />
        {/* Kettle body */}
        <path
          d="M140 72 L248 72 L256 206 L132 206 Z"
          fill="url(#kettleBody)"
          stroke="#CBD5E1"
          strokeWidth="2"
        />
        {/* Lid */}
        <rect x="142" y="60" width="104" height="14" rx="5" fill="#E2E8F0" />
        {/* Indicator light */}
        <circle cx="194" cy="184" r="4" fill="#2563EB" />
        {/* Ceramic mug */}
        <rect x="288" y="168" width="48" height="50" rx="6" fill="#2563EB" />
        <path d="M336 178 C350 178, 350 206, 336 206" fill="none" stroke="#2563EB" strokeWidth="5" />
      </svg>
    );
  }

  if (kind === 'svg://hoodie') {
    return (
      <svg
        viewBox="0 0 400 300"
        className="h-full w-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Campus Oversized Hoodie"
      >
        <defs>
          <linearGradient id="woodBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F5ECE0" />
            <stop offset="100%" stopColor="#E6D5C1" />
          </linearGradient>
          <linearGradient id="hoodieNavy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#woodBg)" />
        {/* Folded hoodie */}
        <g transform="translate(88, 42)">
          <rect x="8" y="16" width="214" height="202" rx="22" fill="rgba(15,23,42,0.12)" />
          {/* Sleeves folded */}
          <rect x="0" y="34" width="224" height="170" rx="20" fill="url(#hoodieNavy)" />
          {/* Hood collar */}
          <path d="M58 34 C58 2, 166 2, 166 34 C144 52, 80 52, 58 34 Z" fill="#1D4ED8" />
          <path d="M76 34 C76 14, 148 14, 148 34 C132 45, 92 45, 76 34 Z" fill="#0F172A" opacity="0.45" />
          {/* Drawstrings */}
          <line x1="98" y1="45" x2="94" y2="96" stroke="#F8FAFC" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="126" y1="45" x2="130" y2="96" stroke="#F8FAFC" strokeWidth="3.5" strokeLinecap="round" />
          {/* Campus crest print */}
          <rect x="78" y="108" width="68" height="22" rx="4" fill="#EFF6FF" opacity="0.92" />
          <text x="112" y="123" textAnchor="middle" fill="#1E3A8A" fontSize="11" fontWeight="800" fontFamily="sans-serif">
            BISHKEK
          </text>
          {/* Kangaroo pocket seam */}
          <path d="M62 152 L162 152 L174 192 L50 192 Z" fill="#172554" opacity="0.5" />
        </g>
      </svg>
    );
  }

  return null;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  imageUrl,
  alt,
  category,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  if (imageUrl && imageUrl.startsWith('svg://')) {
    return (
      <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
        <SeedSvgScene kind={imageUrl} />
      </div>
    );
  }

  if (!imageUrl || imgError) {
    const Icon =
      category === 'textbooks'
        ? BookOpen
        : category === 'electronics'
          ? Laptop
          : category === 'dorm'
            ? Coffee
            : Shirt;

    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 text-blue-600 ${className}`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
          <Icon className="h-6 w-6" />
        </div>
        <span className="mt-2 max-w-[85%] truncate px-2 text-xs font-medium text-slate-500">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className={`object-cover ${className}`}
    />
  );
};

export const BishkekSafeMap: React.FC<{ safeZone: string }> = ({ safeZone }) => {
  return (
    <div className="relative h-36 w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#EBF3FA]">
      <svg viewBox="0 0 400 150" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        {/* Parks */}
        <rect x="18" y="18" width="90" height="52" rx="10" fill="#D1FAE5" />
        <rect x="292" y="82" width="88" height="50" rx="10" fill="#D1FAE5" />
        {/* City Blocks */}
        <rect x="122" y="14" width="76" height="44" rx="6" fill="#F8FAFC" />
        <rect x="214" y="14" width="84" height="44" rx="6" fill="#F8FAFC" />
        <rect x="122" y="72" width="76" height="58" rx="6" fill="#F8FAFC" />
        <rect x="214" y="72" width="64" height="58" rx="6" fill="#F8FAFC" />
        {/* Bishkek Avenues */}
        <line x1="0" y1="65" x2="400" y2="65" stroke="#FFFFFF" strokeWidth="9" />
        <line x1="0" y1="65" x2="400" y2="65" stroke="#FDE68A" strokeWidth="3" />
        <line x1="114" y1="0" x2="114" y2="150" stroke="#FFFFFF" strokeWidth="8" />
        <line x1="206" y1="0" x2="206" y2="150" stroke="#FFFFFF" strokeWidth="7" />
        <line x1="304" y1="0" x2="304" y2="150" stroke="#FFFFFF" strokeWidth="6" />
        <text x="155" y="42" fill="#94A3B8" fontSize="9" fontWeight="600">
          Chuy Ave
        </text>
        <text x="220" y="106" fill="#64748B" fontSize="11" fontWeight="700">
          Bishkek
        </text>
        {/* Safe zone radius */}
        <circle cx="206" cy="65" r="22" fill="rgba(37, 99, 235, 0.14)" />
        <circle cx="206" cy="65" r="7" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
      </svg>

      <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <MapPin className="h-3.5 w-3.5" />
        </span>
        <span className="truncate text-xs font-semibold text-slate-800">{safeZone}</span>
      </div>
    </div>
  );
};
