import wallet from "./wallet/dev-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

// Create a devnet connection
const umi = createUmi("https://api.devnet.solana.com");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
  try {
    // Follow this JSON structure
    // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

    const image = "https://devnet.irys.xyz/Ch32GZUqn278jRGjGsa6S1YWYTfJww2e2FUsShW8U8pK";
    const metadata = {
      name: "GenRUG",
      symbol: "GRG$",
      description: "A cool mint",
      image: "?",
      attributes: [{ trait_type: "color", value: "green" }],
      properties: {
        files: [
          {
            type: "image/png",
            uri: image,
          },
        ],
      },
      creators: [],
    };
    const myUri = await umi.uploader.uploadJson(metadata);
    console.log("Your metadata URI: ", myUri); // https://arweave.net/DKaaY7LRkyAnphW9TDJztiPB6kdSXdMXViHLEx1Q2ZUC // https://devnet.irys.xyz/DKaaY7LRkyAnphW9TDJztiPB6kdSXdMXViHLEx1Q2ZUC
  } catch (error) {
    console.log("Oops.. Something went wrong", error);
  }
})();
