import { Box, Typography } from "@mui/material";
import { useState } from "react";
import MenuItem from "./MenuItem";
import BattleStartMenu from "./BattleStartMenu";

// Render <StartBattle /> menu
// When user clicks E on Attack or Run, those "buttons" will have the ability
// to decide what menu is shown next, or what happens next.

export default function BattleMenu() {
    const [showStartBattleMenu, setShowStartBattleMenu] =
        useState<boolean>(false);

    return (
        <Box
            sx={{
                position: "absolute",
                width: 100,
                height: 150,
                right: "60%",
                // backgroundColor: "rgba(53, 52, 49, 0.5)",
                // border: "1px solid white",
            }}
        >
            <BattleStartMenu />
        </Box>
    );
}

