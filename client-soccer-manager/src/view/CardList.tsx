import { Stack } from "@mui/material";
import { ReactNode } from "react";

interface CardListProps {
    data: any[];
    renderCard: (item: any) => ReactNode;
}
export function CardList(props: CardListProps) {
    const { data, renderCard } = props;

    return <Stack>{data.map(renderCard)}</Stack>;
}
