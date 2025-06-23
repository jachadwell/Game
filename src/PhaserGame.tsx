import {
    forwardRef,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import StartGame from "./game/main";
import { EventBus } from "./game/EventBus";
import Inventory from "./components/Inventory";
import ObjectInventory from "./components/ObjectInventory";
import Dialog from "./components/Dialog";
import QuestLog from "./components/QuestLog";
import { TQuest } from "./game/Types/types";
import { Box, Typography } from "@mui/material";
import BattleMenu from "./components/Battle/BattleMenu";

export interface IRefPhaserGame {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps {
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
    function PhaserGame({ currentActiveScene }, ref) {
        const game = useRef<Phaser.Game | null>(null!);

        const [showInventory, setShowInventory] = useState<boolean>(false);
        const [showDialog, setShowDialog] = useState<boolean>(false);
        const [dialog, setDialog] = useState<string>("");
        const [readyQuest, setReadyQuest] = useState<TQuest | null>(null);
        const [completeQuest, setCompleteQuest] = useState<TQuest | null>(null);

        useLayoutEffect(() => {
            if (game.current === null) {
                game.current = StartGame("game-container");

                if (typeof ref === "function") {
                    ref({ game: game.current, scene: null });
                } else if (ref) {
                    ref.current = { game: game.current, scene: null };
                }
            }

            return () => {
                if (game.current) {
                    game.current.destroy(true);
                    if (game.current !== null) {
                        game.current = null;
                    }
                }
            };
        }, [ref]);

        useEffect(() => {
            EventBus.on(
                "current-scene-ready",
                (scene_instance: Phaser.Scene) => {
                    if (
                        currentActiveScene &&
                        typeof currentActiveScene === "function"
                    ) {
                        currentActiveScene(scene_instance);
                    }

                    if (typeof ref === "function") {
                        ref({ game: game.current, scene: scene_instance });
                    } else if (ref) {
                        ref.current = {
                            game: game.current,
                            scene: scene_instance,
                        };
                    }
                }
            );
            return () => {
                EventBus.removeListener("current-scene-ready");
            };
        }, [currentActiveScene, ref]);

        useEffect(() => {
            const toggleInventory = () =>
                setShowInventory((showInventory) => !showInventory);
            EventBus.on("toggle-inventory", toggleInventory);
            return () => {
                EventBus.off("toggle-inventory", toggleInventory);
            };
        });

        useEffect(() => {
            const toggleDialog = (data: {
                dialog?: string;
                completeQuest: TQuest | null;
                readyQuest: TQuest | null;
            }) => {
                setShowDialog((showDialog) => !showDialog);
                setDialog(data.dialog ?? "");
                setReadyQuest(data.readyQuest ?? null);
                setCompleteQuest(data.completeQuest ?? null);
            };
            const toggleDialogOff = () => {
                setShowDialog(false);
                setReadyQuest(null);
                setCompleteQuest(null);
            };
            EventBus.on("toggle-dialog", toggleDialog);
            EventBus.on("toggle-dialog-off", toggleDialogOff);
            return () => {
                EventBus.off("toggle-dialog", toggleDialog);
                EventBus.off("toggle-dialog-off", toggleDialogOff);
            };
        });

        return (
            <>
                <QuestLog />
                {showInventory && <Inventory />}
                {showDialog && (
                    <Dialog
                        dialog={dialog}
                        completeQuest={completeQuest}
                        readyQuest={readyQuest}
                    />
                )}
                <ObjectInventory />
                <BattleMenu />
                <div id="game-container"></div>
            </>
        );
    }
);
