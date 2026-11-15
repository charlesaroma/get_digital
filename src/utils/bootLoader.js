/* Boot loader (#gd-boot in index.html).
   It stays on screen until the app has mounted (markAppReady) and no screen level
   <LogoLoader /> is still waiting for a lazy page (holdBoot / releaseBoot).
   It also stays at least MIN_VISIBLE_MS so it never flashes. */
const MIN_VISIBLE_MS = 700;
const FADE_MS = 450;

let holds = 0;
let ready = false;
let timer;

const node = () => document.getElementById("gd-boot");

export function isBootActive() {
  const el = node();
  return Boolean(el && !el.classList.contains("is-done"));
}

function hide() {
  const el = node();
  if (!el || el.classList.contains("is-done")) return;
  el.classList.add("is-done");
  setTimeout(() => el.remove(), FADE_MS + 50);
}

function schedule() {
  clearTimeout(timer);
  const wait = Math.max(60, MIN_VISIBLE_MS - performance.now());
  timer = setTimeout(() => {
    if (ready && holds === 0) hide();
  }, wait);
}

export function holdBoot() {
  holds += 1;
  clearTimeout(timer);
}

export function releaseBoot() {
  holds = Math.max(0, holds - 1);
  schedule();
}

export function markAppReady() {
  ready = true;
  schedule();
}
