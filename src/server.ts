import * as express from 'express';
import * as solanaWeb3 from '@solana/web3.js';
import { checkMovementEvent, createMovementEvent } from './utils/events/movementEvent';
import { getTransactionHistory } from './utils/utils';
import { Event, MovementEvent, ValueEvent } from './utils/types';
import { createValueEvent } from './utils/events/valueEvent';
require('dotenv').config();
//import { getTransactionHistory, testNetwork } from './utils/utils';


const app = express();
const port = 3000;
const tracked: Event[] = [];

async function server() {
  tracked.forEach(async (event: Event, i: number) => {
    if (event.type === "MovementEvent") {
      const status = await checkMovementEvent(event);
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

app.post("/create", async (req, res) => {
  try {
    const { type, toAccount, fromAccount, tokenAddress, amount, reward, rewardTokenAddress, isRewardSol, isSol, negative, time } = req.body;
    if (type === "Value") {
      const event: ValueEvent | null = await createValueEvent(toAccount, fromAccount, tokenAddress, Number(amount), Number(reward), rewardTokenAddress, isRewardSol, isSol, negative, Number(time));
      if (event) {
        res.status(200).json({ message: "success" });
      } else {
        res.status(403).json({ message: "Invalid input" });
      }

    } else if (type === "Movement") {
      const event: MovementEvent | null = await createMovementEvent(toAccount, fromAccount, tokenAddress, Number(amount), Number(reward), rewardTokenAddress, isRewardSol, isSol, negative, Number(time));
      if (event) {
        res.status(200).json({ message: "success" });
      } else {
        res.status(403).json({ message: "Invalid input" });
      }
    } else {
      res.status(404).json({ message: "Method not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
