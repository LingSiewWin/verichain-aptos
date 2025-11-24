'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the ParticleBackground to avoid SSR issues
const ParticleBackground = dynamic(() => import('./components/ParticleBackground'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black -z-10" />
})

export default function Home() {
  const [logs, setLogs] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<'success' | 'fail'>('success')

  const runDemo = async () => {
    setIsRunning(true)
    setLogs([])

    const steps = [
      '🚀 [INIT] Starting VeriChain AI Demo...',
      '⚡ [X402] Fetching CO₂ data from oracle...',
      '💰 [PAYMENT] Paid 0.001 APT via X402 protocol',
      '📊 [DATA] Received: 42 tons CO₂, 69 ppm levels',
      '🧠 [AI] Running verifiable inference...',
      '🔢 [AI] Computed value: 111 micro-APT carbon price',
      '🔐 [PROOF] Computing cryptographic proof...',
      '✅ [PROOF] Hash: 0xabc123def456...',
      '📝 [CHAIN] Submitting to Aptos blockchain...',
    ]

    if (mode === 'success') {
      steps.push(
        '✨ [SUCCESS] Transaction confirmed!',
        '🎉 [MINT] RWA Token minted: 0x71f0e1e0...',
        '💚 [IMPACT] Carbon offset: 42 tons CO₂',
        '📈 [VALUE] Token value: 111 micro-APT',
        '🔗 [EXPLORER] View on Aptos Explorer'
      )
    } else {
      steps.push(
        '⚠️ [VERIFY] Invalid proof detected!',
        '🚫 [ABORT] Transaction aborted for security',
        '🛡️ [SECURE] No tokens minted, no gas wasted',
        '✅ [SAFETY] Chain protected from invalid data'
      )
    }

    for (const step of steps) {
      setLogs(prev => [...prev, step])
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setIsRunning(false)
  }

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Three.js Particle Background with Mouse Interaction */}
      <Suspense fallback={<div className="fixed inset-0 bg-black -z-10" />}>
        <ParticleBackground />
      </Suspense>

      {/* Content Overlay */}
      <div className="relative z-10 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-7xl font-bold mb-4 text-white tracking-wider">
              VERICHAIN AI
            </h1>
            <p className="text-xl text-gray-300 backdrop-blur-sm bg-black/40 inline-block px-6 py-3 rounded-lg border border-white/10">
              Verifiable AI Agents for RWA Tokenization on Aptos
            </p>
            <div className="mt-4 text-sm text-gray-400">
              <span className="bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 inline-block">
                Contract: 0x638be8bf9433a3ebbbe5ef644efdf6f541d64990d680fd118b9b91e3edcb7c78
              </span>
            </div>
          </div>

          {/* Control Panel - Glassmorphism */}
          <div className="glass-panel rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Control Panel
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setMode('success')}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 border ${
                    mode === 'success'
                      ? 'bg-white text-black border-white font-semibold'
                      : 'bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/60'
                  }`}
                >
                  Success Mode
                </button>
                <button
                  onClick={() => setMode('fail')}
                  className={`px-6 py-2 rounded-lg transition-all duration-300 border ${
                    mode === 'fail'
                      ? 'bg-white text-black border-white font-semibold'
                      : 'bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/60'
                  }`}
                >
                  Fail Mode
                </button>
              </div>
            </div>

            <button
              onClick={runDemo}
              disabled={isRunning}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 border-2 ${
                isRunning
                  ? 'bg-black/40 text-gray-500 border-gray-700 cursor-not-allowed'
                  : 'bg-white text-black border-white hover:bg-black hover:text-white hover:border-white transform hover:scale-[1.02]'
              }`}
            >
              {isRunning ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-gray-500 border-t-white rounded-full animate-spin"></span>
                  PROCESSING VERIFICATION...
                </span>
              ) : (
                'RUN VERICHAIN AI'
              )}
            </button>
          </div>

          {/* Terminal Output - Glassmorphism */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-mono text-white flex items-center gap-2">
                <span className="text-cyan-400">$</span>
                Terminal Output
              </h2>
              <div className="flex gap-2">
                <div className="w-3 h-3 border border-white/30 rounded-full"></div>
                <div className="w-3 h-3 border border-white/30 rounded-full"></div>
                <div className="w-3 h-3 border border-white/30 rounded-full"></div>
              </div>
            </div>

            <div className="font-mono text-sm space-y-2 h-96 overflow-y-auto custom-scrollbar bg-black/40 p-4 rounded-lg border border-white/10">
              {logs.length === 0 ? (
                <div className="text-gray-500">
                  <span className="text-cyan-400">$</span> Ready to initialize VeriChain AI...
                </div>
              ) : (
                logs.map((log, i) => (
                  <div
                    key={i}
                    className={`
                      transition-all duration-300 animate-fadeIn
                      ${log.includes('SUCCESS') || log.includes('MINT') ? 'text-green-400 font-semibold' : ''}
                      ${log.includes('ABORT') || log.includes('Invalid') ? 'text-red-400 font-semibold' : ''}
                      ${log.includes('INIT') || log.includes('X402') ? 'text-cyan-400' : ''}
                      ${log.includes('AI') || log.includes('PROOF') ? 'text-purple-400' : ''}
                      ${log.includes('IMPACT') || log.includes('VALUE') ? 'text-yellow-400' : ''}
                      ${!log.includes('SUCCESS') && !log.includes('ABORT') && !log.includes('INIT') && !log.includes('AI') && !log.includes('IMPACT') ? 'text-gray-300' : ''}
                    `}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <span className="text-white/30 mr-2">›</span>
                    {log}
                  </div>
                ))
              )}
              {isRunning && (
                <span className="inline-block animate-pulse text-white">
                  <span className="animate-bounce">▊</span>
                </span>
              )}
            </div>
          </div>

          {/* Stats - Minimalist Black/White */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-white">42 tons</div>
              <div className="text-gray-400 mt-2">CO₂ Offset</div>
              <div className="mt-3 h-0.5 bg-white/20"></div>
            </div>
            <div className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-white">111 APT</div>
              <div className="text-gray-400 mt-2">Token Value</div>
              <div className="mt-3 h-0.5 bg-white/20"></div>
            </div>
            <div className="glass-panel rounded-2xl p-6 hover:scale-105 transition-all duration-300">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-gray-400 mt-2">Verified</div>
              <div className="mt-3 h-0.5 bg-white/20"></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .glass-panel {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}