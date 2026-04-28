import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PARK_DATA, ParkData, Word } from '../data';
import * as d3 from 'd3';
import { ArrowLeft, Search, X } from 'lucide-react';

// Re-defining CATEGORIES here to avoid potential circular dependency or import issues during build
const CATEGORIES = {
  experiential: '#C4A8FF',
  sensory: '#40FFB8',
  action: '#52E8FF',
  relational: '#FFE040',
  tension: '#FF7060',
  infrastructure: '#FFB47A'
};

interface WordNetworkProps {
  parkId: string;
  onBack: () => void;
}

export function WordNetwork({ parkId, onBack }: WordNetworkProps) {
  const park = PARK_DATA[parkId];
  const [hoveredWord, setHoveredWord] = useState<Word | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<keyof typeof CATEGORIES | null>(null);
  const [nodes, setNodes] = useState<(Word & { x: number; y: number; id: string })[]>([]);
  
  const width = window.innerWidth;
  const height = window.innerHeight - 150; // Accounting for top/bottom chrome

  // Pre-calculate layout using D3
  useEffect(() => {
    if (!park) return;

    const simulationNodes = park.words.map((w, i) => ({
      ...w,
      id: `${w.word}-${i}`,
      x: width / 2 + (Math.random() - 0.5) * 400,
      y: height / 2 + (Math.random() - 0.5) * 400
    }));

    // Group nodes by category to create "territories"
    const categoryCenters: Record<string, { x: number; y: number }> = {
      experiential: { x: width * 0.3, y: height * 0.5 },
      action: { x: width * 0.7, y: height * 0.3 },
      sensory: { x: width * 0.7, y: height * 0.7 },
      infrastructure: { x: width * 0.2, y: height * 0.2 },
      relational: { x: width * 0.2, y: height * 0.8 },
      tension: { x: width * 0.5, y: height * 0.1 },
    };

    const simulation = d3.forceSimulation(simulationNodes)
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("x", d3.forceX().x(d => categoryCenters[d.category]?.x || width / 2).strength(0.2))
      .force("y", d3.forceY().y(d => categoryCenters[d.category]?.y || height / 2).strength(0.2))
      .force("collision", d3.forceCollide().radius(d => {
        const freq = (d as any).frequency;
        const maxFreq = Math.max(...park.words.map(w => w.frequency));
        const size = 11 + 21 * (Math.log(freq) / Math.log(maxFreq));
        return size * 1.5;
      }))
      .stop();

    for (let i = 0; i < 300; ++i) simulation.tick();

    setNodes(simulationNodes as any);
  }, [parkId, width, height]);

  const maxFrequency = useMemo(() => {
    if (!park) return 1;
    return Math.max(...park.words.map(w => w.frequency));
  }, [park]);

  const getFontSize = (freq: number) => {
    return 11 + 21 * (Math.log(freq) / Math.log(maxFrequency));
  };

  const dominantCategories = useMemo(() => {
    if (!park) return [];
    return Object.entries(park.category_weights)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2);
  }, [park]);

  const personalitySummary = useMemo(() => {
    if (!park || dominantCategories.length === 0) return "";
    const [cat1, weight1] = dominantCategories[0];
    const [cat2, weight2] = dominantCategories[1];

    const adj: Record<string, string> = {
      experiential: "emotional",
      sensory: "sensory",
      action: "a place to move and play",
      relational: "social and relational",
      tension: "with noted concerns",
      infrastructure: "by its facilities"
    };

    if (weight1 > 0.6) return `Strongly ${adj[cat1]} in character`;
    if (Math.abs(weight1 - weight2) < 0.05) return `Equally ${adj[cat1]} and ${adj[cat2]} in character`;
    return `Mostly described as ${adj[cat1]} and ${adj[cat2]}`;
  }, [park, dominantCategories]);

  if (!park) return null;

  return (
    <div className="relative w-full h-full bg-white flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-[72px] border-b-[0.5px] border-black/10 flex items-center justify-between px-12 z-50 bg-white">
        <div className="flex items-center gap-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[14px] font-normal text-black/60 hover:text-black transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            All parks
          </button>
          
          <div className="flex flex-col items-center">
            <h2 className="text-[28px] font-light text-black/85 leading-none mb-1">{park.park_name}</h2>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-normal uppercase tracking-widest text-black/40">
                {park.review_count} REVIEWS · {park.unique_word_count} UNIQUE WORDS
              </span>
              <span className="text-[13px] font-light italic text-black/55">— {personalitySummary}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Aura Thumbnail */}
          <div 
            className="w-12 h-12 rounded-full shadow-sm"
            style={{
              background: `radial-gradient(circle at center, ${CATEGORIES.experiential}CC, ${CATEGORIES.sensory}CC, ${CATEGORIES.action}CC)`
            }}
          />
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20" size={14} />
            <input 
              type="text"
              placeholder="Find a word..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[220px] h-8 bg-black/5 rounded-sm pl-9 pr-8 text-[11px] outline-none focus:ring-[0.5px] focus:ring-black/10 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Network Canvas */}
      <div className="flex-1 relative overflow-hidden">
        {/* Category Zone Blobs (Background) */}
        <div className="absolute inset-0 pointer-events-none">
          {Object.entries(park.category_weights).map(([cat, weight]) => {
            const centerX = width * (cat === 'experiential' ? 0.3 : cat === 'action' ? 0.7 : cat === 'sensory' ? 0.7 : cat === 'infrastructure' ? 0.2 : cat === 'relational' ? 0.2 : 0.5);
            const centerY = height * (cat === 'experiential' ? 0.5 : cat === 'action' ? 0.3 : cat === 'sensory' ? 0.7 : cat === 'infrastructure' ? 0.2 : cat === 'relational' ? 0.8 : 0.1);
            const size = 300 + weight * 600;
            
            const isHoveredCategory = hoveredWord?.category === cat;
            
            return (
              <motion.div
                key={cat}
                className="absolute rounded-full blur-[60px]"
                style={{
                  left: centerX,
                  top: centerY,
                  width: size,
                  height: size,
                  x: '-50%',
                  y: '-50%',
                  backgroundColor: CATEGORIES[cat as keyof typeof CATEGORIES],
                }}
                animate={{
                  opacity: isHoveredCategory ? 0.12 : 0.03,
                }}
                transition={{ duration: 0.3 }}
              />
            );
          })}
        </div>

        {/* Connection Lines (Behind words) */}
        <svg className="absolute inset-0 pointer-events-none z-0">
          {hoveredWord && nodes.find(n => n.word === hoveredWord.word) && (
            nodes.find(n => n.word === hoveredWord.word)!.co_occurring.map((targetWord, idx) => {
              const startNode = nodes.find(n => n.word === hoveredWord.word)!;
              const endNode = nodes.find(n => n.word === targetWord);
              
              if (!endNode) return null;

              const dx = endNode.x - startNode.x;
              const dy = endNode.y - startNode.y;
              const midX = (startNode.x + endNode.x) / 2;
              const midY = (startNode.y + endNode.y) / 2;
              const cpX = midX - dy * 0.15;
              const cpY = midY + dx * 0.15;

              return (
                <motion.path
                  key={`line-${idx}`}
                  d={`M ${startNode.x} ${startNode.y} Q ${cpX} ${cpY} ${endNode.x} ${endNode.y}`}
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="0.8"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              );
            })
          )}
        </svg>

        {/* Words */}
        <div className="relative z-10 w-full h-full">
          {nodes.map((node) => {
            const isHovered = hoveredWord?.word === node.word;
            const isConnected = hoveredWord?.co_occurring.includes(node.word);
            const isSameCategory = hoveredWord?.category === node.category;
            const matchesSearch = searchQuery && node.word.toLowerCase().includes(searchQuery.toLowerCase());
            const hasSearch = searchQuery.length > 0;
            const isFiltered = activeFilter && node.category !== activeFilter;

            let opacity = 1;
            if (hasSearch) opacity = matchesSearch ? 1 : 0.1;
            else if (activeFilter) opacity = isFiltered ? 0.05 : 1;
            else if (hoveredWord) {
              if (isHovered || isConnected || isSameCategory) opacity = 1;
              else opacity = 0.4;
            }

            let color = "#F0F0F0";
            if (isHovered) color = CATEGORIES[node.category];
            else if (isSameCategory) color = `${CATEGORIES[node.category]}D9`;
            else if (isConnected) color = "#000000";
            else if (matchesSearch) color = CATEGORIES[node.category];
            else if (activeFilter && !isFiltered) color = CATEGORIES[node.category];

            return (
              <motion.div
                key={node.id}
                className="absolute cursor-default select-none whitespace-nowrap"
                style={{
                  left: node.x,
                  top: node.y,
                  x: '-50%',
                  y: '-50%',
                  fontSize: getFontSize(node.frequency),
                  fontFamily: 'Helvetica Neue, sans-serif',
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                }}
                animate={{
                  color,
                  opacity,
                  scale: isHovered || matchesSearch ? 1.15 : isConnected ? 1.05 : 1,
                  zIndex: isHovered ? 50 : 10
                }}
                onMouseEnter={() => setHoveredWord(node)}
                onMouseLeave={() => setHoveredWord(null)}
              >
                {node.word}
              </motion.div>
            );
          })}
        </div>

        {/* Empty State Annotation (for Lambertenghi) */}
        {parkId === 'parco-lambertenghi' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="max-w-[280px] text-center space-y-4">
              <p className="text-[13px] font-light italic text-black/50 leading-relaxed">
                Only {park.unique_word_count} words appear more than once in this park's reviews.<br /><br />
                Lambertenghi is small.<br />
                Its review trail is small too.<br /><br />
                Notice what's not here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Tooltip (Bottom Left) */}
      <AnimatePresence>
        {hoveredWord && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed left-12 bottom-20 w-[320px] bg-white/98 border-[0.5px] border-black/10 rounded-md p-4 shadow-lg z-[100] backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORIES[hoveredWord.category] }} />
              <span className="text-[10px] font-normal uppercase tracking-widest text-black/50">{hoveredWord.category}</span>
            </div>
            <h3 className="text-[24px] font-light mb-1" style={{ color: CATEGORIES[hoveredWord.category] }}>{hoveredWord.word}</h3>
            <p className="text-[11px] text-black/50 mb-4">mentioned {hoveredWord.frequency} times</p>
            
            <div className="w-8 h-[0.5px] bg-black/10 my-3" />
            
            <p className="text-[13px] font-light italic text-black/60 leading-relaxed mb-4">
              "{hoveredWord.context_excerpt}"
            </p>
            
            <p className="text-[11px] font-normal text-black/45">
              Connected to: {hoveredWord.co_occurring.join(', ')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend (Bottom Right) */}
      <div className="fixed right-12 bottom-20 flex flex-col gap-3 z-50">
        {Object.entries(CATEGORIES).map(([cat, color]) => {
          const isActive = activeFilter === cat;
          const isDimmed = activeFilter && activeFilter !== cat;
          return (
            <button 
              key={cat}
              onClick={() => setActiveFilter(isActive ? null : cat as any)}
              className="flex items-center gap-3 group transition-all"
            >
              <div 
                className="w-[7px] h-[7px] rounded-full" 
                style={{ backgroundColor: color, opacity: isDimmed ? 0.25 : 0.85 }} 
              />
              <span 
                className={`text-[10px] uppercase tracking-wider transition-all ${
                  isActive ? 'font-medium text-black' : isDimmed ? 'text-black/25' : 'text-black/50'
                }`}
              >
                {cat}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reflection Prompt (Bottom Center) */}
      <div className="h-[60px] flex items-center justify-center border-t-[0.5px] border-black/5">
        <span className="text-[11px] font-light italic text-black/30">
          "What word surprises you?"
        </span>
      </div>
    </div>
  );
}
