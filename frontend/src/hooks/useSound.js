// src/hooks/useSound.js
import { useRef } from 'react';

export function useSound(url, loop = false) {
  const soundRef = useRef(null);

  if (!soundRef.current) {
    soundRef.current = new Audio(url);
    soundRef.current.loop = loop;
  }

  const play = async () => {
    const sound = soundRef.current;
    if (!sound) return;

    try {
      if (sound.paused) {
        sound.currentTime = 0;
        await sound.play();
      }
    } catch (err) {
      console.warn("Audio play error:", err.message);
    }
  };

  const stop = () => {
    const sound = soundRef.current;
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;
  };

  return [play, stop];
}
