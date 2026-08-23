export const categories: Record<string, any> = {
  Moods: {
    Relaxing: {},
    Upbeat: {},
    Zen: {},
    Melancholic: {},
    Chaotic: {},
    Dark: {},
    Liminal: {},
    "Other Moods": {},
  },
  Rooms: {
    Cafe: {},
    Library: {},
    Office: {},
    Lounge: {},
    Tavern: {},
    Manor: {},
    "Other Rooms": {},
  },
  Musical: {
    "Lo-fi": {},
    Jazz: {},
    Electronic: {},
    Instrumental: {},
    Alternative: {},
    "Other Music": {},
  },
  "White Noise": {},
  Nature: {
    Forest: {},
    Rivers: {},
    Ocean: {},
    Meadow: {},
    Night: {},
    Wilderness: {},
  },
  Weather: {
    Rain: {},
    Wind: {},
    Snow: {},
  },
  Seasonal: {
    Spring: {},
    Summer: {},
    Autumn: {},
    Winter: {},
    Halloween: {},
    Christmas: {},
    "Other Holidays": {},
  },
  Urban: {
    "City Streets": {},
    Suburbia: {},
    Industrial: {},
    Transit: {},
  },
  World: {},
  Activities: {},
  Ethereal: {},
  Surreal: {},
  Experimental: {},
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
  // Moods (100s)
  Moods: {
    id: 100,
    description:
      "Ambiances that span every mood, from meditative stillness to productive chaos.",
    tags: ["relaxing", "upbeat", "melancholic", "chaotic"],
    image: "/images/categories/horror.jpg",
  },
  Relaxing: {
    id: 101,
    description: "Comfortable, gentle sounds for unwinding and decompressing.",
    tags: ["tranquil", "serene", "gentle"],
    image: "/images/categories/horror.jpg",
  },
  Upbeat: {
    id: 102,
    description:
      "Lively, energetic sounds that keep momentum and lift your mood.",
    tags: ["energetic", "bright", "motivated"],
    image: "/images/categories/horror.jpg",
  },
  Zen: {
    id: 103,
    description:
      "Intentionally still and focused ambiance for meditation and deep work.",
    tags: ["meditative", "mindful", "contemplative"],
    image: "/images/categories/horror.jpg",
  },
  Melancholic: {
    id: 104,
    description:
      "Bittersweet, reflective sounds that sit comfortably with quiet sadness.",
    tags: ["somber", "wistful", "introspective"],
    image: "/images/categories/horror.jpg",
  },
  Chaotic: {
    id: 105,
    description:
      "A wash of competing sounds pulling in every direction. The kind of noise certain minds need to settle in and work.",
    tags: ["frenetic", "layered", "cacophony"],
    image: "/images/categories/horror.jpg",
  },
  Dark: {
    id: 106,
    description:
      "Weighty, oppressive atmospheres for those drawn to the darker side of sound.",
    tags: ["ominous", "haunting", "foreboding"],
    image: "/images/categories/horror.jpg",
  },
  Liminal: {
    id: 107,
    description:
      "Sounds from places that feel slightly out of time. Empty and familiar, but somehow not quite right.",
    tags: ["adrift", "vacant", "nowhere"],
    image: "/images/categories/horror.jpg",
  },
  "Other Moods": {
    id: 108,
    description:
      "Moods without a named category. Feelings that sit between the others, or outside them entirely.",
    tags: ["nostalgic", "emotional", "yearning"],
    image: "/images/categories/horror.jpg",
  },

  // Rooms (200s)
  Rooms: {
    id: 200,
    description:
      "Indoor settings ranging from cozy reading nooks to functional workspaces.",
    tags: ["library", "cafe", "tavern", "lounge", "manor"],
    image: "/images/categories/horror.jpg",
  },
  Cafe: {
    id: 201,
    description:
      "The warm clatter of a coffee shop. Espresso machines, soft conversation, and background music.",
    tags: ["espresso", "morning", "chatter"],
    image: "/images/categories/horror.jpg",
  },
  Library: {
    id: 202,
    description:
      "The rustle of pages, distant footsteps on hardwood, and the focused hush of a reading room.",
    tags: ["studious", "quiet", "literary"],
    image: "/images/categories/horror.jpg",
  },
  Office: {
    id: 203,
    description:
      "The sounds of getting work done. Keyboards, computer hum, and the low-level background that helps you focus.",
    tags: ["productivity", "focus"],
    image: "/images/categories/horror.jpg",
  },
  Lounge: {
    id: 204,
    description:
      "Dim lighting, cocktails, and the unhurried murmur of sophisticated company.",
    tags: ["mellow", "refined"],
    image: "/images/categories/horror.jpg",
  },
  Tavern: {
    id: 205,
    description:
      "Old drinking halls and inns filled with chatter, clinking glasses, and fireside warmth.",
    tags: ["medieval", "rustic", "lively"],
    image: "/images/categories/horror.jpg",
  },
  Manor: {
    id: 206,
    description:
      "Old castles and manor houses. Crackling fires, ticking clocks, stone corridors, and rain-lashed windows.",
    tags: ["solitary", "hushed", "gothic"],
    image: "/images/categories/horror.jpg",
  },
  "Other Rooms": {
    id: 207,
    description:
      "Indoor spaces that aren't quite like the others. Hallways, quiet corners, and personal spaces.",
    tags: ["interior", "secluded", "personal"],
    image: "/images/categories/horror.jpg",
  },

  // Musical (300s)
  Musical: {
    id: 300,
    description:
      "Ambiances where music takes center stage. Mellow study beats, live instruments, and synthesized landscapes.",
    tags: ["melodic", "rhythmic", "immersive"],
    image: "/images/categories/horror.jpg",
  },
  "Lo-fi": {
    id: 301,
    description:
      "Beats that stay in the background and let you think. Unhurried and slightly muted, built for long sessions of focused work.",
    tags: ["chill", "mellow", "understated"],
    image: "/images/categories/horror.jpg",
  },
  Jazz: {
    id: 302,
    description:
      "Upright bass, brushed drums, and saxophone. The calm sophistication of a live performance late at night.",
    tags: ["sophisticated", "smooth", "late night"],
    image: "/images/categories/horror.jpg",
  },
  Electronic: {
    id: 303,
    description:
      "Synthesizers, pulsing beats, and layered textures. From lo-fi retrofuture to full electronic production.",
    tags: ["synth", "vaporwave", "hypnotic"],
    image: "/images/categories/horror.jpg",
  },
  Instrumental: {
    id: 304,
    description:
      "Solo instruments and ensembles. Piano, strings, and music built around the instrument alone.",
    tags: ["piano", "acoustic", "orchestral"],
    image: "/images/categories/horror.jpg",
  },
  Alternative: {
    id: 305,
    description:
      "Indie, alt-rock, and the harder sounds on the edges. Guitar driven music with attitude to match.",
    tags: ["indie", "alt-rock", "metal"],
    image: "/images/categories/horror.jpg",
  },
  "Other Music": {
    id: 306,
    description:
      "The genres that don't fit anywhere else. Soul, country, folk, pop, and beyond.",
    tags: ["country", "soul", "folk", "pop"],
    image: "/images/categories/horror.jpg",
  },

  // White Noise (400)
  "White Noise": {
    id: 400,
    description:
      "Pure, consistent tones designed for focus, sleep, and tuning out the world.",
    tags: ["hums", "tones"],
    image: "/images/categories/horror.jpg",
  },

  // Nature (500s)
  Nature: {
    id: 500,
    description:
      "Wildlife, water, and open land. The sounds of the natural world at its most uninterrupted.",
    tags: ["forest", "meadows", "rivers", "ocean"],
    image: "/images/categories/horror.jpg",
  },
  Forest: {
    id: 501,
    description:
      "The layered sound of old growth. Rustling canopy, distant calls, creaking bark, and the deep quiet within.",
    tags: ["woodland", "birdsong", "trees"],
    image: "/images/categories/horror.jpg",
  },
  Meadows: {
    id: 502,
    description:
      "Open fields and gentle countryside. Soft wind, animals, insects, and the unhurried pace of open land.",
    tags: ["grassland", "countryside", "savannah"],
    image: "/images/categories/horror.jpg",
  },
  Rivers: {
    id: 503,
    description:
      "The sound of moving freshwater, from gentle murmurs to the roar of a cascade.",
    tags: ["stream", "waterfall", "brook"],
    image: "/images/categories/horror.jpg",
  },
  Ocean: {
    id: 504,
    description:
      "Rolling surf, distant gulls, salt air, and the vast expanse of the open sea.",
    tags: ["waves", "coastal", "sea breeze"],
    image: "/images/categories/horror.jpg",
  },
  Night: {
    id: 505,
    description:
      "The world after sundown. The hum of insects, distant calls, and the cooling quiet of the small hours.",
    tags: ["nocturnal", "crickets", "owls"],
    image: "/images/categories/horror.jpg",
  },
  Wilderness: {
    id: 506,
    description:
      "Remote, extreme environments far from the familiar. Vast, sparse, and indifferent.",
    tags: ["desert", "mountains", "tundra"],
    image: "/images/categories/horror.jpg",
  },

  // Weather (600s)
  Weather: {
    id: 600,
    description:
      "Rain, wind, and snow. From a light drizzle to a full winter storm.",
    tags: ["rain", "wind", "snow"],
    image: "/images/categories/horror.jpg",
  },
  Rain: {
    id: 601,
    description:
      "A soft patter on glass, a steady rainfall, or the full weight of a thunderstorm.",
    tags: ["drizzle", "storm", "thunder"],
    image: "/images/categories/horror.jpg",
  },
  Wind: {
    id: 602,
    description:
      "Air in motion. From a gentle rustle through leaves to a howling gale.",
    tags: ["gust", "breeze", "howling"],
    image: "/images/categories/horror.jpg",
  },
  Snow: {
    id: 603,
    description:
      "The world under snowfall. Muffled sounds, crunching underfoot, and a rare, deep silence.",
    tags: ["blizzard", "winter", "frost"],
    image: "/images/categories/horror.jpg",
  },

  // Seasonal (700s)
  Seasonal: {
    id: 700,
    description: "The sounds of each season and the holidays that shape them.",
    tags: ["spring", "autumn", "halloween", "christmas"],
    image: "/images/categories/horror.jpg",
  },
  Spring: {
    id: 701,
    description:
      "Fresh breezes, returning birdsong, soft rain, and the gentle thaw of the world waking up.",
    tags: ["renewal", "awakening"],
    image: "/images/categories/horror.jpg",
  },
  Summer: {
    id: 702,
    description:
      "Sun-soaked days, distant surf, and the long golden light of evenings that don't want to end.",
    tags: ["sunny", "cookout", "cicadas"],
    image: "/images/categories/horror.jpg",
  },
  Autumn: {
    id: 703,
    description:
      "Crisp air, falling leaves, and wood smoke in a forest gone gold and red.",
    tags: ["leaves", "harvest", "bonfire"],
    image: "/images/categories/horror.jpg",
  },
  Winter: {
    id: 704,
    description:
      "Frozen landscapes and the deep quiet of snow. Cold air, bare trees, and long nights.",
    tags: ["cold", "snowfall", "stillness"],
    image: "/images/categories/horror.jpg",
  },
  Halloween: {
    id: 705,
    description:
      "Creaking doors, distant howls, jack-o-lanterns, and the unsettling edge of the year's darkest night.",
    tags: ["spooky", "haunted", "macabre"],
    image: "/images/categories/horror.jpg",
  },
  Christmas: {
    id: 706,
    description:
      "Crackling fires, bells, and carols in the air. December at its most familiar.",
    tags: ["festive", "carols", "winter warmth"],
    image: "/images/categories/horror.jpg",
  },
  "Other Holidays": {
    id: 707,
    description:
      "Harvest festivals, midsummer celebrations, and all the seasonal holidays that don't have their own category.",
    tags: ["fireworks", "festivals", "celebration"],
    image: "/images/categories/horror.jpg",
  },

  // Urban (800s)
  Urban: {
    id: 800,
    description:
      "Civilization in motion. Crowded streets, quiet corners, and the hum of infrastructure.",
    tags: ["city", "suburbia", "transit", "industrial"],
    image: "/images/categories/horror.jpg",
  },
  "City Streets": {
    id: 801,
    description:
      "The full intensity of city life. Sirens, street vendors, bus engines, and the constant motion of people.",
    tags: ["traffic", "crowds", "downtown"],
    image: "/images/categories/horror.jpg",
  },
  Suburbia: {
    id: 802,
    description:
      "The unhurried sounds of residential life. Lawn mowers, dogs barking, distant voices, and occasional traffic.",
    tags: ["neighborhood", "residential", "quiet"],
    image: "/images/categories/horror.jpg",
  },
  Industrial: {
    id: 803,
    description:
      "The rhythmic noise of large-scale production. Metalwork, steam, equipment, and the hum of infrastructure.",
    tags: ["machinery", "factory"],
    image: "/images/categories/horror.jpg",
  },
  Transit: {
    id: 804,
    description:
      "The sounds of moving through the world. Rumbling carriages, echoing platforms, and the rhythm of a commute.",
    tags: ["train", "bus", "commute"],
    image: "/images/categories/horror.jpg",
  },

  // World (900)
  World: {
    id: 900,
    description:
      "Sounds tied to specific cultures, regions, and historical periods. Ambiance that could only come from one particular corner of the globe.",
    tags: ["cultural", "historical"],
    image: "/images/categories/horror.jpg",
  },

  // Activities (1000)
  Activities: {
    id: 1000,
    description:
      "Ambiances defined by what you're doing. From the gym to the kitchen, the workshop to the study.",
    tags: ["sports", "gym", "cooking", "crafts"],
    image: "/images/categories/horror.jpg",
  },

  // Ethereal (1100)
  Ethereal: {
    id: 1100,
    description:
      "Temple bells, abbey choirs, and a lingering  carrying a sense of the sacred and transcendent.",
    tags: ["mystical", "transcendent", "spiritual"],
    image: "/images/categories/horror.jpg",
  },

  // Surreal (1200)
  Surreal: {
    id: 1200,
    description:
      "Sounds that exist outside ordinary experience. Vast, weightless, and impossible to place.",
    tags: ["abstract", "otherworldly", "cosmic", "underwater"],
    image: "/images/categories/horror.jpg",
  },

  // Experimental (1300)
  Experimental: {
    id: 1300,
    description:
      "Ambiances that don't fit anywhere else. Some are unconventional by design, others simply resist categorization.",
    tags: ["unconventional", "unique"],
    image: "/images/categories/horror.jpg",
  },
};
