# VeriChain Web Frontend

Clean, spacious UI for VeriChain AI with particle effects, HUD display, and terminal logs.

## Design Philosophy

- **Minimal & Spacious**: Clean layout with breathing room between elements
- **Glass-Morphism**: Translucent cards with subtle borders
- **Dark Sci-Fi**: Teal (#2DD8A7), Purple (#7B61FF), Orange (#FF6B6B) on black
- **Responsive**: Single-page, mobile-friendly

## Quick Start

```bash
cd web
bun install
bun run dev
```

Open `http://localhost:3000`

## Architecture

- `app/page.tsx` - Main dashboard (state, controls, logs)
- `components/ParticleScene.tsx` - 3D particle background (react-three-fiber)
- `components/HUD.tsx` - Central progress indicator
- `components/Terminal.tsx` - Execution log display
- `components/ControlPanel.tsx` - Input controls & mode toggle

## Integration with Backend

Currently uses dummy data for simulation. To connect to the actual `facilitator.ts`:

1. Call the backend facilitator script with inputs
2. Stream responses to Terminal
3. Update HUD state based on processing stages

See `app/page.tsx:simulateProcess()` for integration points.

## Features

✅ Particle network background (idle/processing/verified states)
✅ HUD with progress ring and status indicator
✅ Terminal log with color-coded status
✅ Input controls (CO₂ values)
✅ Mode toggle (Success/Fail)
✅ Smooth animations (Framer Motion)
✅ Glassmorphism UI
✅ Dark mode only
