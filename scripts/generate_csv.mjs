import { writeFileSync } from "fs";

const USER_ID = "93241530-2b99-4e2e-8e9e-02db2e4b345a";

const VIDEOS = [
  { videoId: "1_9RzbkETVg", maxEnd: 66 },
  { videoId: "03HomOQeirg", maxEnd: 180 },
  { videoId: "u01pQX7Bsp0", maxEnd: 51 },
  { videoId: "yalgajSyYfU", maxEnd: 159 },
  { videoId: "KwGNDJfSmFk", maxEnd: 34 },
  { videoId: "ZPGi2yBqdqw", maxEnd: 190 },
];

const PLAYBACK_SPEEDS = [];
for (let s = 0.25; s <= 2.0; s += 0.05) {
  PLAYBACK_SPEEDS.push(Math.round(s * 100) / 100);
}

const TITLES_ADJECTIVES = [
  "Cozy",
  "Rainy",
  "Peaceful",
  "Mystic",
  "Warm",
  "Chill",
  "Serene",
  "Dreamy",
  "Quiet",
  "Gentle",
  "Soft",
  "Ambient",
  "Twilight",
  "Golden",
  "Midnight",
  "Stormy",
  "Foggy",
  "Sunlit",
  "Breezy",
  "Mellow",
];
const TITLES_NOUNS = [
  "Fireplace",
  "Café",
  "Forest",
  "Rainfall",
  "Library",
  "Lodge",
  "Cabin",
  "Garden",
  "Beach",
  "Meadow",
  "Study",
  "Rooftop",
  "Balcony",
  "Lakeside",
  "Campfire",
  "Cottage",
  "Dusk",
  "Morning",
  "Evening",
  "Night",
];
const TITLES_EXTRAS = [
  "Vibes",
  "Ambiance",
  "Escape",
  "Retreat",
  "Haven",
  "Mood",
  "Scene",
  "Atmosphere",
  "Soundscape",
  "Lounge",
  "",
];

