import { createRoot } from "react-dom/client";
import Index from "./pages/Index.tsx";
import { LanguageProvider } from "./contexts/LanguageContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <Index />
  </LanguageProvider>
);
