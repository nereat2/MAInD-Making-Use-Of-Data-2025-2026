import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { WordNetwork } from './components/word-network';
import { PARK_DATA } from './data';

// System-wide categories and colors
export const CATEGORIES = {
  experiential: '#C4A8FF',
  sensory: '#40FFB8',
  action: '#52E8FF',
  relational: '#FFE040',
  tension: '#FF7060',
  infrastructure: '#FFB47A'
};

const PARKS = [
  {
    id: 'parco-ciani',
    name: 'Parco Ciani',
    cx: 820, cy: 380, radius: 156,
    distribution: {
      experiential: 0.46,
      action: 0.20,
      sensory: 0.18,
      infrastructure: 0.10,
      relational: 0.05,
      tension: 0.01,
    }
  },
  {
    id: 'parco-tassino',
    name: 'Parco Tassino',
    cx: 480, cy: 320, radius: 112,
    distribution: {
      experiential: 0.35,
      sensory: 0.30,
      action: 0.15,
      infrastructure: 0.10,
      relational: 0.08,
      tension: 0.02,
    }
  },
  {
    id: 'parco-san-michele',
    name: 'Parco San Michele',
    cx: 1100, cy: 180, radius: 95,
    distribution: {
      sensory: 0.50,
      experiential: 0.25,
      action: 0.10,
      infrastructure: 0.05,
      relational: 0.05,
      tension: 0.05,
    }
  },
  {
    id: 'parco-panoramico',
    name: 'Parco Panoramico Paradiso',
    cx: 720, cy: 600, radius: 138,
    distribution: {
      experiential: 0.43,
      sensory: 0.23,
      infrastructure: 0.13,
      action: 0.11,
      relational: 0.09,
      tension: 0.01,
    }
  },
  {
    id: 'parco-lambertenghi',
    name: 'Parco Lambertenghi',
    cx: 620, cy: 220, radius: 100,
    distribution: {
      relational: 0.28,
      experiential: 0.28,
      infrastructure: 0.22,
      action: 0.11,
      sensory: 0.11,
      tension: 0.01,
    }
  }
];

