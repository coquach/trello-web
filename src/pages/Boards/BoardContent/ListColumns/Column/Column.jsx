import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DeleteForever, DragHandle, CloseOutlined } from "@mui/icons-material";
import AddCardIcon from "@mui/icons-material/AddCard";
import Cloud from "@mui/icons-material/Cloud";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentPaste from "@mui/icons-material/ContentPaste";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, TextField, Tooltip, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { mapOrder } from "~/utils/sort";
import ListCards from "./ListCards/ListCards";
import theme from "~/theme";

function Column({ column }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column._id,
    data: { ...column },
  });

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: "100%",
    opacity: isDragging ? 0.5 : undefined,
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const cardsOrdered = mapOrder(column?.cards, column?.cardOrderIds, "_id");

  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const toggleOpenNewCardForm = () => {
    setOpenNewCardForm((prev) => !prev);
  };
  const [newCardTitle, setNewCardTitle] = useState("");

  const addNewCard = () => {
    if (newCardTitle.trim() === "") {
      return;
    }
    // Logic to add new card
    console.log("New card added:", newCardTitle);
    setNewCardTitle("");
    toggleOpenNewCardForm();
  };
  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: "300px",
          maxWidth: "300px",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#333643" : "#ebecf0",
          marginLeft: 2,
          borderRadius: "6px",
          height: "fit-content",
          maxHeight: (theme) =>
            `calc(${theme.trello.boardContainerHeight} - ${theme.spacing(5)})`,
        }}
      >
        {/* Box column header */}
        <Box
          sx={{
            height: (theme) => theme.trello.headerHeight,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            variant="h6"
          >
            {column?.title || "Column Title"}
          </Typography>
          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={{
                  color: "text.primary",
                  cursor: "pointer",
                }}
                id="basic-button-column-dropdown"
                aria-controls={open ? "basic-menu-column-dropdown" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button-column-dropdown",
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <AddCardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  ⌘X
                </Typography>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  ⌘C
                </Typography>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  ⌘V
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <DeleteForever fontSize="small" />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Cards in the column */}
        <ListCards cards={cardsOrdered} />
        {/* Box column footer */}
        <Box
          sx={{
            height: (theme) => theme.trello.footerHeight,
            padding: 2,
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Button
                onClick={toggleOpenNewCardForm}
                startIcon={<AddCardIcon />}
              >
                Add new card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandle sx={{ cursor: "pointer" }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <TextField
                label="Enter card title..."
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  "& label": {
                    color: "text.primary",
                  },
                  "& label.Mui-focused": {
                    color: (theme) => theme.palette.primary,
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: (theme) => theme.palette.primary,
                    },
                    "&:hover fieldset": {
                      borderColor: (theme) => theme.palette.primary,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: (theme) => theme.palette.primary,
                    },
                  },
                  "& input": {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) =>
                      theme.palette.mode === "dark" ? "#333643" : "white",
                  },
                  "& .MuiOutlinedInput-input": {
                    borderRadius: 1,
                  },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  onClick={addNewCard}
                  size="small"
                  sx={{
                    boxShadow: "none",
                    border: "0.5px solid",
                    borderColor: (theme) => theme.palette.success.main,
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.success.main,
                    },
                  }}
                >
                  Add
                </Button>
                <CloseOutlined
                  fontSize="small"
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: "pointer",
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Column;
