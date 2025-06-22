import questManager from "@/game/Classes/QuestManager";
import { EventBus } from "@/game/EventBus";

export type Props = {
    dialog: string;
    hasReadyQuest: boolean;
    readyQuestId?: string | null;
    hasCompleteQuest: boolean;
}

export default function Dialog({ dialog, hasReadyQuest, readyQuestId, hasCompleteQuest }: Props) {

    console.log("hasReadyQuest:", hasReadyQuest);
    console.log("readyQuestId:", readyQuestId)

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
        {hasReadyQuest && readyQuestId && (
            <button onClick={() => {
                questManager.acceptQuest(readyQuestId)
                EventBus.emit("toggle-dialog-off")
            }}>Accept Quest</button>
        )}
        {hasCompleteQuest && (
            <button onClick={() => {
                questManager.completeQuest("1")
                EventBus.emit("toggle-dialog-off")
            }}>Complete Quest</button>
        )}
    </div>)
}