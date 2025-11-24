import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VeriChain AI',
  description: 'Verifiable AI Agents for RWA Tokenization on Aptos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white font-sans">{children}</body>
    </html>
  )
}
