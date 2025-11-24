# VeriChain AI: Verifiable AI Agents for RWA Tokenization on Aptos
On-Chain Verifiable AI for Dynamic RWA Tokenization on Aptos. Core: Move module locks AI proofs as resources, mints fractional RWAs (e.g., carbon credits), with X402 micropayments for agentic data fetches. Tracks: RWA Tokenization + AI-Web3 + Security Innovation.
Agents pay (X402) for data, verify inferences, mint fractional RWAs (e.g., carbon credits). Innovation: Parallel-safe verifier prevents black-box exploits. 

## Quickstart
1. `bun install` (3s)
2. `cp .env.example .env` & set `PRIVATE_KEY=0x...` (testnet faucet)
3. `bun run deploy` (Move publish to localnet)
4. `bun run facilitator --input [42]` (X402 pay → verify → mint)
5. View tx: `aptos account list --account <addr>`

## Architecture
- **Move:** `AIResource` locks proofs; `verify_and_tokenize` mints `RWAToken`.
- **Off-Chain:** Bun/TS facilitator: X402 settle + Torch mock + Aptos SDK submit.
- **Demo Flow:** Deploy agent → Pay for CO2 data → Infer/verify → Trade fractional RWA.

## Tech
- Aptos Testnet v2.x
- Bun 1.1+ for 2x faster scripts
- X402 via @adipundir/aptos-x402
- Mock AI: @xenova/transformers (lightweight Torch)

## Run Tests
`bun test` (Vitest + Move prover)

## Hackathon Submission
- Repo: github.com/<user>/verichain-ai
- Video: [YouTube link] (2-min: CLI to trade)
- Deck: [PDF link] (Problem-Solution-Tech-Impact-Vision)

Fork & build: Aptos's 2026 AI unlock. MIT License.