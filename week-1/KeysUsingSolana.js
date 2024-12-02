import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";

const keypair= Keypair.generate();

const publicKey=keypair.publicKey.toString();
const secertKey=keypair.secretKey;
console.log(publicKey);
console.log(secertKey);


const message = new TextEncoder().encode("Hello Web3");

const signature = nacl.sign.detached(message,secertKey);

const isVerified = nacl.sign.detached.verify(message,signature,keypair.publicKey.toBytes());

console.log(signature);
console.log(isVerified);

