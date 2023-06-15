import axios from "axios";
import { ValueEvent } from "../../server";


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