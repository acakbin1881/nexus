import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

/**
 * Build an unsigned SOL transfer transaction.
 * Returns the Transaction object and the serialized message bytes
 * that need to be signed by Ika (Ed25519).
 */
export async function buildUnsignedSOLTransfer(
  connection: Connection,
  from: PublicKey,
  to: PublicKey,
  lamports: number
) {
  console.log("from:", from.toBase58());
  console.log("to:", to.toBase58());
  console.log("lamports:", lamports);

  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: from,
      toPubkey: to,
      lamports,
    })
  );

  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.feePayer = from;

  // Serialize the message — this is what Ed25519 signs
  const messageBytes = tx.serializeMessage();
  console.log("messageBytes length:", messageBytes.length);

  return { tx, messageBytes };
}

/**
 * Build an unsigned Memo transaction (like simpleContract setValue).
 */
export async function buildUnsignedMemoTx(
  connection: Connection,
  from: PublicKey,
  memoText: string
) {
  console.log("from:", from.toBase58());
  console.log("memo:", memoText);

  const tx = new Transaction().add(
    new TransactionInstruction({
      keys: [{ pubkey: from, isSigner: true, isWritable: true }],
      programId: MEMO_PROGRAM_ID,
      data: Buffer.from(memoText, "utf-8"),
    })
  );

  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.feePayer = from;

  const messageBytes = tx.serializeMessage();
  console.log("messageBytes length:", messageBytes.length);

  return { tx, messageBytes };
}
