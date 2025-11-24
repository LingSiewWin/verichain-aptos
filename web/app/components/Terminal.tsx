'use client'

import { useEffect, useState } from 'react'

interface TerminalLog {
  id: number
  text: string
  status: 'pending' | 'success' | 'error'
}

interface TerminalProps {
  logs: TerminalLog[]
}

export function Terminal({ logs }: TerminalProps) {
  return (
    <div className="glass p-6 h-80 overflow-y-auto">
      <div className="font-mono text-sm space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3">
            <span
              className={`shrink-0 w-4 h-4 rounded-full mt-1 ${
                log.status === 'success'
                  ? 'bg-teal'
                  : log.status === 'error'
                    ? 'bg-orange'
                    : 'bg-purple animate-pulse'
              }`}
            />
            <span
              className={`${
                log.status === 'success'
                  ? 'text-teal'
                  : log.status === 'error'
                    ? 'text-orange'
                    : 'text-white/70'
              }`}
            >
              {log.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
