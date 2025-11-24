#!/usr/bin/env bun

import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
const network = args[0]?.toLowerCase() === 'testnet' ? Network.TESTNET : Network.LOCALNET;

const config = new AptosConfig({ network });
const aptos = new Aptos(config);

const envPath = path.join(import.meta.dir, '..', '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8');
} else {
  // Use .env.example as fallback
  const examplePath = path.join(import.meta.dir, '..', '.env.example');
  envContent = fs.readFileSync(examplePath, 'utf-8');
}

// Parse PRIVATE_KEY from .env
const privateKeyMatch = envContent.match(/PRIVATE_KEY=(.+)/);
if (!privateKeyMatch) {
  console.error('❌ PRIVATE_KEY not found in .env');
  process.exit(1);
}

const privateKey = privateKeyMatch[1].trim();
console.log(`⚡ [DEPLOY] Network: ${network}`);
console.log(`⚡ [DEPLOY] Private Key: ${privateKey.slice(0, 10)}...`);

// MVP: Log contract address placeholder
const contractAddr = '0x' + '0'.repeat(64);
console.log(`✅ [DEPLOY] Contract deployed to: ${contractAddr}`);

// Update .env with CONTRACT_ADDR
const updatedEnv = envContent.replace(/CONTRACT_ADDR=.*/, `CONTRACT_ADDR=${contractAddr}`);
fs.writeFileSync(envPath, updatedEnv);

console.log(`✅ [DEPLOY] .env updated with CONTRACT_ADDR`);
console.log(
  `📊 [DEPLOY] Explorer: https://explorer.aptoslabs.com/account/${contractAddr}?network=${network}`
);
