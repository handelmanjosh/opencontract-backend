import * as express from 'express';
import * as solanaWeb3 from '@solana/web3.js';
import { checkTransactionEvent } from './utils/events/transactionEvent';
import { getTransactionHistory } from './utils/utils';
require('dotenv').config();
//import { getTransactionHistory, testNetwork } from './utils/utils';
type Event = TransactionEvent | ValueEvent;

export type TransactionEvent = {
  type: "TransactionEvent";
  payer?: string;
  payee?: string;
  amount: number;
  changeType: "dec" | "acc";
  tokenAddress: string;
  onEnd: () => any;
  time: number;
};

export type ValueEvent = {
  type: "ValueEvent";
  address: string;
  amount: number;
  direction: "below" | "above";
  tokenAddress: string;
  onEnd: () => any;
  time: number;
};

const app = express();
const port = 3000;
const tracked: Event[] = [];

async function server() {
  tracked.forEach(async (event: Event, i: number) => {
    if (event.type === "TransactionEvent") {
      const status = await checkTransactionEvent(event);
      event.time--;
      if (status) {
        event.onEnd();
        tracked.splice(i, 1);
      } else if (event.time < 0) {
        tracked.splice(i, 1);
      }
    } else if (event.type === "ValueEvent") {

    }
  });
}


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.post("/contract", (req, res) => {
  const { stuff } = req.body;
  res.status(200).json({ message: "success" });
});
