import "dotenv/config";
import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction, } from "@solana/web3.js";
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
// Memo Program — deployed on all Solana clusters
const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
async function writeMemo(message) {
    console.log("--- Write Memo (like setValue) ---");
    console.log("Sender:", sender.publicKey.toBase58());
    console.log("Memo:", message);
    const tx = new Transaction().add(new TransactionInstruction({
        keys: [{ pubkey: sender.publicKey, isSigner: true, isWritable: true }],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(message, "utf-8"),
    }));
    const signature = await sendAndConfirmTransaction(connection, tx, [sender]);
    console.log("Signature:", signature);
    console.log(`Explorer: https://explorer.solana.com/tx/${signature}?cluster=testnet`);
    return signature;
}
async function readMemo(signature) {
    console.log("\n--- Read Memo (like getValue) ---");
    console.log("Fetching tx:", signature);
    const tx = await connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
    });
    if (!tx) {
        console.log("Transaction not found (may need more time to finalize).");
        return null;
    }
    console.log("Status:", tx.meta?.err ? "Failed" : "Success");
    // The memo appears in the log messages
    const logs = tx.meta?.logMessages ?? [];
    const memoPrefix = "Program log: Memo (len ";
    for (const log of logs) {
        if (log.startsWith(memoPrefix)) {
            // Format: 'Program log: Memo (len <N>): "<message>"'
            const match = log.match(/Memo \(len \d+\): "(.+)"/);
            if (match?.[1]) {
                console.log("Memo content:", match[1]);
                return match[1];
            }
        }
    }
    // Fallback: check raw log lines for the memo text
    for (const log of logs) {
        if (log.startsWith("Program log: ") && !log.includes("Program ")) {
            const content = log.replace("Program log: ", "");
            console.log("Memo content:", content);
            return content;
        }
    }
    console.log("Could not parse memo from logs.");
    console.log("Logs:", logs);
    return null;
}
async function main() {
    const message = `Hello from Solana! Timestamp: ${Date.now()}`;
    // Write — send a memo on-chain (like setValue)
    const signature = await writeMemo(message);
    // Small delay to allow finalization
    console.log("\nWaiting for transaction to finalize...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Read — fetch the memo back from the transaction (like getValue)
    await readMemo(signature);
}
main().catch(console.error);
