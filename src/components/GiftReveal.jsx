import React from "react";
import confetti from "canvas-confetti"; // make sure canvas-confetti is installed

export default function GiftReveal() {
  // Set your Instagram username here
  const instagramUsername = "arham.games";
    
  // Use the official deep-link format for DMs
  // This is the correct way to try and open the Instagram mobile app
  const instagramDmLink = `https://ig.me/m/${instagramUsername}`;

  const handleClick = () => {
    // 1. Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // 2. Redirect to Instagram DM after a short delay
    setTimeout(() => {
      window.open(
        instagramDmLink, 
        "_blank"
      );
    }, 800); // delay so confetti shows before redirect
  };

  return (
    <section className="section flex-col text-center">
      <div className="max-w-3xl p-6 bg-white/80 rounded-2xl shadow-xl">
        <h1 className="text-3xl md:text-5xl font-extrabold">
          Maan gya aap hi vo noob! 🎉
        </h1>
        <p className="mt-4 text-lg">
          Happy Birthday, Divya — you got the best, beautiful, kind heart 💜
        </p>

        <div className="mt-6">
          <button
            onClick={handleClick}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-600 text-white"
          >
            Click for gift 🎁
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          I hope aaj apka din tagda and memorable jaye.
        </div>
      </div>

      <div className="mt-8 text-center">
        <small>
          and ignore the spelling mistakes khud se likha hu sb(not copy paste)
        </small>
      </div>
    </section>
  );
}