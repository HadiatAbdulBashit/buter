import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner.tsx";
import { SettingsProvider } from "./contexts/setting-context.tsx";
import { ThemeProvider } from "./contexts/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider storageKey='big-blog-ui-theme'>
    <SettingsProvider>
      <App />
      <Toaster richColors />
    </SettingsProvider>
  </ThemeProvider>
);
