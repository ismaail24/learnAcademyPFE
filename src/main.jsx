import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App.jsx";
import "./index.css";

const rootElement = document.getElementById("root");

createRoot(rootElement).render(
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <App />
  </ThemeProvider>,
);
