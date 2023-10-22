import WheelOfFortune from "./components/WheelOfFortune/WheelOfFortune";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import { useThemeContext } from "./theme/ThemeContextProvider";
import { CssBaseline } from "@mui/material";
import NightModeToggle from "./components/NightModeToggle/NightModeToggle";

function App() {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NightModeToggle />
      <WheelOfFortune />
    </ThemeProvider>
  );
}

export default App;
