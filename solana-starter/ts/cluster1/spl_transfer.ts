import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import wallet from "./wallet/dev-wallet.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("7rNuxQjrCssKwDy5njGS1ZuGoA3VydDnSgiKcpc2CWNB");

// Recipient address
const to = new PublicKey("QNUfNMaB8dEWGrW3pWw7YEoSg6akdfdcRqV6y4zNSvz");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);

    // Get the token account of the toWallet address, and if it does not exist, create it
    const tokenAcc = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, to);
    // Transfer the new token to the "toTokenAccount" we just created
    const tx = await transfer(connection, keypair, ata.address, tokenAcc.address, keypair.publicKey, 99999999);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
