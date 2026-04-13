export const categories: Record<string, any> = {
  Seasonal: {
    Spring: {
      Birds: {},
      "Light Rain": {},
    },
    Summer: {
      Waves: {},
      Cicadas: {},
    },
    Autumn: {
      "Rustling Leaves": {},
      Halloween: {
        Eerie: {},
        Frightening: {},
      },
    },
    Winter: {
      Snowstorm: {},
      Cabin: {},
    },
  },
  Moods: {
    Relaxing: {},
    Energetic: {},
    Melancholic: {},
  },
  Locations: {
    Forest: {
      Rainforest: {},
      "Pine Woods": {},
    },
    Beach: {},
    Mountain: {},
  },
  "Time of Day": {
    Morning: {},
    Afternoon: {},
    Night: {},
  },
  Activities: {
    Reading: {},
    Cooking: {},
  },
  Nature: {
    Rain: {},
    Wind: {},
    Fire: {},
  },
  Abstract: {},
};

export type CategoryMeta = {
  id: number;
  description: string;
  tags: string[];
  image: string;
};

// IDs are permanent — never reuse or change an ID.
// Top-level categories are spaced by 100s, subcategories increment within.
export const categoryMeta: Record<string, CategoryMeta> = {
  // Seasonal (100s)
  Seasonal: {
    id: 100,
    description: "Ambiances inspired by the changing seasons.",
    tags: ["spring", "summer", "autumn", "winter"],
    image: "/images/categories/seasonal.jpg",
  },
  Spring: {
    id: 101,
    description: "Fresh breezes and birdsong.",
    tags: ["birds", "rain", "bloom"],
    image: "/images/categories/spring.jpg",
  },
  Summer: {
    id: 102,
    description: "Sun-soaked days and warm nights.",
    tags: ["waves", "cicadas", "heat"],
    image: "/images/categories/summer.jpg",
  },
  Autumn: {
    id: 103,
    description: "Crisp air and falling leaves.",
    tags: ["leaves", "harvest", "cozy"],
    image: "/images/categories/autumn.jpg",
  },
  Winter: {
    id: 104,
    description: "Snow-covered stillness and cold winds.",
    tags: ["snow", "cabin", "frost"],
    image: "/images/categories/winter.jpg",
  },
  Birds: {
    id: 105,
    description: "Morning chorus and woodland calls.",
    tags: ["songbird", "dawn", "chirping"],
    image: "/images/categories/birds.jpg",
  },
  "Light Rain": {
    id: 106,
    description: "A gentle drizzle on the windowpane.",
    tags: ["drizzle", "calm", "patter"],
    image: "/images/categories/light-rain.jpg",
  },
  Waves: {
    id: 107,
    description: "Rolling ocean waves on the shore.",
    tags: ["ocean", "surf", "tide"],
    image: "/images/categories/waves.jpg",
  },
  Cicadas: {
    id: 108,
    description: "The buzzing hum of a hot summer evening.",
    tags: ["insects", "dusk", "warmth"],
    image: "/images/categories/cicadas.jpg",
  },
  "Rustling Leaves": {
    id: 109,
    description: "Wind through dry autumn foliage.",
    tags: ["wind", "crunch", "trees"],
    image: "/images/categories/rustling-leaves.jpg",
  },
  Halloween: {
    id: 110,
    description: "Spooky and atmospheric autumn nights.",
    tags: ["spooky", "eerie", "frightening"],
    image: "/images/categories/halloween.jpg",
  },
  Eerie: {
    id: 111,
    description: "Unsettling quiet and creeping dread.",
    tags: ["creepy", "suspense", "haunted"],
    image: "/images/categories/eerie.jpg",
  },
  Frightening: {
    id: 112,
    description: "Heart-pounding scares and sudden shocks.",
    tags: ["horror", "jump scare", "terror"],
    image: "/images/categories/frightening.jpg",
  },
  Snowstorm: {
    id: 113,
    description: "Howling wind and heavy snowfall.",
    tags: ["blizzard", "wind", "cold"],
    image: "/images/categories/snowstorm.jpg",
  },
  Cabin: {
    id: 114,
    description: "Warm and sheltered from the elements.",
    tags: ["fireplace", "wood", "cozy"],
    image: "/images/categories/cabin.jpg",
  },

  // Moods (200s)
  Moods: {
    id: 200,
    description: "Ambiances matched to how you feel.",
    tags: ["relaxing", "energetic", "melancholic"],
    image: "/images/categories/moods.jpg",
  },
  Relaxing: {
    id: 201,
    description: "Calm sounds to unwind and de-stress.",
    tags: ["calm", "peaceful", "serene"],
    image: "/images/categories/relaxing.jpg",
  },
  Energetic: {
    id: 202,
    description: "Upbeat rhythms and lively atmospheres.",
    tags: ["upbeat", "lively", "active"],
    image: "/images/categories/energetic.jpg",
  },
  Melancholic: {
    id: 203,
    description: "Bittersweet tones and reflective moods.",
    tags: ["sad", "reflective", "somber"],
    image: "/images/categories/melancholic.jpg",
  },

  // Locations (300s)
  Locations: {
    id: 300,
    description: "Soundscapes from places around the world.",
    tags: ["forest", "beach", "mountain"],
    image: "/images/categories/locations.jpg",
  },
  Forest: {
    id: 301,
    description: "Deep woods alive with natural sounds.",
    tags: ["trees", "wildlife", "shade"],
    image: "/images/categories/forest.jpg",
  },
  Rainforest: {
    id: 302,
    description: "Dense tropical canopy teeming with life.",
    tags: ["tropical", "humid", "exotic"],
    image: "/images/categories/rainforest.jpg",
  },
  "Pine Woods": {
    id: 303,
    description: "Quiet trails through evergreen trees.",
    tags: ["pine", "evergreen", "trail"],
    image: "/images/categories/pine-woods.jpg",
  },
  Beach: {
    id: 304,
    description: "Sand, surf, and salty air.",
    tags: ["ocean", "sand", "sun"],
    image: "/images/categories/beach.jpg",
  },
  Mountain: {
    id: 305,
    description: "High-altitude winds and vast open spaces.",
    tags: ["altitude", "wind", "peaks"],
    image: "/images/categories/mountain.jpg",
  },

  // Time of Day (400s)
  "Time of Day": {
    id: 400,
    description: "Set the mood for any hour.",
    tags: ["morning", "afternoon", "night"],
    image: "/images/categories/time-of-day.jpg",
  },
  Morning: {
    id: 401,
    description: "Sunrise warmth and a fresh start.",
    tags: ["dawn", "birds", "coffee"],
    image: "/images/categories/morning.jpg",
  },
  Afternoon: {
    id: 402,
    description: "Midday bustle and golden light.",
    tags: ["sun", "busy", "warm"],
    image: "/images/categories/afternoon.jpg",
  },
  Night: {
    id: 403,
    description: "Darkness, crickets, and quiet streets.",
    tags: ["dark", "crickets", "stars"],
    image: "/images/categories/night.jpg",
  },

  // Activities (500s)
  Activities: {
    id: 500,
    description: "Background sounds for what you're doing.",
    tags: ["reading", "cooking", "working"],
    image: "/images/categories/activities.jpg",
  },
  Reading: {
    id: 501,
    description: "Gentle ambiance for focused reading.",
    tags: ["quiet", "pages", "calm"],
    image: "/images/categories/reading.jpg",
  },
  Cooking: {
    id: 502,
    description: "Kitchen sounds and cozy preparation.",
    tags: ["sizzle", "kitchen", "warmth"],
    image: "/images/categories/cooking.jpg",
  },

  // Nature (600s)
  Nature: {
    id: 600,
    description: "Pure elemental sounds from the natural world.",
    tags: ["rain", "wind", "fire"],
    image: "/images/categories/nature.jpg",
  },
  Rain: {
    id: 601,
    description: "Steady rainfall in all its forms.",
    tags: ["downpour", "drizzle", "storm"],
    image: "/images/categories/rain.jpg",
  },
  Wind: {
    id: 602,
    description: "Gusts and breezes through open spaces.",
    tags: ["gust", "breeze", "howling"],
    image: "/images/categories/wind.jpg",
  },
  Fire: {
    id: 603,
    description: "Crackling flames and glowing embers.",
    tags: ["crackling", "campfire", "warmth"],
    image: "/images/categories/fire.jpg",
  },

  // Abstract (700s)
  Abstract: {
    id: 700,
    description: "Unconventional and experimental soundscapes.",
    tags: ["ambient", "experimental", "unique"],
    image: "/images/categories/abstract.jpg",
  },
};
