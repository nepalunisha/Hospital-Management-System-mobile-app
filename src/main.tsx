import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClaimsProvider } from "./pages/ClaimsContext";



createRoot(document.getElementById("root")!).render(
  <ClaimsProvider>
    <App />
  </ClaimsProvider>
);