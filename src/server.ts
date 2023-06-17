import * as express from 'express';
import * as solanaWeb3 from '@solana/web3.js';
import { checkMovementEvent, createMovementEvent } from './utils/events/movementEvent';
import { getTransactionHistory } from './utils/utils';
import { BountyEvent, Event, MovementEvent, ValueEvent } from './utils/types';
import { createValueEvent } from './utils/events/valueEvent';
import * as cors from 'cors';
import prisma from '../prisma/seed';
import { createBountyEvent } from './utils/events/bountyEvent';
require('dotenv').config();
//import { getTransactionHistory, testNetwork } from './utils/utils';


const app = express();
app.use(cors());
app.use(express.json());

const port = 3005;
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
    console.log("created a contract");
    const { type, toAccount, fromAccount, tokenAddress, amount, reward, rewardTokenAddress, isRewardSol, isSol, negative, numberOfContracts, time } = req.body;
    if (type === "Value") {
      const event: ValueEvent | null = await createValueEvent(toAccount, fromAccount, tokenAddress, Number(amount), Number(reward), rewardTokenAddress, isRewardSol, isSol, negative, Number(time));
      console.log(event);
      if (event) {
        res.status(200).json({ message: "success" });
      } else {
        res.status(404).json({ message: "Invalid input" });
      }

    } else if (type === "Movement") {
      const event: MovementEvent | null = await createMovementEvent(toAccount, fromAccount, tokenAddress, Number(amount), Number(reward), rewardTokenAddress, isRewardSol, isSol, negative, Number(time));
      console.log(event);
      if (event) {
        res.status(200).json({ message: "success" });
      } else {
        res.status(404).json({ message: "Invalid input" });
      }
    } else if (type === 'Bounty') {
      const event: BountyEvent | null = await createBountyEvent(Number(numberOfContracts), Number(amount), Number(reward), negative, tokenAddress, isSol, rewardTokenAddress, isRewardSol, Number(time));
      console.log(event);
      if (event) {
        res.status(200).json({ message: "success" });
      } else {
        res.status(404).json({ message: "Invalid input" });
      }
    } else {
      res.status(404).json({ message: "Method not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/public", async (req, res) => {
  try {
    const bounties = await prisma.bountyEvent.findMany();
    console.log("bounties: ", bounties);
    res.status(200).send({ events: bounties });
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/claim", async (req, res) => {
  try {
    const { address, id } = req.body;
    const contract = await prisma.bountyEvent.findUnique({
      where: {
        id,
      }
    });
    if (contract) {
      const addressOnContract = await prisma.address.findFirst({
        where: {
          address,
          bountyEventId: id,
        }
      });
      if (addressOnContract) {
        res.status(404).json({ message: "Address already claimed" });
      } else {
        await prisma.bountyEvent.update({
          where: {
            id,
          },
          data: {
            addresses: {
              connect: {
                id: addressOnContract.id,
              }
            }
          }
        });
        res.status(200).json({ message: "success" });
      }
    } else {
      res.status(404).json({ message: "Contract not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

