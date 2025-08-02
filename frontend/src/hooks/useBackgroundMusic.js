import { useEffect, useRef } from 'react';

// Store audio elements to prevent re-creating them
const audioCache = {};

// Add `volume` param (default to 0.2)
export const useBackgroundMusic = (soundUrl, loop = true, volume = 0.8) => {
  const audioRef = useRef(null);

  useEffect(() => {
    // If the audio for this URL isn't created yet, create and cache it
    if (!audioCache[soundUrl]) {
      const audio = new Audio(soundUrl);
      audio.loop = loop;
      audio.volume = volume; // Set volume here
      audioCache[soundUrl] = audio;
    }

    // Use the cached audio element
    const audio = audioCache[soundUrl];
    audioRef.current = audio;

    // Try to play the music
    audio.play().catch(e => console.warn("Audio could not play automatically:", e));

    // Pause on unmount
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [soundUrl, loop, volume]);
};
