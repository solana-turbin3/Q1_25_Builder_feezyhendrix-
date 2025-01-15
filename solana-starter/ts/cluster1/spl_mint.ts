import { Keypair, Connection, Commitment, PublicKey } from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import wallet from "./wallet/dev-wallet.json";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

const mint = new PublicKey("7rNuxQjrCssKwDy5njGS1ZuGoA3VydDnSgiKcpc2CWNB");

(async () => {
  try {
    // Start here
    const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);

    const mint_to_ata = await mintTo(connection, keypair, mint, ata.address, keypair.publicKey, 329303992039);

    console.log(`associated token account address: ${ata.address}`);
    console.log(`Mint to ata address: ${mint_to_ata}`);
  } catch (error) {
    console.log(`Oops, something went wrong: ${error}`);
  }
})();
