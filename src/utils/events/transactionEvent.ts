import { TransactionEvent } from "../../server";
import { getAnyTokenHistory, getTransactionHistory } from "../utils";

export async function checkTransactionEvent(event: TransactionEvent): Promise<boolean> {
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
    if (event.changeType == "dec") {
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