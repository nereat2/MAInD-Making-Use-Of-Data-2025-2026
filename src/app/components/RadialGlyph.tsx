import { motion } from 'motion/react';

interface RadialGlyphProps {
  colors: string[];
  values: number[]; // Scale factors for each petal [0 to 1]
  top: string;
  left: string;
  size?: number;
  name: string;
}

export function RadialGlyph({ colors, values, top, left, size = 120, name }: RadialGlyphProps) {
  // Ensure we have 6 colors and 6 values
  const displayColors = colors.length >= 6 ? colors.slice(0, 6) : [...colors, ...Array(6 - colors.length).fill('#ccc')];
  const displayValues = values.length >= 6 ? values.slice(0, 6) : [...values, ...Array(6 - values.length).fill(0.5)];
  
  const safeId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <div
      className="absolute flex items-center justify-center group pointer-events-auto"
      style={{
        top,
        left,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible"
        initial={{ rotate: 0 }}
        animate={{ 
          rotate: 360,
        }}
        transition={{
          rotate: { duration: 40, repeat: Infinity, ease: "linear" },
        }}
        whileHover={{ scale: 1.1 }}
      >
        <defs>
          {displayColors.map((color, i) => (
            <linearGradient key={`grad-${i}`} id={`petal-grad-${i}-${safeId}`} x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="60%" stopColor={color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
          ))}
          <filter id={`glow-${safeId}`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 6 Petals with variable scaling */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
          // Calculate scale: we want a minimum visible size even for low counts
          const scale = 0.3 + (displayValues[i] * 0.9);
          
          return (
            <motion.path
              key={angle}
              d="M50 50 C60 40 70 20 50 10 C30 20 40 40 50 50"
              fill={`url(#petal-grad-${i}-${safeId})`}
              transform-origin="50 50"
              initial={{ opacity: 0.6, scale: 0 }}
              animate={{ 
                opacity: 0.8,
                scale: scale,
                rotate: angle 
              }}
              whileHover={{ 
                opacity: 1, 
                scale: scale * 1.1,
                transition: { duration: 0.2 }
              }}
              filter={`url(#glow-${safeId})`}
              style={{ mixBlendMode: 'multiply' }}
              transition={{
                scale: { type: "spring", stiffness: 100, damping: 15, delay: i * 0.1 }
              }}
            />
          );
        })}

        {/* Central Hub */}
        <circle cx="50" cy="50" r="3" fill="white" className="shadow-lg" />
        <circle cx="50" cy="50" r="1.5" fill="black" className="opacity-20" />
      </motion.svg>

      {/* Detail Label on Hover */}
      <div className="absolute top-[115%] flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 pointer-events-none">
        <div className="w-px h-6 bg-black/10 mb-2" />
        <div className="bg-white/90 backdrop-blur-md border border-black/5 p-3 rounded-xs shadow-2xl flex flex-col items-center gap-1">
          <span className="text-[11px] font-black tracking-[0.25em] text-black uppercase">
            {name}
          </span>
          <div className="flex gap-1 mt-1">
            {displayValues.map((v, idx) => (
              <div 
                key={idx} 
                className="w-1 bg-black/10 rounded-full overflow-hidden" 
                style={{ height: '12px' }}
              >
                <div 
                  className="w-full bg-black/40" 
                  style={{ height: `${v * 100}%`, marginTop: `${(1 - v) * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
