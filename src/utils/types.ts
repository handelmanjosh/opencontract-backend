export type Event = MovementEvent | ValueEvent;

export type MovementEvent = {
    type: "MovementEvent";
    payer?: string;
    payee?: string;
    amount: number;
    reward: number;
    direction: "decrease" | "increase";
    tokenAddress: string;
    rewardTokenAddress: string;
    onEnd: () => any;
    time: number;
};

export type ValueEvent = {
    type: "ValueEvent";
    address: string;
    amount: number;
    reward: number;
    direction: "decrease" | "increase";
    tokenAddress: string;
    rewardTokenAddress: string;
    onEnd: () => any;
    time: number;
};