function AuraBlob({ park, index, onClick }: { park: typeof PARKS[0], index: number, onClick: () => void }) {
  const spotOffsets = [0, 60, 120, 180, 240, 300].map((angle, i) => {
    const rad = (angle + (index * 45)) * (Math.PI / 180);
    return {
      x: Math.cos(rad) * 35,
      y: Math.sin(rad) * 35,
    };
  });

  const categories = Object.keys(park.distribution) as Array<keyof typeof CATEGORIES>;
  
  return (
    <motion.div
      className="absolute flex items-center justify-center cursor-pointer pointer-events-auto"
      style={{
        left: park.cx,
        top: park.cy,
        width: park.radius * 2.5,
        height: park.radius * 2.5,
        x: '-50%',
        y: '-50%',
      }}
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 6 + index,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      onClick={onClick}
    >
      <div className="relative w-full h-full rounded-full">
        <div 
          className="absolute inset-0 rounded-full blur-[35px]"
          style={{
            background: `radial-gradient(circle at center, ${CATEGORIES.experiential}55 0%, transparent 80%)`,
          }}
        />
        
        {categories.map((cat, i) => (
          <motion.div
            key={cat}
            className="absolute inset-0 rounded-full blur-[30px]"
            style={{
              background: `radial-gradient(circle at ${50 + spotOffsets[i].x}% ${50 + spotOffsets[i].y}%, ${CATEGORIES[cat as keyof typeof CATEGORIES]}99 0%, transparent 75%)`,
            }}
            animate={{
              x: [0, spotOffsets[i].x * 0.1, 0, -spotOffsets[i].x * 0.1, 0],
              y: [0, spotOffsets[i].y * 0.1, 0, -spotOffsets[i].y * 0.1, 0],
            }}
            transition={{
              duration: 12 + i * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <div 
        className="absolute inset-0 flex items-center justify-center"
      >
        <span className="text-[12px] font-medium tracking-[0.14em] text-[#0F0F0F] uppercase whitespace-nowrap bg-white/40 px-3 py-1 rounded-full backdrop-blur-[2px] shadow-sm">
          {park.name}
        </span>
      </div>
    </motion.div>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();

  const [selectedParkId, setSelectedParkId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);

  const handleParkClick = (id: string) => {
    setSelectedParkId(id);
    setIsTransitioning(true);
    setTimeout(() => {
      setShowNetwork(true);
      setIsTransitioning(false);
    }, 3500);
  };

  const selectedPark = PARKS.find(p => p.id === selectedParkId);
  const selectedParkData = selectedParkId ? PARK_DATA[selectedParkId] : null;

  const fadeOut = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const mapOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const persistentLabelOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1]);
  const scrollIndicatorFade = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const titleY = useTransform(scrollYProgress, [0, 0.4], [0, -window.innerHeight * 0.5 + 48]);
  const titleScale = useTransform(scrollYProgress, [0, 0.4], [1, 0.3]);

  return (
    <div className="relative h-[250vh] bg-white selection:bg-black/5">
      <div className="fixed top-8 left-12 z-50 pointer-events-none">
        <motion.div style={{ opacity: persistentLabelOpacity }} className="flex flex-col">
          <div className="text-[15px] font-light tracking-[0.1em] uppercase text-[#0F0F0F] leading-none">
            PERCEPTION MAP — ALL PARKS
          </div>
        </motion.div>
      </div>

      <div className="h-screen sticky top-0 flex flex-col items-center justify-center overflow-hidden z-20 pointer-events-none">
        <motion.div 
          style={{ 
            y: titleY, 
            scale: titleScale,
            top: "50%",
            left: "50%",
            translateX: "-50%",
            translateY: "-50%",
            position: 'absolute'
          }}
          className="flex flex-col items-center"
        >
          <h1 className="text-[52px] font-light tracking-[-0.03em] leading-[1.1] text-[#0F0F0F] whitespace-nowrap text-center">
            How does<br />a park feel?
          </h1>
        </motion.div>

        <motion.div 
          style={{ opacity: fadeOut, y: useTransform(scrollYProgress, [0, 0.4], [140, 100]) }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-32 flex flex-col items-center"
        >
          <p className="text-[14px] font-light italic text-[#2828288C] leading-[1.65] text-center max-w-md">
            A portrait of Lugano built from the words of the people who use it.
          </p>
          <div className="my-7 w-12 h-[0.5px] bg-[#00000026]" />
        </motion.div>

        <div className="absolute top-12 left-12">
          <motion.div style={{ opacity: fadeOut }} className="flex flex-col gap-1">
            <span className="text-[10px] font-normal tracking-[0.14em] uppercase text-[#50505070]">verde_lugano</span>
            <span className="text-[10px] font-normal tracking-[0.14em] uppercase text-[#50505040]">v.02</span>
          </motion.div>
        </div>

        <div className="absolute top-12 right-12">
          <motion.div style={{ opacity: fadeOut }} className="text-right">
            <span className="text-[10px] font-normal tracking-[0.14em] uppercase text-[#50505070]">Visual Communication Studio</span>
            <div className="mt-1 flex flex-col">
              <span className="text-[10px] font-normal tracking-[0.14em] uppercase text-[#50505040]">SUPSI · MAIND</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-12">
          <motion.div style={{ opacity: fadeOut }} className="flex flex-col gap-1">
            <span className="text-[10px] font-normal tracking-[0.14em] uppercase text-[#50505070]">Studio Professors</span>
            <span className="text-[10px] font-normal tracking-[0.14em] uppercase text-[#50505040]">2025 Edition</span>
          </motion.div>
        </div>

        <motion.div 
          style={{ opacity: scrollIndicatorFade }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <motion.div 
            className="w-[1px] h-10 bg-[#00000033]"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[10px] font-normal tracking-[0.14em] uppercase text-[#50505059] mt-3">
            SCROLL
          </span>
        </motion.div>
      </div>

      <motion.div 
        style={{ 
          opacity: mapOpacity,
          pointerEvents: 'auto'
        }}
        className="fixed inset-0 z-10 bg-white"
      >
        <div className="absolute inset-0 pointer-events-none grayscale opacity-30 contrast-125 brightness-110">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=8.9450%2C45.9980%2C8.9650%2C46.0120&layer=mapnik"
            className="w-full h-full border-0"
            title="Lugano Map"
            scrolling="no"
          />
        </div>

        <div className="absolute top-8 right-12 flex flex-col items-center">
          <span className="text-[10px] text-[#64646447] mb-1">N</span>
          <div className="w-[0.8px] h-7 bg-[#64646447] relative">
            <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[2px] border-r-[2px] border-b-[4px] border-l-transparent border-r-transparent border-b-[#64646447]" />
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
           {[...Array(25)].map((_, i) => (
             <div key={`h-${i}`} className="w-full h-[0.5px] bg-[#6464640F]" style={{ top: `${i * 65}px` }} />
           ))}
           {[...Array(40)].map((_, i) => (
             <div key={`v-${i}`} className="h-full w-[0.5px] bg-[#6464640F]" style={{ left: `${i * 65}px` }} />
           ))}
        </div>

        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <svg className="w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="none">
            <path 
              d="M0,700 Q400,600 900,680 T1440,650 V900 H0 Z" 
              fill="#C3DAF533" 
              stroke="#64A0DC4D" 
              strokeWidth="0.9"
            />
          </svg>
        </div>

        <div className="relative w-[1440px] h-[900px] mx-auto mt-0 origin-top">
          {PARKS.map((park, i) => (
            <AuraBlob key={park.name} park={park} index={i} onClick={() => handleParkClick(park.id)} />
          ))}

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute right-[120px] top-[140px] max-w-[280px]"
          >
            <div className="w-8 h-[0.5px] bg-[#00000033] mb-3" />
            <p className="text-[13px] font-normal italic text-[#0F0F0FCC] leading-[1.75] text-right">
              Five green spaces in Lugano.<br />
              Hundreds of reviews written by<br />
              the people who actually use them.<br />
              And a method for distilling all<br />
              of that language into something<br />
              you can see.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isTransitioning && selectedPark && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ 
                scale: [0.2, 1, 1.02, 1],
                opacity: 1
              }}
              transition={{ 
                duration: 4,
                times: [0, 0.4, 0.7, 1],
                ease: "easeInOut"
              }}
              className="absolute w-[200vw] h-[200vw] rounded-full blur-[100px]"
              style={{
                background: `radial-gradient(circle at center, ${CATEGORIES.experiential}AA, ${CATEGORIES.sensory}AA, ${CATEGORIES.action}AA, ${CATEGORIES.relational}AA)`
              }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="relative z-10 text-center"
            >
              <h2 className="text-[28px] font-light text-black mb-2">{selectedPark.name}</h2>
              <p className="text-[11px] font-normal uppercase tracking-widest text-black/40">
                {selectedParkData?.review_count} REVIEWS · {selectedParkData?.unique_word_count} UNIQUE WORDS
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Word Network Screen */}
      <AnimatePresence>
        {showNetwork && selectedParkId && (
          <div className="fixed inset-0 z-[100] bg-white">
            <WordNetwork 
              parkId={selectedParkId} 
              onBack={() => {
                setShowNetwork(false);
                setSelectedParkId(null);
              }} 
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
