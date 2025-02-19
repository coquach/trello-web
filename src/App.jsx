import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import ThreeDRotation from "@mui/icons-material/ThreeDRotation";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function App() {
  return (
    <>
      <div>Quách Vĩnh Cơ</div>

      <Typography variant="body2" color="text.secondary">Test Typhography</Typography>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <AccessAlarmIcon/>
      <ThreeDRotation/>
    </>
  );
}

export default App;
