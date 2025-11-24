'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface ControlPanelProps {
  onInitialize: (input: number[], mode: 'success' | 'fail') => void
  isLoading: boolean
}

export function ControlPanel({ onInitialize, isLoading }: ControlPanelProps) {
  const [input1, setInput1] = useState('42')
  const [input2, setInput2] = useState('69')
  const [mode, setMode] = useState<'success' | 'fail'>('success')

  const handleClick = () => {
    const nums = [parseInt(input1) || 0, parseInt(input2) || 0]
    onInitialize(nums, mode)
  }

  return (
    <div className="glass p-8 space-y-6 w-full max-w-md">
      {/* Input Fields */}
      <div className="space-y-4">
        <label className="block text-xs text-white/60 font-mono">
          CO₂ Input Values
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-black/30 border border-white/20 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:border-teal disabled:opacity-50"
          />
          <input
            type="number"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-black/30 border border-white/20 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:border-teal disabled:opacity-50"
          />
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="space-y-3">
        <label className="block text-xs text-white/60 font-mono">
          Execution Mode
        </label>
        <div className="flex gap-2 p-1 bg-black/30 rounded border border-white/20">
          <button
            onClick={() => setMode('success')}
            disabled={isLoading}
            className={`flex-1 py-2 rounded text-xs font-mono transition ${
              mode === 'success'
                ? 'bg-teal/20 text-teal border border-teal/30'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            SUCCESS
          </button>
          <button
            onClick={() => setMode('fail')}
            disabled={isLoading}
            className={`flex-1 py-2 rounded text-xs font-mono transition ${
              mode === 'fail'
                ? 'bg-orange/20 text-orange border border-orange/30'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            FAIL
          </button>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        onClick={handleClick}
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 rounded font-mono text-sm font-bold transition ${
          mode === 'success'
            ? 'bg-gradient-to-r from-teal to-teal/80 text-black hover:shadow-lg hover:shadow-teal/30'
            : 'bg-gradient-to-r from-orange to-orange/80 text-black hover:shadow-lg hover:shadow-orange/30'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isLoading ? 'INITIALIZING...' : 'INITIALIZE AGENT'}
      </motion.button>
    </div>
  )
}
