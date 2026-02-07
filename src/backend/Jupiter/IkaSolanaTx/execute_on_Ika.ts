import "dotenv/config";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { buildUnsignedSOLTransfer, buildUnsignedMemoTx } from "./buildUnsigned.js";
import { ikaSignBytes } from "./ikaRequestSign.js";
import { fetchIkaSignature } from "./ikaFetch.js";
import { broadcastSignedSolanaTx } from "./solanaBroadcast.js";
import { Curve, getNetworkConfig, IkaClient, publicKeyFromDWalletOutput } from "@ika.xyz/sdk";
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const DWALLET_RESULT_FILE = process.env.SOLANA_DWALLET_RESULT_FILE || path.resolve(__dirname, '..', 'IkaSetups', 'output', 'dwallet_result.json');
const PRESIGN_RESULT_FILE = process.env.SOLANA_PRESIGN_RESULT_FILE || path.resolve(__dirname, '..', 'IkaSetups', 'output', 'presign_result.json');
const dWalletData = JSON.parse(fs.readFileSync(DWALLET_RESULT_FILE, 'utf8'));
const presignData = JSON.parse(fs.readFileSync(PRESIGN_RESULT_FILE, 'utf8'));

console.log("\n=== ikaRequestSign Config ===");
console.log("dWallet result file:", DWALLET_RESULT_FILE);
console.log("Presign result file:", PRESIGN_RESULT_FILE);
console.log("dWalletObjectID:", dWalletData.dWalletObjectID);
console.log("senderAddress:", dWalletData.senderAddress);
console.log("presignId:", presignData.presignId);
console.log("rootSeedKey present:", !!dWalletData.rootSeedKey);
console.log("userPublicOutput present:", !!dWalletData.dkgRequestInput?.userPublicOutput);

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL;
if (!SOLANA_RPC_URL) {
  throw new Error('SOLANA_RPC_URL is not set');
}

// ✅ Fill in: recipient Solana address for the SOL transfer
const RECIPIENT = new PublicKey(
  "GR5HAedxPBDnV8PUb4dywaHHxPvTpV7wAXNk9MyDYBuH" // replace with actual recipient
);

const SOL_TRANSFER_LAMPORTS = 0.0001 * LAMPORTS_PER_SOL;

function objectToUint8Array(obj: any): Uint8Array {
  if (obj instanceof Uint8Array) return obj;
  if (Array.isArray(obj)) return new Uint8Array(obj);
  const keys = Object.keys(obj).map(k => parseInt(k)).sort((a, b) => a - b);
  return new Uint8Array(keys.map(k => obj[k]));
}

