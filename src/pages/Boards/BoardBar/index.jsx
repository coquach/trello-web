import DashboardIcon from "@mui/icons-material/Dashboard";
import { Box, Button, Chip, Tooltip } from "@mui/material";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import AddToDriveIcon from "@mui/icons-material/AddToDrive";
import BoltIcon from "@mui/icons-material/Bolt";
import FilterListIcon from "@mui/icons-material/FilterList";
import Avatar from "@mui/material/Avatar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { capitalizeFirstLetter } from "~/utils/formatter";
import AvatarGroup from "@mui/material/AvatarGroup";
function BoardBar({ board }) {
  const MENUSTYLE = {
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    paddingX: "5px",
    borderRadius: "4px",
    "&:hover": {
      backgroundColor: "primary.50",
    },
    ".MuiSvgIcon-root": {
      color: "white",
    },
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: (theme) => theme.trello.boardBarHeight,
        display: "flex",
        alignItems: "center",
        gap: 2,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
        borderBottom: "1px solid white",
        justifyContent: "space-between",
        paddingX: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Tooltip title={board?.description || "Board Title"}>
          <Chip
            label={board?.title || "Board Title"}
            icon={<DashboardIcon />}
            clickable
            sx={MENUSTYLE}
          />
        </Tooltip>

        <Chip
          label={capitalizeFirstLetter(board?.type)}
          icon={<VpnLockIcon />}
          clickable
          sx={MENUSTYLE}
        />

        <Chip
          label="App to Google Drive"
          icon={<AddToDriveIcon />}
          clickable
          sx={MENUSTYLE}
        />

        <Chip
          label="Automation "
          icon={<BoltIcon />}
          clickable
          sx={MENUSTYLE}
        />
        <Chip
          label="Filter"
          icon={<FilterListIcon />}
          clickable
          sx={MENUSTYLE}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": {
              border: "none",
            },
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={4}
          sx={{
            gap: "10px",
            "& .MuiAvatar-root": {
              width: 34,
              height: 34,
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
              color: "white",
              "&:first-of-type": {
                backgroundColor: "#a4b0de",
              },
            },
          }}
        >
          <Tooltip title="VinhCo">
            <Avatar
              alt="VinhCo"
              src="https://images2.thanhnien.vn/528068263637045248/2023/10/30/messi-1-16986835956171266032258.jpeg"
            />
          </Tooltip>
          <Tooltip title="VinhCo">
            <Avatar
              alt="VinhCo"
              src="https://images2.thanhnien.vn/528068263637045248/2023/10/30/messi-1-16986835956171266032258.jpeg"
            />
          </Tooltip>
          <Tooltip title="VinhCo">
            <Avatar
              alt="VinhCo"
              src="https://images2.thanhnien.vn/528068263637045248/2023/10/30/messi-1-16986835956171266032258.jpeg"
            />
          </Tooltip>
          <Tooltip title="VinhCo">
            <Avatar
              alt="VinhCo"
              src="https://images2.thanhnien.vn/528068263637045248/2023/10/30/messi-1-16986835956171266032258.jpeg"
            />
          </Tooltip>
          <Tooltip title="VinhCo">
            <Avatar
              alt="VinhCo"
              src="https://images2.thanhnien.vn/528068263637045248/2023/10/30/messi-1-16986835956171266032258.jpeg"
            />
          </Tooltip>
          <Tooltip title="VinhCo">
            <Avatar
              alt="VinhCo"
              src="https://images2.thanhnien.vn/528068263637045248/2023/10/30/messi-1-16986835956171266032258.jpeg"
            />
          </Tooltip>
          <Tooltip title="VinhCo">
            <Avatar
              alt="VinhCo"
              src="https://images2.thanhnien.vn/528068263637045248/2023/10/30/messi-1-16986835956171266032258.jpeg"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  );
}

export default BoardBar;
