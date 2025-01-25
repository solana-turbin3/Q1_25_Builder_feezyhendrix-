import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "./wallet/dev-wallet.json";
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata());

const mint = generateSigner(umi);

(async () => {
  const imageUri = "https://devnet.irys.xyz/Ch32GZUqn278jRGjGsa6S1YWYTfJww2e2FUsShW8U8pK";
  let tx = createNft(umi, {
    mint,
    uri: imageUri,
    name: "Genrug",
    symbol: "GEG$",
    sellerFeeBasisPoints: percentAmount(10),
  });
  let result = await tx.sendAndConfirm(umi);
  const signature = base58.encode(result.signature);

  console.log(
    `Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
  );

  // https://explorer.solana.com/tx/36su8KsPEVq2zB7KnjzRmXQybjfp951T5doyWLSKEAeN1PaaUk2xiJbFvDeoAufw1M6bwtszwMsyj7bYmDpXJeDw?cluster=devnet

  console.log("Mint Address: ", mint.publicKey);
})();
