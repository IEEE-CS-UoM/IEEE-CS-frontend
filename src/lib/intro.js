// Coordination gate between the HeroIntro preloader and the Hero title reveal.
// HeroIntro calls releaseIntro() the moment the particle word starts to spread;
// Hero waits on onIntroRelease() before playing its entrance timeline so the
// title is revealed in sync with the dispersing particles.

export const INTRO_EVENT = 'hero-intro-release';

let released = false;

export const isIntroReleased = () => released;

export const releaseIntro = () => {
  if (released) return;
  released = true;
  window.dispatchEvent(new Event(INTRO_EVENT));
};

// Runs cb once the intro has released (immediately if it already has).
// Returns an unsubscribe function.
export const onIntroRelease = (cb) => {
  if (released) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(INTRO_EVENT, handler, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, handler);
};
