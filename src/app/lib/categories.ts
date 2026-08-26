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
    Instrumental: {},
    Electronic: {},
    Alternative: {},
    "Other Music": {},
  },
  "White Noise": {},
  Nature: {
    Forest: {},
    Meadows: {},
    Rivers: {},
    Coastline: {},
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
    Transit: {},
    Industrial: {},
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
// Top-level categories are spaced by 100s, subcategories are spaced by 10s within each century (e.g. 110, 120, 130...).
// This leaves room to insert new subcategories between existing ones (e.g. 115, 125) without breaking order.
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
    id: 110,
    description: "Comfortable, gentle sounds for unwinding and decompressing.",
    tags: ["tranquil", "serene", "gentle"],
    image: "/images/categories/horror.jpg",
  },
  Upbeat: {
    id: 120,
    description:
      "Lively, energetic sounds that keep momentum and lift your mood.",
    tags: ["energetic", "bright", "motivated"],
    image: "/images/categories/horror.jpg",
  },
  Zen: {
    id: 130,
    description:
      "Intentionally still and focused ambiance for meditation and deep work.",
    tags: ["meditative", "mindful", "contemplative"],
    image: "/images/categories/horror.jpg",
  },
  Melancholic: {
    id: 140,
    description:
      "Bittersweet, reflective sounds that sit comfortably with quiet sadness.",
    tags: ["somber", "wistful", "introspective"],
    image: "/images/categories/horror.jpg",
  },
  Chaotic: {
    id: 150,
    description:
      "A wash of competing sounds pulling in every direction. The kind of noise certain minds need to settle in and work.",
    tags: ["frenetic", "layered", "cacophony"],
    image: "/images/categories/horror.jpg",
  },
  Dark: {
    id: 160,
    description:
      "Weighty, oppressive atmospheres for those drawn to the darker side of sound.",
    tags: ["ominous", "haunting", "foreboding"],
    image: "/images/categories/horror.jpg",
  },
  Liminal: {
    id: 170,
    description:
      "Sounds from places that feel slightly out of time. Empty and familiar, but somehow not quite right.",
    tags: ["adrift", "vacant", "nowhere"],
    image: "/images/categories/horror.jpg",
  },
  "Other Moods": {
    id: 180,
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
    tags: ["cafe", "library", "office", "lounge", "manor"],
    image: "/images/categories/horror.jpg",
  },
  Cafe: {
    id: 210,
    description:
      "The warm clatter of a coffee shop. Espresso machines, soft conversation, and background music.",
    tags: ["espresso", "steam", "morning"],
    image: "/images/categories/horror.jpg",
  },
  Library: {
    id: 220,
    description:
      "The rustle of pages, distant footsteps on hardwood, and the focused hush of a reading room.",
    tags: ["studious", "quiet", "tomes"],
    image: "/images/categories/horror.jpg",
  },
  Office: {
    id: 230,
    description:
      "The sounds of getting work done. Keyboards, computer hum, and the low level background that helps you focus.",
    tags: ["productivity", "focus"],
    image: "/images/categories/horror.jpg",
  },
  Lounge: {
    id: 240,
    description:
      "Dim lighting, cocktails, and the unhurried murmur of sophisticated company.",
    tags: ["mellow", "refined"],
    image: "/images/categories/horror.jpg",
  },
  Tavern: {
    id: 250,
    description:
      "Old drinking halls and inns filled with chatter, clinking glasses, and fireside warmth.",
    tags: ["medieval", "rustic", "lively"],
    image: "/images/categories/horror.jpg",
  },
  Manor: {
    id: 260,
    description:
      "Old castles and manor houses. Crackling fires, ticking clocks, stone corridors, and rain lashed windows.",
    tags: ["solitary", "hushed", "gothic"],
    image: "/images/categories/horror.jpg",
  },
  "Other Rooms": {
    id: 270,
    description:
      "Indoor spaces that aren't quite like the others. Hallways, quiet corners, and personal spaces.",
    tags: ["interior", "secluded", "personal"],
    image: "/images/categories/horror.jpg",
  },

  // Musical (300s)
  Musical: {
    id: 300,
    description:
      "Mellow study beats, live instruments, and synthesized landscapes.",
    tags: ["melodic", "rhythmic", "immersive"],
    image: "/images/categories/horror.jpg",
  },
  "Lo-fi": {
    id: 310,
    description:
      "Beats that stay in the background and let you think. Unhurried and slightly muted, built for long sessions of focused work.",
    tags: ["chill", "mellow", "understated"],
    image: "/images/categories/horror.jpg",
  },
  Jazz: {
    id: 320,
    description:
      "Upright bass, brushed drums, and saxophone. The calm sophistication of a live performance late at night.",
    tags: ["sophisticated", "smooth", "late night"],
    image: "/images/categories/horror.jpg",
  },
  Instrumental: {
    id: 330,
    description:
      "Solo instruments and ensembles. Piano, strings, and music built around the instrument alone.",
    tags: ["piano", "acoustic", "orchestral"],
    image: "/images/categories/horror.jpg",
  },
  Electronic: {
    id: 340,
    description:
      "Synthesizers, pulsing beats, and layered textures. From lo-fi retrofuture to full electronic production.",
    tags: ["synth", "vaporwave", "hypnotic"],
    image: "/images/categories/horror.jpg",
  },
  Alternative: {
    id: 350,
    description:
      "Quiet and textured to raw and loud. Indie, shoegaze, and the harder sounds.",
    tags: ["post-rock", "dream pop", "grunge", "punk"],
    image: "/images/categories/horror.jpg",
  },
  "Other Music": {
    id: 360,
    description:
      "Country, folk, soul, pop, or anything else that didn't get its own category.",
    tags: ["timeless", "traditional", "modern"],
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
    tags: ["forest", "meadows", "rivers", "coastline"],
    image: "/images/categories/horror.jpg",
  },
  Forest: {
    id: 510,
    description:
      "The layered sound of old growth, temperate or tropical. Rustling canopy, distant calls, and the deep quiet within.",
    tags: ["woodland", "jungle", "birdsong"],
    image: "/images/categories/horror.jpg",
  },
  Meadows: {
    id: 520,
    description:
      "Open fields and gentle countryside. Soft wind, animals, insects, and the unhurried pace of open land.",
    tags: ["grassland", "savannah", "countryside"],
    image: "/images/categories/horror.jpg",
  },
  Rivers: {
    id: 530,
    description:
      "The sound of moving freshwater, from gentle murmurs to the roar of a cascade.",
    tags: ["watefalls", "brooks", "marshes"],
    image: "/images/categories/horror.jpg",
  },
  Coastline: {
    id: 540,
    description:
      "Waves breaking on rock and sand, salt air, and the call of seagulls. From a quiet cove to the open sea.",
    tags: ["waves", "shore", "beach"],
    image: "/images/categories/horror.jpg",
  },
  Wilderness: {
    id: 550,
    description:
      "Remote, extreme environments far from the familiar. Vast, sparse, and indifferent.",
    tags: ["desert", "mountains", "tundra", "caves"],
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
    id: 610,
    description:
      "A soft patter on glass, a steady rainfall, or the full weight of a thunderstorm.",
    tags: ["drizzle", "storm", "thunder"],
    image: "/images/categories/horror.jpg",
  },
  Wind: {
    id: 620,
    description:
      "Air in motion. From a gentle rustle through leaves to a howling gale.",
    tags: ["gust", "breeze", "howling"],
    image: "/images/categories/horror.jpg",
  },
  Snow: {
    id: 630,
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
    id: 710,
    description:
      "Fresh breezes, returning birdsong, and soft rain after a long winter.",
    tags: ["renewal", "awakening"],
    image: "/images/categories/horror.jpg",
  },
  Summer: {
    id: 720,
    description:
      "Hot afternoons, insects at dusk, and evenings that don't want to end.",
    tags: ["sunny", "porch", "cicadas"],
    image: "/images/categories/horror.jpg",
  },
  Autumn: {
    id: 730,
    description:
      "Crisp air, falling leaves, and wood smoke in a forest turning amber and crimson.",
    tags: ["leaves", "harvest", "bonfire"],
    image: "/images/categories/horror.jpg",
  },
  Winter: {
    id: 740,
    description:
      "Frozen landscapes and the deep quiet of snow. Cold air, bare trees, and long nights.",
    tags: ["cold", "snowfall", "stillness"],
    image: "/images/categories/horror.jpg",
  },
  Halloween: {
    id: 750,
    description:
      "Creaking doors, distant howls, jack-o-lanterns. The unsettling edge of the year's darkest night.",
    tags: ["spooky", "haunted", "macabre"],
    image: "/images/categories/horror.jpg",
  },
  Christmas: {
    id: 760,
    description:
      "Crackling fires, bells, and carols in the air. December at its most familiar.",
    tags: ["festive", "carols", "yuletide"],
    image: "/images/categories/horror.jpg",
  },
  "Other Holidays": {
    id: 770,
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
    id: 810,
    description:
      "The full intensity of city life. Sirens, street vendors, bus engines, and the constant motion of people.",
    tags: ["traffic", "crowds", "downtown"],
    image: "/images/categories/horror.jpg",
  },
  Suburbia: {
    id: 820,
    description:
      "The unhurried sounds of residential life. Lawn mowers, dogs barking, distant voices, and occasional traffic.",
    tags: ["neighborhood", "residential", "quiet"],
    image: "/images/categories/horror.jpg",
  },
  Transit: {
    id: 830,
    description:
      "The sounds of moving through the world. Rumbling carriages, echoing platforms, and the rhythm of a commute.",
    tags: ["train", "bus", "commute"],
    image: "/images/categories/horror.jpg",
  },
  Industrial: {
    id: 840,
    description:
      "The rhythmic noise of large-scale production. Metalwork, steam, equipment, and the hum of infrastructure.",
    tags: ["machinery", "factory"],
    image: "/images/categories/horror.jpg",
  },

  // World (900)
  World: {
    id: 900,
    description:
      "Ambiance only heard in one particular corner of the globe. Sounds tied to specific cultures, regions, or historical periods.",
    tags: ["cultural", "regional"],
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
    tags: ["unique", "unconventional"],
    image: "/images/categories/horror.jpg",
  },
};

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/ /g, "-");
}

function findCategoryPath(
  name: string,
  tree: Record<string, any>,
  prefix: string,
): string | undefined {
  for (const key of Object.keys(tree)) {
    const path = `${prefix}/${nameToSlug(key)}`;
    if (key === name) return path;
    const subtree = tree[key];
    if (subtree && Object.keys(subtree).length > 0) {
      const found = findCategoryPath(name, subtree, path);
      if (found) return found;
    }
  }
  return undefined;
}

function getCategoryHref(name: string): string {
  return (
    findCategoryPath(name, categories, "/categories") ??
    `/categories/${nameToSlug(name)}`
  );
}

export const categoryById: Record<number, { name: string; href: string }> =
  Object.fromEntries(
    Object.entries(categoryMeta).map(([name, meta]) => [
      meta.id,
      { name, href: getCategoryHref(name) },
    ]),
  );
