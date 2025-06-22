import questManager from "@/game/Classes/QuestManager";
import { EventBus } from "@/game/EventBus";
import { TQuest } from "@/game/Types/types";

export type Props = {
    dialog: string;
    readyQuest: TQuest | null;
    completeQuest: TQuest | null;
}

export default function Dialog({ dialog, completeQuest, readyQuest }: Props) {

    return (<div style={{
        width: "80%",
        height: 100,
        backgroundColor: "rgba(53, 49, 49, 0.5)",
        position: "absolute",
        bottom: 40,
        padding: 30,
        border: "1px solid white",
    }}>
        <p>{dialog}</p>
        {readyQuest && (
            <button onClick={() => {
                questManager.acceptQuest(readyQuest.id)
                EventBus.emit("toggle-dialog-off")
            }}>Accept Quest</button>
        )}
        {completeQuest && (
            <button onClick={() => {
                questManager.completeQuest(completeQuest.id)
                EventBus.emit("toggle-dialog-off")
            }}>Complete Quest</button>
        )}
    </div>)
}