import axios from "axios";
import { ValueEvent } from "../types";


export async function checkValueEvent(event: ValueEvent): Promise<boolean> {
    const response = await axios.get(`https://public-api.solscan.io/account/tokens?account=${event.address}`,
        {
            headers: {
                "accept": "application/json",
                'token': process.env.SOLSCAN_API_KEY
            }
        }
    );
    for (const token of response.data) {
        if (event.tokenAddress == "SOL") {
            if (token.tokenSymbol == "SOL") {
                if (event.direction == "below") {
                    if (token.lamports < event.amount) {
                        return true;
                    }
                } else if (token.lamports > event.amount) {
                    return true;
                }
            }
        } else if (token.tokenAddress == event.tokenAddress) {
            if (event.direction == "below") {
                if (token.tokenAmount.uiAmount < event.amount) {
                    return true;
                }
            } else if (token.tokenAmount.uiAmount > event.amount) {
                return true;
            }
        }
    }
    return false;
}

export async function createValueEvent(toAccount: string, fromAccount: string, tokenAddress: string, amount: number, reward: number, rewardTokenAddress: string, isRewardSol: boolean, isSol: boolean, negative: boolean, time: number) {
    try {
        if ((toAccount || fromAccount) && (tokenAddress || isSol) && (rewardTokenAddress || isRewardSol) && time > 0) {

        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}