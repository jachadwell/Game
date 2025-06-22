import { TInventoryItem } from "@/game/Types/types";
import { Box, Typography } from "@mui/material"

import { useAppSelector } from "@/store";

type Props = {
    item: TInventoryItem;
}
export default function QuestLogItem({ item }: Props) {
    const inventory = Object.values(useAppSelector((state) => state.player.inventory));

    const getInventoryItemQuantity = (inventory: any) => {
        return inventory.find((inventoryItem: any) => inventoryItem.name === item.name)?.quantity ?? 0
    }

    return (
        <Box>
            <Typography>{item.name} {getInventoryItemQuantity(inventory)} / {item.quantity ?? "?"}</Typography>
        </Box>
    )
}