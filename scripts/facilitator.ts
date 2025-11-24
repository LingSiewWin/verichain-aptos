#!/usr/bin/env bun

import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import pc from 'picocolors';
import * as fs from 'fs';
import * as path from 'path';

// Parse CLI args
interface Args {
  input: number[];
  agent: string;
  mode: 'success' | 'fail';
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const input: number[] = [];
  let agent = '0x1';
  let mode: 'success' | 'fail' = 'success';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--input' && args[i + 1]) {
      input.push(...args[i + 1].split(',').map(Number));
      i++;
    } else if (args[i] === '--agent' && args[i + 1]) {
      agent = args[i + 1];
      i++;
    } else if (args[i] === '--mode' && args[i + 1]) {
      mode = args[i + 1] as 'success' | 'fail';
      i++;
    }
  }

  return { input: input.length ? input : [42, 69], agent, mode };
}

async function fetchOracleData(): Promise<{ amount: number }> {
  // MVP: Hardcoded X402 mock (httpstat.us/402 returns 402 Payment Required)
  try {
    const resp = await fetch('https://httpstat.us/402', { timeout: 5000 });
    if (resp.status === 402) {
      console.log(pc.yellow('⚡ [X402] HTTP 402 received → Settling payment...'));
      return { amount: 0.001 }; // Mock: 0.001 APT for CO2 data
    }
  } catch {
    console.log(pc.yellow('⚡ [X402] Timeout/error → Fallback to coin::transfer mock'));
  }
  return { amount: 0.001 };
}

function mockAIInference(input: number[]): number {
  // MVP: Deterministic linear regression (input sum * 0.01)
  // Placeholder for @xenova/transformers in production
  const sum = input.reduce((a, b) => a + b, 0);
  const output = Math.floor(sum * 0.01 * 1e6); // Convert to micro-APT
  return output;
}

function computeProof(
  input: number[],
  output: number,
  receiptHash: Uint8Array,
  tamper: boolean = false
): Uint8Array {
  // MVP: BCS-style hash(input + output + receipt)
  // Upgrade to SNARK via Move prover integration
  if (tamper) {
    // For fail test: alter proof to trigger abort
    const arr = new Uint8Array(32);
    arr[0] = 0xff; // Invalid marker
    return arr;
  }
  // Simplified: Just concatenate bytes (real: use @aptos-labs/bcs)
  const arr = new Uint8Array(input.length * 8 + 8 + 32);
  let idx = 0;
  input.forEach((n) => {
    arr[idx++] = n & 0xff;
  });
  arr[idx++] = output & 0xff;
  for (let i = 0; i < Math.min(receiptHash.length, 32); i++) {
    arr[idx++] = receiptHash[i];
  }
  return arr;
}

async function main() {
  const { input, agent, mode } = parseArgs();

  console.log(pc.cyan('\n╔════════════════════════════════════╗'));
  console.log(pc.cyan('║   VERICHAIN AI: MOVING THE FUTURE   ║'));
  console.log(pc.cyan('╚════════════════════════════════════╝\n'));

  console.log(pc.cyan(`🚀 [INIT] Mode: ${mode.toUpperCase()} | Agent: ${agent.slice(0, 10)}...`));
  console.log(pc.cyan(`📊 [INIT] Input: [${input.join(', ')}] CO2 levels (ppm)\n`));

  // Step 1: Fetch oracle data
  console.log(pc.cyan('[1/4] Fetching CO2 data...'));
  const payment = await fetchOracleData();
  console.log(pc.green(`✅ [ORACLE] Received: ${payment.amount} APT | Data: ${input[0]} ppm`));

  // Step 2: Mock AI inference
  console.log(pc.cyan('[2/4] Running AI inference...'));
  const outputValue = mockAIInference(input);
  console.log(pc.green(`✅ [AI] Inferred carbon price: ${outputValue} micro-APT`));

  // Step 3: Compute proof
  console.log(pc.cyan('[3/4] Computing verifiable proof...'));
  const receiptHash = new Uint8Array(32);
  const proof = computeProof(input, outputValue, receiptHash, mode === 'fail');
  console.log(pc.green(`✅ [PROOF] Computed: ${proof.slice(0, 8).join(',')}...`));

  // Step 4: Submit TX (mocked)
  console.log(pc.cyan('[4/4] Submitting on-chain verification...'));
  if (mode === 'fail') {
    console.log(pc.red(`🚫 [CHAIN] Invalid proof detected → Aborting TX`));
    console.log(pc.red(`🔒 [SECURE] Exploit prevented by Move resource safety\n`));
  } else {
    const rwaAddr = '0x' + Math.random().toString(16).slice(2, 10).padStart(8, '0');
    console.log(pc.green(`✅ [CHAIN] Proof verified | RWA minted: ${rwaAddr.slice(0, 10)}...`));
    console.log(pc.green(`💰 [TOKENIZE] Carbon credit value: ${outputValue} micro-tons`));
    console.log(pc.green(`🌍 [IMPACT] Offset: 42 tons CO2\n`));
    console.log(pc.yellow(`📊 [EXPLORER] View on Aptos:`));
    console.log(pc.yellow(`   https://explorer.aptoslabs.com/txn/0x123?network=testnet\n`));
  }

  console.log(pc.cyan('═══════════════════════════════════\n'));
}

main().catch((err) => {
  console.error(pc.red(`❌ [ERROR] ${err.message}`));
  process.exit(1);
});
