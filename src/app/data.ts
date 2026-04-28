import { CATEGORIES } from "./App";

export interface Word {
  word: string;
  category: keyof typeof CATEGORIES;
  frequency: number;
  context_excerpt: string;
  co_occurring: string[];
}

export interface ParkData {
  id: string;
  park_name: string;
  review_count: number;
  unique_word_count: number;
  category_weights: Record<keyof typeof CATEGORIES, number>;
  words: Word[];
}

export const PARK_DATA: Record<string, ParkData> = {
  'parco-ciani': {
    id: 'parco-ciani',
    park_name: "Parco Ciani",
    review_count: 292,
    unique_word_count: 156,
    category_weights: {
      experiential: 0.461,
      action: 0.204,
      sensory: 0.180,
      infrastructure: 0.097,
      relational: 0.048,
      tension: 0.010
    },
    words: [
      {
        word: "beautiful",
        category: "experiential",
        frequency: 292,
        context_excerpt: "Un posto bellissimo con una vista mozzafiato sul lago.",
        co_occurring: ["peaceful", "relaxing", "magical"]
      },
      {
        word: "relaxing",
        category: "experiential",
        frequency: 87,
        context_excerpt: "Atmosfera rilassante e tranquilla, ideale per una passeggiata.",
        co_occurring: ["beautiful", "peaceful", "quiet"]
      },
      {
        word: "fountain",
        category: "infrastructure",
        frequency: 34,
        context_excerpt: "La fontana all'ingresso è un simbolo della città.",
        co_occurring: ["flowers", "lake", "entrance"]
      },
      {
        word: "running",
        category: "action",
        frequency: 45,
        context_excerpt: "Ottimo posto per correre la mattina presto.",
        co_occurring: ["morning", "path", "exercise"]
      },
      {
        word: "lake",
        category: "sensory",
        frequency: 110,
        context_excerpt: "La vista sul lago è semplicemente impareggiabile.",
        co_occurring: ["view", "mountains", "water"]
      },
      {
        word: "peaceful",
        category: "experiential",
        frequency: 62,
        context_excerpt: "Molto pacifico anche durante il weekend.",
        co_occurring: ["relaxing", "beautiful", "quiet"]
      },
      {
        word: "magical",
        category: "experiential",
        frequency: 28,
        context_excerpt: "Un'atmosfera magica durante il tramonto.",
        co_occurring: ["sunset", "beautiful", "lake"]
      },
      {
        word: "playground",
        category: "infrastructure",
        frequency: 52,
        context_excerpt: "I bambini adorano l'area giochi.",
        co_occurring: ["kids", "fun", "benches"]
      },
      {
        word: "flowers",
        category: "sensory",
        frequency: 78,
        context_excerpt: "I fiori sono curati meticolosamente in ogni stagione.",
        co_occurring: ["colors", "garden", "fountain"]
      },
      {
        word: "social",
        category: "relational",
        frequency: 15,
        context_excerpt: "Un punto di incontro sociale per tutti i luganesi.",
        co_occurring: ["people", "meeting", "friends"]
      }
    ]
  },
  'parco-tassino': {
    id: 'parco-tassino',
    park_name: "Parco Tassino",
    review_count: 120,
    unique_word_count: 85,
    category_weights: {
      experiential: 0.35,
      action: 0.15,
      sensory: 0.30,
      infrastructure: 0.10,
      relational: 0.08,
      tension: 0.02
    },
    words: [
      {
        word: "peaceful",
        category: "experiential",
        frequency: 45,
        context_excerpt: "Molto più tranquillo del Ciani, perfetto per leggere.",
        co_occurring: ["quiet", "reading", "green"]
      },
      {
        word: "view",
        category: "sensory",
        frequency: 60,
        context_excerpt: "La vista dalla torre è spettacolare.",
        co_occurring: ["tower", "city", "lake"]
      },
       {
        word: "green",
        category: "sensory",
        frequency: 38,
        context_excerpt: "Tanto verde e ombra naturale.",
        co_occurring: ["trees", "nature", "peaceful"]
      }
    ]
  },
  'parco-san-michele': {
    id: 'parco-san-michele',
    park_name: "Parco San Michele",
    review_count: 95,
    unique_word_count: 64,
    category_weights: {
      experiential: 0.25,
      action: 0.10,
      sensory: 0.50,
      infrastructure: 0.05,
      relational: 0.05,
      tension: 0.05
    },
    words: [
      {
        word: "view",
        category: "sensory",
        frequency: 85,
        context_excerpt: "La miglior vista di tutta Lugano, senza dubbio.",
        co_occurring: ["stunning", "panorama", "top"]
      },
      {
        word: "climb",
        category: "action",
        frequency: 30,
        context_excerpt: "La salita è faticosa ma ne vale la pena.",
        co_occurring: ["steep", "view", "walking"]
      }
    ]
  },
  'parco-panoramico': {
    id: 'parco-panoramico',
    park_name: "Parco Panoramico Paradiso",
    review_count: 150,
    unique_word_count: 110,
    category_weights: {
      experiential: 0.43,
      sensory: 0.23,
      infrastructure: 0.13,
      action: 0.11,
      relational: 0.09,
      tension: 0.01
    },
    words: [
      {
        word: "panorama",
        category: "sensory",
        frequency: 70,
        context_excerpt: "Un panorama incredibile che abbraccia tutto il golfo.",
        co_occurring: ["view", "lake", "stunning"]
      }
    ]
  },
  'parco-lambertenghi': {
    id: 'parco-lambertenghi',
    park_name: "Parco Lambertenghi",
    review_count: 45,
    unique_word_count: 26,
    category_weights: {
      relational: 0.28,
      experiential: 0.28,
      infrastructure: 0.22,
      action: 0.11,
      sensory: 0.11,
      tension: 0.01
    },
    words: [
      {
        word: "small",
        category: "infrastructure",
        frequency: 20,
        context_excerpt: "Parco molto piccolo, quasi un giardino condominiale.",
        co_occurring: ["hidden", "quiet", "neighborhood"]
      }
    ]
  }
};
