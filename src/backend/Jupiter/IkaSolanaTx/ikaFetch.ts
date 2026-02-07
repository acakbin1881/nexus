import { Curve, SignatureAlgorithm } from "@ika.xyz/sdk";
import type { IkaClient } from "@ika.xyz/sdk";

/**
 * Poll Ika until the sign request is Completed, then return the raw Ed25519 signature.
 */
export async function fetchIkaSignature(ikaClient: IkaClient, signObjectId: string) {
  console.log("[Debug] Fetching sign object:", signObjectId);
  const sign = await ikaClient.getSignInParticularState(
    signObjectId,
    Curve.ED25519,
    SignatureAlgorithm.EdDSA,
    "Completed",
  );

  console.log("[Debug] Sign state:", sign.state?.$kind);
  console.log("[Debug] Sign object full:", JSON.stringify(sign, (key, value) =>
    value instanceof Uint8Array ? `Uint8Array(${value.length}): ${Buffer.from(value).toString('hex').slice(0, 64)}...` : value, 2
  ));

  const rawSignature = Uint8Array.from(sign.state.Completed.signature);
  console.log("[Debug] Raw signature length:", rawSignature.length);
  return rawSignature; // 64 bytes for Ed25519
}
