import { useAppSelector } from '../store';
import { Box, Typography } from '@mui/material';


export default function Inventory() {

    const inventory = Object.values(useAppSelector((state) => state.player.inventory));

    return (
        <Box sx={{
            width: 200,
            height: 300,
            position: "absolute",
            right: "52%",
            backgroundColor: "rgba(53, 52, 49, 0.5)",
            border: "1px solid white",
        }}>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 1,
                borderBottom: "1px solid white"
            }}>
                <Typography>Item</Typography>
                <Typography>Quantity</Typography>
            </Box>
            {inventory.map((item) =>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 1
                }}
                    key={item.name}>
                    <Typography>{item.name}</Typography>
                    <Typography>{item.quantity}</Typography>
                </Box>
            )}
        </Box>
    )
}