const DESCRIPTIONS = [
  "A relaxing mix of sounds for focus and calm.",
  "Perfect background ambiance for studying.",
  "Wind down with this soothing combination.",
  "Great for reading or deep work sessions.",
  "Immerse yourself in this ambient soundscape.",
  "Ideal for meditation and relaxation.",
  "A cozy atmosphere to help you unwind.",
  "Background sounds for a productive day.",
  "Let these sounds transport you somewhere peaceful.",
  "Crafted for comfort and concentration.",
  "Layered sounds for a warm evening in.",
  "Turn your space into a serene retreat.",
  "A blend of nature and warmth.",
  "Sit back and let the ambiance take over.",
  "Designed to reduce stress and boost creativity.",
  "This is a description",
  "",
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomId(len = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < len; i++)
    id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomDate(startYear, endYear) {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  const d = new Date(start + Math.random() * (end - start));
  return d.toISOString().replace("T", " ").replace("Z", "+00");
}

function generateVideoData() {
  const shuffled = shuffle(VIDEOS);
  const count = randInt(2, 6); // each entry gets 2-6 videos
  const selected = shuffled.slice(0, count);

  const data = selected.map((v) => {
    const startTime = randInt(0, Math.max(0, v.maxEnd - 10));
    const endTime = randInt(startTime + 5, v.maxEnd);
    const volume = randInt(20, 100);
    const playbackSpeed = randChoice(PLAYBACK_SPEEDS);
    return {
      volume,
      endTime,
      videoId: v.videoId,
      startTime,
      playbackSpeed,
    };
  });
  return data;
}

function generateTitle() {
  const adj = randChoice(TITLES_ADJECTIVES);
  const noun = randChoice(TITLES_NOUNS);
  const extra = randChoice(TITLES_EXTRAS);
  return extra ? `${adj} ${noun} ${extra}` : `${adj} ${noun}`;
}

function escapeCSV(str) {
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

const usedIds = new Set(["I7mUHazhS9WI"]); // existing entry

function uniqueId() {
  let id;
  do {
    id = randomId();
  } while (usedIds.has(id));
  usedIds.add(id);
  return id;
}

const rows = [];

// Keep existing entry
rows.push(null); // placeholder, we'll prepend header + existing row

// Distribution: 35 draft, 5 submitted, 110 published
const statuses = [
  ...Array(35).fill("draft"),
  ...Array(5).fill("submitted"),
  ...Array(110).fill("published"),
];

// Shuffle to mix them up (dates will be random anyway)
const shuffledStatuses = shuffle(statuses);

for (let i = 0; i < 150; i++) {
  const status = shuffledStatuses[i];
  const id = uniqueId();
  const title = generateTitle();
  const description = randChoice(DESCRIPTIONS);

  const videoData = generateVideoData();
  const firstVideoId = videoData[0].videoId;
  const thumbnail = `https://img.youtube.com//vi/${firstVideoId}/mqdefault.jpg`;

  const videoDataJSON = JSON.stringify(videoData);

  // category_id: 0 for drafts, 100-200 for submitted/published
  const category_id = status === "draft" ? 0 : randInt(100, 200);

  // dates: random within past few years (2023-2026)
  const createdAt = randomDate(2023, 2026);
  const updatedAtDate = new Date(
    new Date(createdAt.replace("+00", "Z")).getTime() +
      randInt(0, 30 * 24 * 3600 * 1000),
  );
  const updatedAt = updatedAtDate
    .toISOString()
    .replace("T", " ")
    .replace("Z", "+00");

  // published_at only for published ambiances
  let publishedAt = "";
  if (status === "published") {
    const pubDate = new Date(
      updatedAtDate.getTime() + randInt(0, 7 * 24 * 3600 * 1000),
    );
    publishedAt = pubDate.toISOString().replace("T", " ").replace("Z", "+00");
  }

  // views: varied range for published, 0 for others
  const views = status === "published" ? randInt(0, 15000) : 0;

  // ratings: only for published, and must be consistent
  let ratingSum = 0;
  let ratingCount = 0;
  if (status === "published") {
    ratingCount = randInt(0, 200);
    if (ratingCount > 0) {
      // average rating between 1-5, sum = avg * count
      const avgRating = 1 + Math.random() * 4; // 1.0 to 5.0
      ratingSum = Math.round(avgRating * ratingCount);
    }
  }

  // Build CSV row
  const csvVideoData = escapeCSV(videoDataJSON);
  const row = [
    id,
    USER_ID,
    escapeCSV(title),
    escapeCSV(description),
    status,
    csvVideoData,
    category_id,
    thumbnail,
    createdAt,
    updatedAt,
    publishedAt,
    views,
    ratingSum,
    ratingCount,
  ].join(",");

  rows.push(row);
}

const header =
  "id,user_id,title,description,status,video_data,category_id,thumbnail,created_at,updated_at,published_at,views,rating_sum,rating_count";
const existingRow = `I7mUHazhS9WI,93241530-2b99-4e2e-8e9e-02db2e4b345a,Untitled,This is a description,draft,"[{""volume"": 100, ""endTime"": 66, ""videoId"": ""1_9RzbkETVg"", ""startTime"": 0, ""playbackSpeed"": 1}, {""volume"": 100, ""endTime"": 180, ""videoId"": ""03HomOQeirg"", ""startTime"": 0, ""playbackSpeed"": 1}, {""volume"": 100, ""endTime"": 51, ""videoId"": ""u01pQX7Bsp0"", ""startTime"": 0, ""playbackSpeed"": 1}, {""volume"": 100, ""endTime"": 159, ""videoId"": ""yalgajSyYfU"", ""startTime"": 0, ""playbackSpeed"": 1}, {""volume"": 100, ""endTime"": 34, ""videoId"": ""KwGNDJfSmFk"", ""startTime"": 0, ""playbackSpeed"": 1}, {""volume"": 100, ""endTime"": 190, ""videoId"": ""ZPGi2yBqdqw"", ""startTime"": 0, ""playbackSpeed"": 1}]",0,https://img.youtube.com//vi/1_9RzbkETVg/mqdefault.jpg,2026-04-20 01:30:04.918464+00,2026-04-20 01:30:04.918464+00,,0,0,0`;

// Remove placeholder row and assemble
rows.shift();
const output = [header, existingRow, ...rows].join("\n") + "\n";

writeFileSync("ambiance_rows.csv", output);
console.log(
  `Generated CSV with ${rows.length + 1} data rows (1 existing + ${rows.length} new)`,
);
console.log(`Drafts: 35 new + 1 existing = 36, Submitted: 5, Published: 110`);
