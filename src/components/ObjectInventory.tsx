import { useEffect, useState } from 'react';
import store from '../store';
import { Box, Typography, ButtonBase } from '@mui/material';
import { EventBus } from "../game/EventBus";

export default function ObjectInventory() {

    const [id, setId] = useState<string>("");
    const [popupVisible, setPopupVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [items, setItems] = useState<{ name: string; quantity: number }[]>([]);

    useEffect(() => {
        const handleShowPopup = ({ x, y, object }:
            { x: number; y: number, object: { id: string, inventory: { name: string; quantity: number }[] } }
        ) => {
            setId(object.id);
            setPosition({ x, y });
            setPopupVisible(true);
            setItems(object.inventory)
        };
        const toggleVisibleOff = () => setPopupVisible(false)

        EventBus.on("show-object-inventory", handleShowPopup);
        EventBus.on('toggle-dialog-off', toggleVisibleOff)

        return () => {
            EventBus.off("show-object-inventory", handleShowPopup);
            EventBus.off('toggle-dialog-off', toggleVisibleOff)
        };
    }, [])

    if (!popupVisible || items.length < 1) return null;

    return <Box sx={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: "rgba(53, 52, 49, 0.5)",
        border: "1px solid white",
        width: 200,
        flexDirection: "column"
    }}>
        {items.map((item) =>
            <ButtonBase
                onClick={() => {
                    store.dispatch({ type: "world/removeObjectInventoryItem", payload: { id: id, removeItem: item.name } })
                    store.dispatch({ type: "player/addToInventory", payload: item })
                    setItems((items) => items.filter((itm) => itm.name !== item.name))
                }}
                sx={{
                    width: "100%"
                }}
                key={item.name}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        padding: 1,
                        flex: 1
                    }}
                >
                    <Typography>{item.name}</Typography>
                    <Typography>{item.quantity}</Typography>
                </Box>
            </ButtonBase>
        )}
    </Box>
}