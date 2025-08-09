import { Box } from "@mui/material";
import Card from "./Card/Card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function ListCards({ cards }) {
  return (
    <SortableContext
      items={cards?.map((c) => c._id)}
      strategy={verticalListSortingStrategy}
    >
      <Box
        sx={{
          margin: "0 5px",
          padding: "0 5px 5px 5px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          overflowY: "auto",
          overflowX: "hidden",
          maxHeight: (theme) =>
            `calc(${theme.trello.boardContainerHeight}  
            - ${theme.spacing(5)} 
            - ${theme.trello.headerHeight} 
            - ${theme.trello.footerHeight})`,
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ced0da",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#bfc2cf",
          },
        }}
      >
        {cards?.map((card) => (
          <Card key={card._id} card={card} />
        ))}
      </Box>
    </SortableContext>
  );
}

export default ListCards;
