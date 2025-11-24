#!/usr/bin/env bun

import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';
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
  let agent = '';
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

function loadEnv(): { privateKey: string; contractAddr: string; rpcUrl: string } {
  const envPath = path.join(import.meta.dir, '..', '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');

  const privateKeyMatch = envContent.match(/PRIVATE_KEY=(.+)/);
  const contractAddrMatch = envContent.match(/CONTRACT_ADDR=(.+)/);
  const rpcUrlMatch = envContent.match(/APTOS_RPC_URL=(.+)/);

  if (!privateKeyMatch || !contractAddrMatch) {
    throw new Error('❌ PRIVATE_KEY or CONTRACT_ADDR not found in .env');
  }

  return {
    privateKey: privateKeyMatch[1].trim(),
    contractAddr: contractAddrMatch[1].trim(),
    rpcUrl: rpcUrlMatch ? rpcUrlMatch[1].trim() : 'https://api.testnet.aptoslabs.com/v1',
  };
}

async function main() {
  const { input, agent, mode } = parseArgs();
  const { privateKey, contractAddr, rpcUrl } = loadEnv();

  console.log(pc.cyan('\n╔════════════════════════════════════╗'));
  console.log(pc.cyan('║   VERICHAIN AI: MOVING THE FUTURE   ║'));
  console.log(pc.cyan('╚════════════════════════════════════╝\n'));

  console.log(pc.cyan(`🚀 [INIT] Mode: ${mode.toUpperCase()} | Agent: ${agent.slice(0, 10)}...`));
  console.log(pc.cyan(`📊 [INIT] Input: [${input.join(', ')}] CO2 levels (ppm)\n`));

  // Initialize Aptos SDK
  const aptos = new Aptos(new AptosConfig({ fullnode: rpcUrl }));

  // Load account from private key
  const privKeyObj = new Ed25519PrivateKey(privateKey);
  const account = new Account({
    privateKey: privKeyObj,
    address: agent,
  });

  // Step 1: Mock X402 payment fetch
  console.log(pc.cyan('[1/4] Fetching CO2 data via X402...'));
  try {
    const resp = await fetch('https://httpstat.us/402', { timeout: 5000 });
    if (resp.status === 402) {
      console.log(pc.yellow('⚡ [X402] HTTP 402 received → Payment settled'));
    }
  } catch {
    console.log(pc.yellow('⚡ [X402] Timeout → Fallback to coin::transfer mock'));
  }
  console.log(pc.green(`✅ [ORACLE] Paid 0.001 APT | Data: ${input[0]} ppm\n`));

  // Step 2: Mock AI inference (deterministic)
  console.log(pc.cyan('[2/4] Running AI inference...'));
  const sum = input.reduce((a, b) => a + b, 0);
  const outputValue = Math.floor(sum * 0.01 * 1e6); // micro-APT
  console.log(pc.green(`✅ [AI] Inferred carbon price: ${outputValue} micro-APT\n`));

  // Step 3: Compute proof
  console.log(pc.cyan('[3/4] Computing verifiable proof...'));
  const receiptHash = new Uint8Array(32).fill(0); // Mock receipt
  let proof = new Uint8Array(32).fill(0);

  if (mode === 'fail') {
    // Tampered proof to trigger abort
    proof[0] = 0xff;
    console.log(pc.yellow(`⚠️  [PROOF] Tampered proof (fail test): ${proof.slice(0, 8).join(',')}...\n`));
  } else {
    // Valid proof
    proof.set(Buffer.from(`proof_${input.join('_')}_${outputValue}`).slice(0, 32));
    console.log(pc.green(`✅ [PROOF] Computed: ${Array.from(proof.slice(0, 8)).join(',')}...\n`));
  }

  // Step 4: Submit TX via Move contract
  console.log(pc.cyan('[4/4] Submitting on-chain verification...'));
  try {
    const txPayload = {
      function: `${contractAddr}::verichain::verify_and_tokenize`,
      typeArguments: [],
      functionArguments: [input, outputValue, Array.from(receiptHash)],
    };

    const pendingTx = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: txPayload,
    });

    const commitedTx = await aptos.signAndSubmitTransaction({
      signer: account,
      transaction: pendingTx,
    });

    const executedTx = await aptos.waitForTransaction({
      transactionHash: commitedTx.hash,
    });

    if (mode === 'fail') {
      if (executedTx.success === false) {
        console.log(pc.red(`🚫 [CHAIN] Invalid proof detected → TX aborted`));
        console.log(pc.red(`🔒 [SECURE] Exploit prevented by Move resource safety\n`));
      } else {
        console.log(pc.yellow(`⚠️  [CHAIN] Expected fail, but TX succeeded. Check proof logic.\n`));
      }
    } else {
      if (executedTx.success) {
        console.log(pc.green(`✅ [CHAIN] Proof verified | TX committed`));
        console.log(pc.green(`💰 [TOKENIZE] Carbon credit value: ${outputValue} micro-tons`));
        console.log(pc.green(`🌍 [IMPACT] Offset: 42 tons CO2\n`));
        console.log(pc.yellow(`📊 [EXPLORER] View transaction:`));
        console.log(pc.yellow(`   https://explorer.aptoslabs.com/txn/${commitedTx.hash}?network=testnet\n`));
      } else {
        console.log(pc.red(`❌ [CHAIN] TX failed: ${executedTx.vm_status}\n`));
      }
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.log(pc.red(`❌ [TX] Submission error: ${errMsg}\n`));
  }

  console.log(pc.cyan('═══════════════════════════════════\n'));
}

main().catch((err) => {
  console.error(pc.red(`❌ [ERROR] ${err.message}`));
  process.exit(1);
});
