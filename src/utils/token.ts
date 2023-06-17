import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";

const privateKey = [161, 252, 239, 80, 65, 12, 83, 53, 21, 110, 240, 74, 14, 97, 54, 102, 59, 139, 235, 2, 179, 232, 198, 91, 24, 233, 152, 128, 77, 214, 164, 72, 22, 223, 220, 92, 49, 144, 125, 135, 179, 252, 24, 20, 232, 154, 82, 119, 206, 0, 36, 152, 226, 206, 151, 69, 220, 246, 211, 91, 86, 38, 197, 93];
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export async function sendToken(mint: string, address: string, amount: number) {
    const fromWallet = Keypair.fromSecretKey(new Uint8Array(privateKey));
    const toWallet = new PublicKey(address);
    const mintKey = new PublicKey(mint);
    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mintKey, fromWallet.publicKey);
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(connection, fromWallet, mintKey, toWallet);
    console.log(`Sending user ${amount * LAMPORTS_PER_SOL} tokens`);
    const signature = await transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        amount * LAMPORTS_PER_SOL
    );
    console.log(`Signature: ${signature}`);
}