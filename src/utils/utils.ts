import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import axios from 'axios';



export async function getTransactionHistory(address: string) {
    //gets 10 most recent transactions of address on mainnet
    try {
        const response = await axios.get('https://public-api.solscan.io/account/solTransfers?account=58V6myLoy5EVJA3U2wPdRDMUXpkwg8Vfw5b6fHqi2mEj&limit=10&offset=0',
            {
                headers: {
                    'accept': 'application/json',
                    'token': process.env.SOLSCAN_API_KEY,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error retrieving Solana transfers');
        return [];
    }
}

export async function getAnyTokenHistory(address: string, tokenAddress: string) {
    try {
        const response = await axios.get('https://public-api.solscan.io/account/splTransfers?account=58V6myLoy5EVJA3U2wPdRDMUXpkwg8Vfw5b6fHqi2mEj&limit=10&offset=0',
            {
                headers: {
                    "accept": "application/json",
                    "token": process.env.SOLSCAN_API_KEY
                }
            }
        );
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
}



