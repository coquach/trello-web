import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import theme from "~/theme";
import App from "~/App";
createRoot(document.getElementById("root")).render(
  <ThemeProvider defaultMode="system" theme={theme}>
    <CssBaseline />
    <App />
    <ToastContainer position="top-center" theme="colored"/>
  </ThemeProvider>
);
