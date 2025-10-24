import React from "react";

export default function AudioPlayer({ musicOn, toggleMusic, nextTrack, prevTrack, currentTitle }) {
  return (
    <div
      style={{ position: "fixed", bottom: 16, left: 16, zIndex: 1000 }}
      className="flex items-center gap-3 bg-white/90 p-3 rounded shadow"
    >
      <button onClick={prevTrack} aria-label="Previous" className="px-2 py-1 rounded border">
        Prev
      </button>

      <button onClick={toggleMusic} aria-label={musicOn ? "Pause" : "Play"} className="px-3 py-1 rounded border">
        {musicOn ? "❚❚ Pause" : "▶ Play"}
      </button>

      <button onClick={nextTrack} aria-label="Next" className="px-2 py-1 rounded border">
        Next
      </button>

      <div style={{ marginLeft: 12 }}>
        <div style={{ fontSize: 12, color: "#333" }}>Currently playing</div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{currentTitle}</div>
      </div>
    </div>
  );
}
