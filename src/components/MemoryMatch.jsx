import React, { useState, useEffect } from 'react'
import './MemoryMatch.css'

const PAIRS = [
  { id: 'hanni', label: 'Hanni', img: '/images/hanni.jpg', matchKey: 'blossom', matchImg: '/images/blossom.jpg', color: 'pink' },
  { id: 'minji', label: 'Minji', img: '/images/minji.jpg', matchKey: 'buttercup', matchImg: '/images/buttercup.jpg', color: 'green' },
  { id: 'danielle', label: 'Danielle', img: '/images/danielle.jpg', matchKey: 'bubbles', matchImg: '/images/bubbles.jpg', color: 'blue' },
  { id: 'haerin', label: 'Haerin', img: '/images/haerin.jpg', matchKey: 'bunny', matchImg: '/images/bunny.jpg', color: 'violet' },
  { id: 'hyein', label: 'Hyein', img: '/images/hyein.jpg', matchKey: 'bell', matchImg: '/images/bell.jpg', color: 'rose' }
]

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5)
}

export default function MemoryMatch({ onComplete }) {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matchedCount, setMatchedCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameKey, setGameKey] = useState(0)

  useEffect(() => {
    const deck = []
    PAIRS.forEach(p => {
      deck.push({ id: p.id + '-member', key: p.id, type: 'member', img: p.img, matchKey: p.matchKey })
      deck.push({ id: p.matchKey + '-ppg', key: p.matchKey, type: 'ppg', img: p.matchImg, matchKey: p.matchKey })
    })
    setCards(shuffle(deck))
    setFlipped([])
    setMatchedCount(0)
    setTimeLeft(60)
  }, [gameKey])

  useEffect(() => {
    if (matchedCount === PAIRS.length) return
    if (timeLeft <= 0) {
      setTimeout(() => setGameKey(k => k + 1), 1000)
      return
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft, matchedCount])

  function flipCard(index) {
    if (flipped.includes(index)) return
    if (cards[index].matched) return
    if (flipped.length === 2) return

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [c1, c2] = [cards[newFlipped[0]], cards[newFlipped[1]]]
      if (c1.matchKey === c2.matchKey) {
        setTimeout(() => {
          setCards(prev =>
            prev.map((c, i) => (newFlipped.includes(i) ? { ...c, matched: true } : c))
          )
          setFlipped([])
          setMatchedCount(mc => mc + 1)
        }, 500)
      } else {
        setTimeout(() => setFlipped([]), 800)
      }
    }
  }

  useEffect(() => {
    if (matchedCount === PAIRS.length) {
      setTimeout(() => onComplete && onComplete(), 1000)
    }
  }, [matchedCount])

  const formatTime = (t) => {
    const m = Math.floor(t / 60)
    const s = t % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <section key={gameKey} className="section flex flex-col w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mt-4">
        Agar sach mei deebiya di ho toh 1 min mei toh hojayega
      </h2>
      <p className="text-center mt-2 text-gray-600">
        Flip two cards. Match each member with their characters.
      </p>

      <div className={`text-center mt-4 text-lg font-bold transition-colors duration-300 
        ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-gipsyPurple'}`}>
        Time Left: {formatTime(timeLeft)}
      </div>

      <div className="mt-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 justify-items-center">
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className="card w-28 h-36 md:w-32 md:h-44"
            onClick={() => flipCard(idx)}
          >
            <div className={`card-inner ${flipped.includes(idx) || card.matched ? 'flipped' : ''}`}>
              <div className="card-face card-back">
                <span className="text-sm text-gray-500">Click</span>
              </div>
              <div className="card-face card-front">
                <img
                  src={card.img}
                  alt="card"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center text-gray-700">
        <small>{matchedCount}/{PAIRS.length} matched</small>
      </div>
    </section>
  )
}