async function main() {
  // --- Solana connection ---
  const connection = new Connection(SOLANA_RPC_URL!, "confirmed");
  console.log("Solana RPC:", SOLANA_RPC_URL);

  // --- Ika / Sui setup ---
  const suiClient = new SuiJsonRpcClient({
    url: "https://api.us1.shinami.com/sui/node/v1/us1_sui_testnet_b909eacf46e54e799a307be45791e726",
    network: 'testnet',
  });
  const ikaClient = new IkaClient({
    suiClient: suiClient as any,
    config: getNetworkConfig('testnet'),
  });
  await ikaClient.initialize();

  // --- Sui signer (to execute Ika transactions) ---
  const SUI_PRIVATE_KEY = process.env.SUI_PRIVATE_KEY;
  if (!SUI_PRIVATE_KEY) {
    throw new Error('SUI_PRIVATE_KEY is not set');
  }
  const keypair = Ed25519Keypair.fromSecretKey(SUI_PRIVATE_KEY);
  const signerAddress = keypair.toSuiAddress();

  const executeTransaction = async (tx: Transaction) => {
    const result = await suiClient.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
    });
    const txDetails = await suiClient.waitForTransaction({
      digest: result.digest,
      options: {
        showEvents: true,
        showObjectChanges: true,
        showEffects: true,
      },
    });
    return txDetails;
  };

  // --- Derive Solana public key from Ika dWallet ---
  const dWalletObjectID = dWalletData.dWalletObjectID;
  console.log("\n=== Fetching dWallet from network ===");
  console.log("dWalletObjectID:", dWalletObjectID);

  const dWallet = await ikaClient.getDWalletInParticularState(
    dWalletObjectID,
    'Active',
    { timeout: 120000, interval: 3000 }
  );

  console.log("dWallet state:", dWallet.state?.$kind || 'unknown');
  console.log("dWallet dwallet_cap_id:", dWallet.dwallet_cap_id);
  console.log("dWallet encrypted_user_secret_key_shares table:", dWallet.encrypted_user_secret_key_shares?.id?.id);

  if (!dWallet.state?.Active?.public_output) {
    throw new Error('dWallet is not in Active state or missing public_output');
  }
  const dWalletPublicOutput = dWallet.state.Active.public_output instanceof Uint8Array
    ? dWallet.state.Active.public_output
    : new Uint8Array(dWallet.state.Active.public_output);

  console.log("\n=== Solana Public Key Derivation ===");
  console.log("dWalletPublicOutput length:", dWalletPublicOutput.length);
  console.log("dWalletPublicOutput hex:", Buffer.from(dWalletPublicOutput).toString("hex"));

  // For Ed25519, publicKeyFromDWalletOutput returns a 32-byte public key
  const publicKey = await publicKeyFromDWalletOutput(
    Curve.ED25519,
    dWalletPublicOutput,
  );
  console.log("publicKey length:", publicKey.length);
  console.log("publicKey hex:", Buffer.from(publicKey).toString("hex"));

  // Convert to Solana PublicKey (32 bytes → base58)
  const solanaFromPubkey = new PublicKey(publicKey);
  console.log("Solana address (base58):", solanaFromPubkey.toBase58());

  // Check SOL balance
  const balance = await connection.getBalance(solanaFromPubkey);
  console.log("Balance:", balance / LAMPORTS_PER_SOL, "SOL");

  // === Transaction 1: SOL Transfer ===
  console.log("\n=== SOL Transfer via Ika ===");
  {
    const { tx, messageBytes } = await buildUnsignedSOLTransfer(
      connection,
      solanaFromPubkey,
      RECIPIENT,
      SOL_TRANSFER_LAMPORTS,
    );

    // 1) Create sign request on Ika
    const { signObjectId } = await ikaSignBytes(
      suiClient,
      ikaClient,
      messageBytes,
      executeTransaction,
      signerAddress,
    );

    if (!signObjectId) {
      throw new Error("Sign object id not found in transaction results");
    }

    // 2) Wait for signature from Ika
    const rawSig = await fetchIkaSignature(ikaClient, signObjectId);

    // 3) Attach signature and broadcast to Solana
    const txid = await broadcastSignedSolanaTx(connection, tx, solanaFromPubkey, rawSig);
    console.log("SOL Transfer txid:", txid);
  }

  // === Transaction 2: Memo (like simpleContract) ===
  console.log("\n=== Memo via Ika ===");
  {
    const memoText = `Hello from Ika dWallet! Timestamp: ${Date.now()}`;
    const { tx, messageBytes } = await buildUnsignedMemoTx(
      connection,
      solanaFromPubkey,
      memoText,
    );

    const { signObjectId } = await ikaSignBytes(
      suiClient,
      ikaClient,
      messageBytes,
      executeTransaction,
      signerAddress,
    );

    if (!signObjectId) {
      throw new Error("Sign object id not found in transaction results");
    }

    const rawSig = await fetchIkaSignature(ikaClient, signObjectId);
    const txid = await broadcastSignedSolanaTx(connection, tx, solanaFromPubkey, rawSig);
    console.log("Memo txid:", txid);

    // Read back the memo
    console.log("\nWaiting for transaction to finalize...");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const txData = await connection.getTransaction(txid, {
      maxSupportedTransactionVersion: 0,
    });
    const logs = txData?.meta?.logMessages ?? [];
    for (const log of logs) {
      const match = log.match(/Memo \(len \d+\): "(.+)"/);
      if (match?.[1]) {
        console.log("Memo content:", match[1]);
      }
    }
  }
}

main().catch(console.error);
