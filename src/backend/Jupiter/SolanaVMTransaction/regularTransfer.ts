import "dotenv/config";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token";
import bs58 from "bs58";
import * as dotenv from 'dotenv';
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const SOLANA_PRIVATE_KEY = process.env.SOLANA_PRIVATE_KEY;
if (!SOLANA_PRIVATE_KEY) {
    throw new Error('SOLANA_PRIVATE_KEY is not set');
}
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL;
if (!SOLANA_RPC_URL) {
    throw new Error('SOLANA_RPC_URL is not set');
}
const connection = new Connection(SOLANA_RPC_URL, "confirmed");
const sender = Keypair.fromSecretKey(bs58.decode(SOLANA_PRIVATE_KEY));
// ✅ Fill these in
const RECIPIENT = new PublicKey(
  "11111111111111111111111111111111" // replace with actual recipient
);
// SPL token mint address on testnet (set to a real mint or leave as-is to skip)
const TOKEN_MINT: string | null = null;

const SOL_TRANSFER_AMOUNT = 0.01 * LAMPORTS_PER_SOL;

async function transferSOL() {
  console.log("--- SOL Transfer ---");
  console.log("Sender:", sender.publicKey.toBase58());

  const balance = await connection.getBalance(sender.publicKey);
  console.log("Balance:", balance / LAMPORTS_PER_SOL, "SOL");

  if (balance < SOL_TRANSFER_AMOUNT) {
    console.log("Insufficient SOL balance. Request airdrop from https://faucet.solana.com/");
    return;
  }

  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: RECIPIENT,
      lamports: SOL_TRANSFER_AMOUNT,
    })
  );

  const signature = await sendAndConfirmTransaction(connection, tx, [sender]);
  console.log("Signature:", signature);
  console.log(
    `Explorer: https://explorer.solana.com/tx/${signature}?cluster=testnet`
  );
}

async function transferSPLToken() {
  if (!TOKEN_MINT) {
    console.log("\n--- SPL Token Transfer ---");
    console.log("Skipped: TOKEN_MINT not set. Set it to a testnet mint address to enable.");
    return;
  }

  console.log("\n--- SPL Token Transfer ---");
  const mint = new PublicKey(TOKEN_MINT);

  const senderATA = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    mint,
    sender.publicKey
  );
  console.log("Sender ATA:", senderATA.address.toBase58());
  console.log("Token balance:", senderATA.amount.toString());

  const recipientATA = await getOrCreateAssociatedTokenAccount(
    connection,
    sender, // payer
    mint,
    RECIPIENT
  );
  console.log("Recipient ATA:", recipientATA.address.toBase58());

  const TRANSFER_AMOUNT = 1_000_000n; // adjust decimals to match your mint
  const signature = await transfer(
    connection,
    sender,
    senderATA.address,
    recipientATA.address,
    sender,
    TRANSFER_AMOUNT
  );
  console.log("Signature:", signature);
  console.log(
    `Explorer: https://explorer.solana.com/tx/${signature}?cluster=testnet`
  );
}

async function main() {
  await transferSOL();
  await transferSPLToken();
}

main().catch(console.error);
