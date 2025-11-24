#!/usr/bin/env bun

import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import pc from 'picocolors';

const args = process.argv.slice(2);
const network = args[0]?.toLowerCase() === 'testnet' ? 'testnet' : 'localnet';

const envPath = path.join(import.meta.dir, '..', '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8');
} else {
  const examplePath = path.join(import.meta.dir, '..', '.env.example');
  envContent = fs.readFileSync(examplePath, 'utf-8');
}

// Parse PRIVATE_KEY from .env
const privateKeyMatch = envContent.match(/PRIVATE_KEY=(.+)/);
if (!privateKeyMatch) {
  console.error(pc.red('❌ PRIVATE_KEY not found in .env'));
  process.exit(1);
}

const privateKey = privateKeyMatch[1].trim();
console.log(pc.cyan(`⚡ [DEPLOY] Network: ${network}`));
console.log(pc.cyan(`⚡ [DEPLOY] Private Key: ${privateKey.slice(0, 10)}...`));

// Check if aptos CLI is available
const aptosCheck = spawnSync('which', ['aptos'], { encoding: 'utf-8' });
if (aptosCheck.status !== 0) {
  console.error(
    pc.red(
      '❌ Aptos CLI not found. Install: brew install aptos or download from https://github.com/aptos-labs/aptos-core/releases'
    )
  );
  process.exit(1);
}

console.log(pc.cyan('[DEPLOY] Publishing Move module to ' + network + '...'));

// Run: aptos move publish --named-addresses verichain=default --network testnet
const publishCmd = spawnSync('aptos', ['move', 'publish', '--named-addresses', 'verichain=default', '--network', network], {
  cwd: path.join(import.meta.dir, '..'),
  encoding: 'utf-8',
});

if (publishCmd.status !== 0) {
  console.error(pc.red(`❌ Publish failed:\n${publishCmd.stderr}`));
  process.exit(1);
}

// Extract contract address from output (aptos move publish returns module address)
const addressMatch = publishCmd.stdout.match(/0x[a-f0-9]{1,64}/);
const contractAddr = addressMatch ? addressMatch[0] : '0x' + '0'.repeat(64);

console.log(pc.green(`✅ [DEPLOY] Contract deployed to: ${contractAddr}`));

// Update .env with CONTRACT_ADDR
const updatedEnv = envContent.replace(/CONTRACT_ADDR=.*/, `CONTRACT_ADDR=${contractAddr}`);
fs.writeFileSync(envPath, updatedEnv);

console.log(pc.green(`✅ [DEPLOY] .env updated with CONTRACT_ADDR`));
console.log(
  pc.yellow(
    `📊 [DEPLOY] Explorer: https://explorer.aptoslabs.com/account/${contractAddr}?network=${network}`
  )
);
