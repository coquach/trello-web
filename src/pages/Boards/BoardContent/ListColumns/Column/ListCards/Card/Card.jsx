import { Attachment, Comment, Group } from "@mui/icons-material";
import { Button, Card as MuiCard, Typography } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

function Card() {
  return (
    <MuiCard
      sx={{
        cursor: "pointer",
        boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
        overflow: "unset",
      }}
    >
      <CardMedia
        sx={{ height: 140 }}
        image="https://cdn.pixabay.com/photo/2024/10/02/18/24/leaf-9091894_1280.jpg"
        title="green iguana"
      />
      <CardContent
        sx={{ padding: 1.5, "&:last-child": { paddingBottom: 1.5 } }}
      >
        <Typography>MernStack</Typography>
      </CardContent>
      <CardActions sx={{ padding: "0 4px 8px 4px" }}>
        <Button size="small" startIcon={<Group />}>
          20
        </Button>
        <Button size="small" startIcon={<Comment />}>
          15
        </Button>
        <Button size="small" startIcon={<Attachment />}>
          10
        </Button>
      </CardActions>
    </MuiCard>
  );
}

export default Card;
