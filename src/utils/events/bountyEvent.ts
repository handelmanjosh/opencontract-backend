import prisma from "../../../prisma/seed";
import { BountyEvent } from "../types";




export async function createBountyEvent(numberOfContracts: number, amount: number, reward: number, negative: boolean, tokenAddress: string, isSol: boolean, rewardTokenAddress: string, isRewardSol: boolean, time: number) {
    try {
        const bountyEvent: BountyEvent = {
            type: "Bounty",
            addresses: [],
            amount,
            reward,
            direction: negative ? "decrease" : "increase",
            tokenAddress,
            rewardTokenAddress,
            numberOfContracts,
            onEnd: () => { },
            time
        };
        const ev = await prisma.bountyEvent.create({
            data: {
                amount: bountyEvent.amount,
                direction: bountyEvent.direction,
                reward: bountyEvent.reward,
                rewardTokenAddress: bountyEvent.rewardTokenAddress,
                time: bountyEvent.time,
                tokenAddress: bountyEvent.tokenAddress,
                numberOfContracts,
            }
        });
        console.log(ev);
        return bountyEvent;
    } catch (e) {
        console.error(e);
        return null;
    }
}