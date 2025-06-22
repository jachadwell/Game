

export type TMapNames = 'basic-house' | 'basic-house-one-interrior' | 'basic-house-two-interrior';

export type TKeyMapping = {
    W: Phaser.Input.Keyboard.Key,
    A: Phaser.Input.Keyboard.Key,
    S: Phaser.Input.Keyboard.Key,
    D: Phaser.Input.Keyboard.Key,
    E: Phaser.Input.Keyboard.Key,
}

export type TInventoryItem = {
    name: string;
    quantity: number
}

export type TQuest = {
    id: string;
    title: string;
    prerequisites?: {};
    requirements?: {
        items: TInventoryItem[]
    };
    status: "idle" | "active" | "complete";
}

export type TPlayerInventory = Record<string, TInventoryItem>;