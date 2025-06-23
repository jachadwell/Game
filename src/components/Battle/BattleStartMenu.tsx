import { Box } from "@mui/material";
import { useState, useRef } from "react";
import { EventBus } from "@/game/EventBus";
import {
    ControlledMenu,
    MenuItem,
    Menu,
    MenuButton,
    SubMenu,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/zoom.css";

// import MenuItem from "./MenuItem";

export default function BattleStartMenu() {
    const ref = useRef(null);
    return (
        <>
            <Box ref={ref}></Box>
            <ControlledMenu anchorRef={ref} state="open">
                <SubMenu label="Attack">
                    <MenuItem onClick={() => console.log("ATTACK")}>
                        Basic attack
                    </MenuItem>
                </SubMenu>
                <MenuItem onClick={() => console.log("Attempting to run!")}>
                    Run
                </MenuItem>
            </ControlledMenu>
        </>
    );
}

