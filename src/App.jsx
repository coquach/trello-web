
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import ThreeDRotation from "@mui/icons-material/ThreeDRotation";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useColorScheme } from "@mui/material/styles";

function ModeSwitcher() {
  const { mode, setMode } = useColorScheme();

  if (!mode) {
    return null;
  }

  return (
    <select
      value={mode}
      onChange={(event) => {
        setMode(event.target.value);
        // For TypeScript, cast `event.target.value as 'light' | 'dark' | 'system'`:
      }}
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}
function App() {
  return (
    <>
      <ModeSwitcher />
      <hr />
      <div>Quách Vĩnh Cơ</div>

      <Typography variant="body2" color="text.secondary">
        Test Typhography
      </Typography>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
      <AccessAlarmIcon />
      <ThreeDRotation />
    </>
  );
}

export default App;
