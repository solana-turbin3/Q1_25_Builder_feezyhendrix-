import * as fs from "fs";
import { Keypair } from "@solana/web3.js";

const keypairPath = process.env.HOME + "/.config/solana/id.json"; // Adjust path if needed
const secretKey = JSON.parse(fs.readFileSync(keypairPath, "utf-8"));
const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));

console.log("Public Key:", keypair.publicKey.toBase58());
console.log("Private Key:", Array.from(keypair.secretKey.slice(0, 32)));
