import { MovementEvent } from "../types";
import { getAnyTokenHistory, getTransactionHistory } from "../utils";
import prisma from "../../../prisma/seed";

export async function checkMovementEvent(event: MovementEvent): Promise<boolean> {
    let func: (...args: any[]) => any;
    if (event.tokenAddress == "SOL") {
        func = getTransactionHistory;
    } else {
        func = getAnyTokenHistory;
    }
    if (event.payee && event.payer) {
        const transactions = await func(event.payee);
        for (const transaction of transactions) {
            if (event.payer !== transaction.address) continue;
            if (event.tokenAddress == "SOL") {
                if (event.amount < 0) {
                    event.amount = event.amount + transaction.changeAmount > 0 ? 0 : event.amount + transaction.changeAmount;
                } else {
                    event.amount = event.amount - transaction.changeAmount < 0 ? 0 : event.amount - transaction.changeAmount;
                }
            } else if (event.tokenAddress == transaction.tokenAddress) {
                if (event.amount < 0) {
                    event.amount = event.amount + transaction.changeAmount > 0 ? 0 : event.amount + transaction.changeAmount;
                } else {
                    event.amount = event.amount - transaction.changeAmount < 0 ? 0 : event.amount - transaction.changeAmount;
                }
            }
        }
        //check movement of funds from payee to payer
    } else if (event.payee) {
        const transactions = await func(event.payee);
        for (const transaction of transactions) {
            if (transaction.changeType == "dec") {
                if (event.tokenAddress == "SOL") {
                    event.amount -= transaction.changeAmount;
                } else if (event.tokenAddress == transaction.tokenAddress) {
                    event.amount -= transaction.changeAmount;
                }
            }
        }
        //check movement of funds to payee
    } else if (event.payer) {
        const transactions = await func(event.payer);
        for (const transaction of transactions) {
            if (transaction.changeType == "inc") {
                if (event.tokenAddress == "SOL") {
                    event.amount -= transaction.changeAmount;
                } else if (event.tokenAddress == transaction.tokenAddress) {
                    event.amount -= transaction.changeAmount;
                }
            }
        }
        //check movement of funds from payer
    } else {
        return true;
    }
    if (event.direction == "decrease") {
        if (event.amount > 0) {
            return true;
        }
    } else {
        if (event.amount < 0) {
            return false;
        }
    }
    return false;
}

//rpc websocket api
export async function createMovementEvent(toAccount: string, fromAccount: string, tokenAddress: string, amount: number, reward: number, rewardTokenAddress: string, isRewardSol: boolean, isSol: boolean, negative: boolean, time: number) {
    try {
        if ((tokenAddress || isSol) && (rewardTokenAddress || isRewardSol) && (toAccount || fromAccount)) {
            const movementEvent: MovementEvent = {
                type: "MovementEvent",
                payer: fromAccount,
                payee: toAccount,
                amount,
                reward,
                direction: negative ? "decrease" : "increase",
                tokenAddress: tokenAddress || "SOL",
                rewardTokenAddress: rewardTokenAddress || "SOL",
                onEnd: () => { },
                time: time
            };
            await prisma.movementEvent.create({
                data: {
                    amount: movementEvent.amount,
                    direction: movementEvent.direction,
                    payee: movementEvent.payee,
                    payer: movementEvent.payer,
                    reward: movementEvent.reward,
                    rewardTokenAddress: movementEvent.rewardTokenAddress,
                    time: movementEvent.time,
                    tokenAddress: movementEvent.tokenAddress,
                }
            });
            return movementEvent;
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}