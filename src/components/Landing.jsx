import React from 'react'
import { motion } from 'framer-motion'

export default function Landing({ onStart }) {
  return (
    <section className="section flex-col relative overflow-hidden">
      
      {/* Floating pastel bubbles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="floating-bubble"></div>
        <div className="floating-bubble"></div>
        <div className="floating-bubble"></div>
        <div className="floating-bubble"></div>
      </div>

      {/* Floating Animated Gradient Title */}
      <motion.div
  initial={{ y: -20 }}
  animate={{ y: [0, -10, 0] }}
  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
  className="overflow-visible title-container"
>
  <h1 className="h1 glow-title text-6xl md:text-7xl leading-tight text-center">
          Happy Birthday, Divya 💜!
        </h1>
</motion.div>



      <motion.p
        className="mt-6 text-center text-lg md:text-xl text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        But are you Divya di?
      </motion.p>

      <motion.button
        onClick={onStart}
        className="mt-10 px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500 text-white font-medium shadow-lg button-glow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        Let’s find out
      </motion.button>

      <div className="mt-8 text-center text-gray-600">
        <small>agar aap real Divya di ho toh uper diya hua button ko dabao.</small>
      </div>
    </section>
  )
}
