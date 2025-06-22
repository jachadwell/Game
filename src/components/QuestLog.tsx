import QuestLogItem from "./QuestLogItem";
import { Box, Typography } from "@mui/material";

import { selectActiveQuests } from "@/features/world/worldSelectors"
import { useAppSelector } from "@/store"

export default function QuestLog() {
    const activeQuests = useAppSelector(selectActiveQuests);
    return (
        <Box sx={{
            position: "absolute",
            right: 100,
            top: "20%",
        }}>
            <Typography><u>Quest Log</u></Typography>
            {activeQuests.map((quest: any) => (
                <Box key={quest.title} sx={{ my: 2 }}>
                    <Typography>{quest.title}</Typography>
                    {quest.requirements.items.map((item: any) => (
                        <QuestLogItem key={`${quest.title}.${item.name}`} item={item} />
                    ))}
                </Box>
            ))}
        </Box>
    )
}