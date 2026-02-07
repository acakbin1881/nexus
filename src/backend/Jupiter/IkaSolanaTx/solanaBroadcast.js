import { Connection, PublicKey, Transaction } from "@solana/web3.js";
/**
 * Attach an Ed25519 signature (from Ika) to a Solana transaction and broadcast it.
 *
 * @param connection - Solana RPC connection
 * @param tx         - The unsigned Transaction object (must have recentBlockhash + feePayer set)
 * @param fromPubkey - The public key that "signed" via Ika dWallet
 * @param rawSig     - 64-byte Ed25519 signature from Ika
 */
export async function broadcastSignedSolanaTx(connection, tx, fromPubkey, rawSig) {
    console.log("[Debug] rawSig length:", rawSig.length);
    console.log("[Debug] rawSig hex:", Buffer.from(rawSig).toString("hex"));
    if (rawSig.length !== 64) {
        throw new Error(`Expected 64-byte Ed25519 signature, got ${rawSig.length} bytes`);
    }
    // Attach the signature to the transaction
    tx.addSignature(fromPubkey, Buffer.from(rawSig));
    // Serialize the fully-signed transaction
    const rawTx = tx.serialize();
    console.log("[Debug] rawTx length:", rawTx.length);
    // Send and confirm
    const txid = await connection.sendRawTransaction(rawTx, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
    });
    console.log("Broadcast txid:", txid);
    console.log(`Explorer: https://explorer.solana.com/tx/${txid}?cluster=testnet`);
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(txid, "confirmed");
    if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
    }
    console.log("Transaction confirmed.");
    return txid;
}
