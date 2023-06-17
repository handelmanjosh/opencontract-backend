import { Keypair, PublicKey } from "@solana/web3.js";
import { Event } from "../types";
import { sendSol } from "../sol";
import { sendToken } from "../token";


export async function completeEvent(recipient: string, amount: number, tokenAddress: string) {
    if (tokenAddress === "SOL") {
        await sendSol(amount, recipient);
    } else {
        await sendToken(tokenAddress, recipient, amount);
    }
}