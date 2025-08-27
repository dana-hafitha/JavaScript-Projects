// assetLoader.js
export const ASSETS = {
  images: {},
  audio: {},
  levels: []
};

// --- helpers ---
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = () => {
      reject(new Error('Failed to load image: ' + img.src));
    };
  });
}

function loadAudio(src) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(src);
    audio.preload = "auto";
    
    // Listens for "canplaythrough" (browser estimates it can play to the end without buffering).
    // Calls resolve(audio) so the Promise resolves with the audio element.
    // { once: true } makes the listener auto-remove after it fires.
    audio.addEventListener("canplaythrough", () => resolve(audio), { once: true });

    // Listens for "error" on the audio element.
    // Calls reject(new Error(Failed to load audio: ${src})) to reject the Promise with a helpful error message.
    // { once: true } also auto-removes this listener.
    audio.addEventListener("error", () => reject(new Error(`Failed to load audio: ${src}`)), { once: true });
  });
}

async function loadManifest(manifest, loader) {
  const entries = Object.entries(manifest);
  const results = await Promise.all(entries.map(async ([k, src]) => {
    const object = await loader(src);
    return [k, object];
  }));
  return Object.fromEntries(results); // { a: <objA>, b: <objB> }
}

async function loadJson(path) {
  const res = await fetch(path);
  try {
    return await res.json();
  } catch (error) {
    console.log(`Failed to load json: ${path}`);
  }
}

// --- main loader ---
export async function loadAllAssets() {
  // Load levels
  ASSETS.levels = await loadJson("json/levels.json");

  // Load audio
  const audioManifest = await loadJson("json/audio.json");
  ASSETS.audio = await loadManifest(audioManifest, loadAudio);

  // If you had images (like backgrounds), load them similarly
  const imageManifest = await loadJson("json/images.json");
  ASSETS.images = await loadManifest(imageManifest, loadImage);

  return ASSETS;
}


// play sound helper
export function playSound(name, { volume = 1, loop = false } = {}) {
  const base = ASSETS.audio[name];
  if (!base) return null;
  const node = base.cloneNode(true);
  node.volume = volume;
  node.loop = loop;
  node.play().catch(() => { });
  return node;
}
