import { Box, Typography } from "@mui/material";

type Props = {
    text: string;
    selected?: boolean;
};

export default function MenuItem({ text, selected = false }: Props) {
    return (
        <Box
            sx={{
                display: "flex",
                backgroundColor: selected ? "rgba(170, 170, 170, 0.3)" : "",
            }}
        >
            <Typography>{text}</Typography>
        </Box>
    );
}

