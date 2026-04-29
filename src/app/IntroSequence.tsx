import React, { useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { CATEGORIES } from './App';

// Extract real review excerpts from your data for Fold 0
const REVIEW_EXCERPTS = [
  "Beautiful and peaceful",
  "One of the most beautiful parks I have ever seen",
  "Atmosfera rilassante e tranquilla",
  "La vista sul lago è semplicemente impareggiabile",
  "Magical at dusk",
  "Perfect for a Sunday morning run",
  "I bambini adorano l area giochi",
  "Un atmosfera magica durante il tramonto"
];

// Category definitions with glosses
const CATEGORY_INFO = [
  {
    key: 'experiential' as const,
    label: 'Experiential–Emotional',
    gloss: 'How it feels',
    samples: ['beautiful', 'peaceful', 'magical']
  },
  {
    key: 'sensory' as const,
    label: 'Sensory–Environmental',
    gloss: 'What it is like',
    samples: ['quiet', 'green', 'view']
  },
  {
    key: 'action' as const,
    label: 'Action',
    gloss: 'What people do there',
    samples: ['walk', 'relax', 'picnic']
  },
  {
    key: 'relational' as const,
    label: 'Relational Context',
    gloss: 'Who they are with',
    samples: ['children', 'family', 'friends']
  },
  {
    key: 'infrastructure' as const,
    label: 'Infrastructure',
    gloss: 'What is there',
    samples: ['bench', 'playground', 'fountain']
  },
  {
    key: 'tension' as const,
    label: 'Tension / Complaint',
    gloss: 'What is wrong',
    samples: ['crowded', 'dirty', 'neglected'],
    special: true
  }
];

interface IntroSequenceProps {
  totalReviews: number;
}

export function IntroSequence({ totalReviews }: IntroSequenceProps) {
  const { scrollYProgress } = useScroll();
  
  // Fold 0 → Fold 1 (0 to 0.13)
  const fold0Opacity = useTransform(scrollYProgress, [0, 0.05, 0.10, 0.13], [1, 1, 1, 0]);
  const fold0Y = useTransform(scrollYProgress, [0.10, 0.13], [0, -100]);

  // Fold 1 (0.17 to 0.30)
  const fold1Opacity = useTransform(scrollYProgress, [0.14, 0.17, 0.25, 0.30], [0, 1, 1, 0]);
  const fold1Y = useTransform(scrollYProgress, [0.14, 0.17, 0.25, 0.30], [50, 0, 0, -100]);
  
  // Fold 2 (0.30 to 0.50)
  const fold2Opacity = useTransform(scrollYProgress, [0.27, 0.30, 0.45, 0.50], [0, 1, 1, 0]);
  const fold2Y = useTransform(scrollYProgress, [0.27, 0.30, 0.45, 0.50], [50, 0, 0, -100]);
  
  // Fold 3 (0.50 to 0.75)
  const fold3Opacity = useTransform(scrollYProgress, [0.47, 0.50, 0.70, 0.75], [0, 1, 1, 0]);
  const fold3Y = useTransform(scrollYProgress, [0.47, 0.50, 0.70, 0.75], [50, 0, 0, -100]);

  const [showFold0, setShowFold0] = useState(true);
  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    setShowFold0(value < 0.13);
  });

  return (
    <>
      {/* FOLD 0 — Atmospheric Hook */}
      {showFold0 && (
      <motion.div
        style={{ opacity: fold0Opacity, y: fold0Y }}
        className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
      >
        {/* Drifting review excerpts in background */}
        <div className="absolute inset-0 overflow-hidden">
          {REVIEW_EXCERPTS.map((excerpt, i) => (
            <motion.div
              key={i}
              className="absolute text-[14px] font-light italic text-[#0F0F0F] opacity-[0.18]"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                ],
              }}
              transition={{
                duration: 40 + i * 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {excerpt}
            </motion.div>
          ))}
        </div>

        {/* Hook sentence */}
        <div className="relative z-10 text-center px-12 max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-[42px] font-light tracking-[-0.02em] leading-[1.2] text-[#0F0F0F]"
          >
            Every park has a feeling.
            <br />
            What if we could see it?
          </motion.h2>
        </div>

        {/* Scroll cue */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
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

        {/* Project credit corner */}
        <div className="absolute top-8 right-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-right"
          >
            <span className="text-[10px] font-normal tracking-[0.14em] uppercase text-[#50505070]">
              verde_lugano
            </span>
          </motion.div>
        </div>
      </motion.div>
      )}

      {/* FOLD 1 — Title, Subtitle, Positioning */}
      <motion.div 
        style={{ opacity: fold1Opacity, y: fold1Y }}
        className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
      >
        {/* Continue drifting words */}
        <div className="absolute inset-0 overflow-hidden">
          {REVIEW_EXCERPTS.map((excerpt, i) => (
            <motion.div
              key={`fold1-${i}`}
              className="absolute text-[14px] font-light italic text-[#0F0F0F] opacity-[0.18]"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                ],
              }}
              transition={{
                duration: 50 + i * 6,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {excerpt}
            </motion.div>
          ))}
        </div>

        {/* Title and positioning */}
        <div className="relative z-10 text-center px-12 max-w-5xl">
          <h1 className="text-[56px] font-light tracking-[-0.03em] leading-[1.1] text-[#0F0F0F] mb-6">
            Green Auras of Lugano
          </h1>
          
          <p className="text-[16px] font-light leading-[1.6] text-[#0F0F0F] mb-8">
            A reading of Lugano parks through Google reviews
          </p>

          <div className="my-8 w-16 h-[0.5px] bg-[#00000026] mx-auto" />

          <div className="flex flex-col items-center gap-2 text-[11px] font-normal tracking-[0.12em] uppercase text-[#50505070]">
            <span>SUPSI · MAIND</span>
            <span className="text-[10px] text-[#50505050]">Visual Communication Studio · 2025</span>
          </div>
        </div>
      </motion.div>

      {/* FOLD 2 — The Frame */}
      <motion.div 
        style={{ opacity: fold2Opacity, y: fold2Y }}
        className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none px-12"
      >
        <div className="max-w-3xl">
          <div className="space-y-6 text-[15px] font-light leading-[1.75] text-[#0F0F0F]">
            <p>
              Parks are emotional infrastructure. They are where a city breathes — where people go to reset, to play, to be alone or together. But how do you measure that? How do you describe what a park <em>feels</em> like?
            </p>
            
            <p>
              Google reviews are imperfect testimony. They are written by people who chose to write them, in whatever language felt natural, at whatever moment felt right. They are not surveys. They are not data collection. They are closer to diary entries — unprompted, personal, real.
            </p>

            <p>
              This project is an attempt to listen to all of that language at once, and to ask: what patterns emerge? What does the collective voice say about these places?
            </p>

            <div className="mt-10 pt-6 border-t border-[#00000015]">
              <div className="text-[12px] font-normal tracking-[0.1em] uppercase text-[#50505070]">
                Dataset
              </div>
              <div className="mt-2 text-[13px] text-[#0F0F0FCC]">
                <strong>3,460</strong> word occurrences · <strong>124</strong> unique terms · <strong>5</strong> parks
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FOLD 3 — The Six Lenses */}
      <motion.div 
        style={{ opacity: fold3Opacity, y: fold3Y }}
        className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none px-12"
      >
        <div className="max-w-6xl w-full">
          {/* Animated background blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {(Object.values(CATEGORIES) as string[]).map((color, i) => (
              <motion.div
                key={`blob-${i}`}
                className="absolute rounded-full blur-3xl"
                style={{
                  width: 200 + i * 40,
                  height: 200 + i * 40,
                  backgroundColor: color,
                  left: `${10 + (i % 3) * 30}%`,
                  top: `${15 + Math.floor(i / 3) * 50}%`,
                  opacity: 0.12,
                }}
                animate={{
                  scale: [1, 1.15, 1],
                  x: [0, 20 - i * 5, 0],
                  y: [0, 15 - i * 3, 0],
                  opacity: [0.10, 0.18, 0.10],
                }}
                transition={{
                  duration: 6 + i * 1.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>

          {/* SVG connecting lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`h-${i}`}
                x1="5%" y1={`${20 + i * 15}%`} x2="95%" y2={`${20 + i * 15}%`}
                stroke="#0F0F0F" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.06"
              />
            ))}
            {[0, 1, 2, 3].map((i) => (
              <line
                key={`v-${i}`}
                x1={`${20 + i * 20}%`} y1="10%" x2={`${20 + i * 20}%`} y2="90%"
                stroke="#0F0F0F" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.06"
              />
            ))}
          </svg>

          <div className="relative z-10 text-center mb-12">
            <h2 className="text-[32px] font-light tracking-[-0.02em] text-[#0F0F0F] mb-4">
              Six ways of listening
            </h2>
            <p className="text-[14px] font-light italic text-[#0F0F0FCC]">
              Every word in every review is assigned to one of these categories
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-6">
            {CATEGORY_INFO.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.6 }}
                className="relative p-6 rounded-lg bg-white/60 backdrop-blur-sm border border-[#00000012] shadow-sm"
              >
                {/* Color swatch */}
                <motion.div
                  className="w-12 h-12 rounded-full mb-4"
                  style={{ backgroundColor: CATEGORIES[cat.key] }}
                  animate={{
                    boxShadow: [
                      `0 0 16px ${CATEGORIES[cat.key]}40`,
                      `0 0 32px ${CATEGORIES[cat.key]}80`,
                      `0 0 16px ${CATEGORIES[cat.key]}40`,
                    ],
                  }}
                  transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                />

                {/* Category name */}
                <h3 className="text-[13px] font-medium tracking-[0.08em] uppercase text-[#0F0F0F] mb-2">
                  {cat.label}
                </h3>

                {/* Gloss */}
                <p className="text-[14px] font-light italic text-[#0F0F0F99] mb-4">
                  {cat.gloss}
                </p>

                {/* Sample words */}
                <div className="flex flex-wrap gap-2">
                  {cat.samples.map((word) => (
                    <span 
                      key={word}
                      className="text-[11px] font-normal px-2 py-1 rounded-md bg-[#0F0F0F08] text-[#0F0F0F]"
                    >
                      {word}
                    </span>
                  ))}
                </div>

                {/* Special treatment for tension */}
                {cat.special && (
                  <div className="mt-4 pt-4 border-t border-[#00000010]">
                    <p className="text-[11px] font-normal text-[#0F0F0F99]">
                      Only ~1–3% of words across all parks are complaints.
                      <br />
                      <strong className="text-[#0F0F0F]">Read that again.</strong>
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
