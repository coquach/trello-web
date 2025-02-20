import { createTheme } from "@mui/material/styles";
import { red, teal, deepOrange, cyan, orange } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange,
        error: red,
        background: cyan,
        text: orange,
        action: {
          active: orange[500],
        },
      },
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange,
        error: deepOrange,
        background: teal,
        text: cyan,
        action: {},
      },
      cssVariables: true,
    },
  },
});

export default theme;
