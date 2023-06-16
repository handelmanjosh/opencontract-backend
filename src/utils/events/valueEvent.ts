import axios from "axios";
import { ValueEvent } from "../types";
import prisma from '../../../prisma/seed';

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
                if (event.direction == "decrease") {
                    if (token.lamports < event.amount) {
                        return true;
                    }
                } else if (token.lamports > event.amount) {
                    return true;
                }
            }
        } else if (token.tokenAddress == event.tokenAddress) {
            if (event.direction == "decrease") {
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
            const valueEvent: ValueEvent = {
                type: "ValueEvent",
                address: toAccount || fromAccount,
                tokenAddress: tokenAddress || "SOL",
                amount,
                reward,
                direction: negative ? "decrease" : "increase",
                rewardTokenAddress: rewardTokenAddress || "SOL",
                onEnd: () => console.log("Value contract ended"),
                time
            };
            await prisma.valueEvent.create({
                data: {
                    address: valueEvent.address,
                    amount: valueEvent.amount,
                    direction: valueEvent.direction,
                    reward: valueEvent.reward,
                    rewardTokenAddress: valueEvent.rewardTokenAddress,
                    time: valueEvent.time,
                    tokenAddress: valueEvent.tokenAddress
                }
            });
            console.log(valueEvent);
            return valueEvent;
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}