import React, { useEffect, useRef, useState } from "react";
import Landing from "./components/Landing";
import MemoryMatch from "./components/MemoryMatch";
import Quiz from "./components/Quiz";
import GiftReveal from "./components/GiftReveal";
import AudioPlayer from "./components/AudioPlayer";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Robust audio manager:
 * - Uses a single persistent Audio element stored on window.__GLOBAL_AUDIO__
 * - Avoids duplicate listeners by tracking a flag
 * - Awaits play() promises to avoid overlapping playback
 */

export default function App() {
  const [page, setPage] = useState("landing");
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef(null);
  const listenersInstalledRef = useRef(false);

  const playlist = [
    { src: "/newjeans.mp3", title: "NewJeans" },
    { src: "/supershy.mp3", title: "SuperShy" },
    { src: "/ditto.mp3", title: "Ditto" },
  ];

  // Create or reuse single Audio instance (survives HMR)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!window.__GLOBAL_AUDIO__) {
      const a = new Audio();
      a.volume = 0.45;
      a.loop = false;
      window.__GLOBAL_AUDIO__ = a;
      window.__GLOBAL_AUDIO__._listenersInstalled = false; // custom flag
    }

    audioRef.current = window.__GLOBAL_AUDIO__;

    // Install listeners only once
    if (!window.__GLOBAL_AUDIO__._listenersInstalled) {
      const audio = audioRef.current;

      const onPlay = () => {
        setIsPlaying(true);
      };
      const onPause = () => {
        setIsPlaying(false);
      };
      const onEnded = () => {
        // go next automatically
        setTrackIndex((i) => (i + 1) % playlist.length);
      };

      audio.addEventListener("play", onPlay);
      audio.addEventListener("pause", onPause);
      audio.addEventListener("ended", onEnded);

      // store cleanup info to window so we don't add again (HMR safe)
      window.__GLOBAL_AUDIO__._listenersInstalled = true;
      window.__GLOBAL_AUDIO__._cleanup = () => {
        try {
          audio.removeEventListener("play", onPlay);
          audio.removeEventListener("pause", onPause);
          audio.removeEventListener("ended", onEnded);
        } catch (e) {}
      };
    }

    // set initial src if not set
    const audio = audioRef.current;
    if (!audio.src) {
      audio.src = playlist[trackIndex].src;
      audio.load();
    }

    // Try autoplay once; if blocked, fallback to user interaction
    const tryAutoplay = async () => {
      try {
        if (audio.paused) {
          await audio.play();
          // play event will update state
        }
      } catch {
        const startOnGesture = async () => {
          try {
            await audio.play();
          } catch {}
          document.removeEventListener("click", startOnGesture);
          document.removeEventListener("keydown", startOnGesture);
        };
        document.addEventListener("click", startOnGesture, { once: true });
        document.addEventListener("keydown", startOnGesture, { once: true });
      }
    };
    tryAutoplay();

    // cleanup on full page unload (not on HMR)
    return () => {
      // don't null out window.__GLOBAL_AUDIO__ because we want persistence during HMR/dev
      // but if this effect is truly unmounting permanently, call cleanup if present
      // (no-op for typical dev hot reload flow)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // When trackIndex changes, change the existing audio.src (no new Audio())
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // remember if it was playing, then pause, swap, and resume if needed
    const wasPlaying = !audio.paused && !audio.ended;

    // Always pause and reset to avoid overlap
    try {
      audio.pause();
    } catch (e) {}
    try {
      audio.currentTime = 0;
    } catch (e) {}

    audio.src = playlist[trackIndex].src;
    audio.load();

    if (wasPlaying) {
      // await play to avoid double play race
      audio.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex]);

  // Toggle play/pause — robust: check current paused state and await play
  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      // audio is playing -> pause it
      try {
        audio.pause();
        // pause event will set isPlaying = false
      } catch (e) {
        setIsPlaying(false);
      }
    } else {
      // audio is paused -> play it (await to avoid race)
      try {
        await audio.play();
        // play event sets isPlaying true
      } catch {
        // If play fails (autoplay blocked), do nothing; UI will update on user gesture
      }
    }
  };

  const nextTrack = () => setTrackIndex((i) => (i + 1) % playlist.length);
  const prevTrack = () => setTrackIndex((i) => (i - 1 + playlist.length) % playlist.length);

  const currentTitle = playlist[trackIndex].title;

  return (
    <div className="min-h-screen">
      <AudioPlayer
        musicOn={isPlaying}
        toggleMusic={toggleMusic}
        nextTrack={nextTrack}
        prevTrack={prevTrack}
        currentTitle={currentTitle}
      />

      <AnimatePresence mode="wait">
        {page === "landing" && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Landing onStart={() => setPage("game")} />
          </motion.div>
        )}

        {page === "game" && (
          <motion.div key="game" initial={{ x: 200, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -200, opacity: 0 }}>
            <MemoryMatch onComplete={() => setPage("quiz")} />
          </motion.div>
        )}

        {page === "quiz" && (
          <motion.div key="quiz" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -100, opacity: 0 }}>
            <Quiz onComplete={() => setPage("gift")} />
          </motion.div>
        )}

        {page === "gift" && (
          <motion.div key="gift" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
            <GiftReveal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
