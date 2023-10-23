import WheelOfFortune from "./components/WheelOfFortune/WheelOfFortune";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import { useThemeContext } from "./theme/ThemeContextProvider";
import { CssBaseline } from "@mui/material";
import NightModeToggle from "./components/NightModeToggle/NightModeToggle";
import { ThemeContextProvider } from "./theme/ThemeContextProvider";
import Header from "./components/Header/Header";

function App() {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <WheelOfFortune />
    </ThemeProvider>
  );
}

export default App;
