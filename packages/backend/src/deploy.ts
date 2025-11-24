#!/usr/bin/env bun

import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import pc from 'picocolors';
import yaml from 'yaml';

const envPath = path.join(import.meta.dir, '..', '..', '..', '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8');
} else {
  const examplePath = path.join(import.meta.dir, '..', '..', '..', '.env.example');
  envContent = fs.readFileSync(examplePath, 'utf-8');
}

// Parse PRIVATE_KEY from .env
const privateKeyMatch = envContent.match(/PRIVATE_KEY=(.+)/);
if (!privateKeyMatch) {
  console.error(pc.red('❌ PRIVATE_KEY not found in .env'));
  process.exit(1);
}

const privateKey = privateKeyMatch[1].trim();

// Read Aptos config to get sender address and network
const configPath = path.join(import.meta.dir, '..', '..', '..', '.aptos', 'config.yaml');
if (!fs.existsSync(configPath)) {
  console.error(pc.red('❌ .aptos/config.yaml not found. Run: aptos init'));
  process.exit(1);
}

const configContent = fs.readFileSync(configPath, 'utf-8');
const config = yaml.parse(configContent);
const senderAddr = config.profiles?.default?.account;
const network = config.profiles?.default?.network?.toLowerCase() || 'testnet';

if (!senderAddr) {
  console.error(pc.red('❌ Account address not found in .aptos/config.yaml'));
  process.exit(1);
}

console.log(pc.cyan(`⚡ [DEPLOY] Network: ${network}`));
console.log(pc.cyan(`⚡ [DEPLOY] Sender: ${senderAddr.slice(0, 8)}...`));

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

// Run: yes | aptos move publish --named-addresses verichain=<sender_address> --max-gas 10000
const publishCmd = spawnSync('bash', ['-c', `yes | aptos move publish --named-addresses "verichain=${senderAddr}" --max-gas 10000`], {
  cwd: path.join(import.meta.dir, '..'),
  encoding: 'utf-8',
  stdio: ['pipe', 'pipe', 'pipe'],
});

if (publishCmd.status !== 0) {
  console.error(pc.red(`❌ Publish failed:`));
  console.error(pc.red(publishCmd.stderr || publishCmd.stdout));
  process.exit(1);
}

// Extract module address from output (search for "Transaction submitted:" line which contains the TX hash)
// Then extract any 0x address after "Modules published under" or from "0x" pattern
const allMatches = publishCmd.stdout.match(/0x[a-f0-9]{1,64}/g) || [];
const contractAddr = allMatches.length > 0 ? allMatches[allMatches.length - 1] : null;

if (!contractAddr) {
  console.error(pc.red(`❌ Could not extract module address from output`));
  process.exit(1);
}

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
