import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import observerColonist from "@/content/watcher";
import { CompanionProvider } from "@/contexts/companion";

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", observerColonist);
else observerColonist();

const container = document.createElement("div");
container.id = "colonist-companion";
document.body.appendChild(container);

createRoot(container).render(
  <StrictMode>
    <CompanionProvider>
      <App />
    </CompanionProvider>
  </StrictMode>
);
