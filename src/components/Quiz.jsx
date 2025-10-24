import React, { useState } from "react";

const QUESTIONS = [
  {
    q: "Who is Divya di's favorite Valorant agent?",
    choices: ["Clove", "Jett", "Sova","Astra"],
    answer: [0], // multiple answers allowed
  },
  {
    q: "Divya di ka sbse pyara bacha kon hai?",
    choices: ["Shivean", "Rahul(Meow)", "Arham"],
    answer: [0, 1],
  },
  {
    q: "Movie dhekte-dhekte kon sojata hai?",
    choices: ["Shivean", "Rahul", "You","Arham"],
    answer: [2], // multiple correct answers allowed
  },
  {
    q: "Sbse badiya games kon khelta hai hamare group mei?",
    choices: ["Arham", "Arham", "Arham","Arham", "Arham", "Arham"],
    answer: [0,1,2,3,4,5],
  },
    {
    q: "What is Divya's in-game name?",
    choices: ["Witch", "Yeji is goat", "Aaloo ka paratha","Gipsy Danger"],
    answer: [3],
  },
];

export default function Quiz({ onComplete }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [answered, setAnswered] = useState(false);

  const current = QUESTIONS[idx];

  function choose(i) {
    if (answered) return; // prevent re-clicking after answer shown
    setChosen(i);
    setAnswered(true);

    const isCorrect = current.answer.includes(i);
    if (isCorrect) {
      setScore((s) => s + 1);
    }

    // auto-advance after a short delay
    setTimeout(() => {
      setChosen(null);
      setAnswered(false);
      if (idx + 1 < QUESTIONS.length) {
        setIdx(idx + 1);
      } else {
        setTimeout(() => onComplete(), 600);
      }
    }, 1000);
  }

  return (
    <section className="section flex-col w-full max-w-2xl mx-auto">
      <h2 className="h2 text-center">Quiz</h2>
      <p className="text-center mt-2">
        Sahi Jawab dede agar himmat hai toh
      </p>

      <div className="mt-6 bg-white/90 p-6 rounded-xl shadow-md">
        <div className="font-semibold">
          {idx + 1}. {current.q}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          {current.choices.map((choice, i) => {
            let colorClass = "bg-white/70 hover:bg-white";
            if (answered) {
              if (current.answer.includes(i)) colorClass = "bg-green-200";
              else if (chosen === i) colorClass = "bg-red-300";
            } else if (chosen === i) {
              colorClass = "border-2 border-gipsyPurple bg-white";
            }

            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={answered}
                className={`p-3 rounded-lg text-left transition-all duration-200 ${colorClass}`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Question {idx + 1} of {QUESTIONS.length}
        </div>
      </div>

      <div className="mt-4 text-center">
        <small>
          Score: {score}/{QUESTIONS.length}
        </small>
      </div>
    </section>
  );
}
