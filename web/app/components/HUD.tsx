'use client'

import { motion } from 'framer-motion'

interface HUDProps {
  state: 'idle' | 'processing' | 'verified' | 'failed'
  progress: number
}

export function HUD({ state, progress }: HUDProps) {
  const stateLabel = {
    idle: 'IDLE',
    processing: 'PROCESSING',
    verified: 'VERIFIED',
    failed: 'FAILED',
  }[state]

  const stateColor = {
    idle: 'text-white/50',
    processing: 'text-purple',
    verified: 'text-teal',
    failed: 'text-orange',
  }[state]

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Main HUD Circle */}
      <div className="relative w-48 h-48">
        <motion.div
          className="absolute inset-0 rounded-full border border-white/20"
          animate={{
            boxShadow:
              state === 'processing'
                ? [
                    '0 0 20px rgba(123, 97, 255, 0.3)',
                    '0 0 40px rgba(123, 97, 255, 0.5)',
                    '0 0 20px rgba(123, 97, 255, 0.3)',
                  ]
                : state === 'verified'
                  ? '0 0 30px rgba(45, 216, 167, 0.5)'
                  : '0 0 10px rgba(255, 255, 255, 0.1)',
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="90"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="90"
            fill="none"
            stroke={
              state === 'verified'
                ? '#2DD8A7'
                : state === 'failed'
                  ? '#FF6B6B'
                  : '#7B61FF'
            }
            strokeWidth="2"
            strokeDasharray={565}
            initial={{ strokeDashoffset: 565 }}
            animate={{ strokeDashoffset: 565 - 565 * (progress / 100) }}
            transition={{ duration: 0.3 }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`font-mono text-xl font-bold ${stateColor}`}>
              {stateLabel}
            </div>
            <div className="text-xs text-white/40 mt-2">{progress}%</div>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <motion.div
        className="flex items-center gap-2"
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            state === 'verified'
              ? 'bg-teal'
              : state === 'failed'
                ? 'bg-orange'
                : 'bg-purple'
          }`}
        />
        <span className="text-xs text-white/60 font-mono">
          {state === 'processing' ? 'Verifying...' : 'Ready'}
        </span>
      </motion.div>
    </div>
  )
}
