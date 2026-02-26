import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Switch from "@/components/Switch";
import { logger } from "@/utils/logger";

export default function App() {
  const [config, setConfig] = useState({
    showCards: true,
    showDices: true,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from storage on mount
  useEffect(() => {
    chrome.storage.sync.get(["showCards", "showDices"], (result) => {
      setConfig({
        showCards: result.showCards ?? true,
        showDices: result.showDices ?? true,
      });
      setIsLoaded(true);
    });
  }, []);

  const setConfigState = useCallback(
    ({ showCards, showDices }: Partial<typeof config>) => {
      setConfig((prev) => {
        const newConfig = {
          ...prev,
          showCards: showCards !== undefined ? showCards : prev.showCards,
          showDices: showDices !== undefined ? showDices : prev.showDices,
        };
        // Persist to storage
        void chrome.storage.sync.set(newConfig);
        return newConfig;
      });
    },
    []
  );

  const sendMessage = useCallback(
    async (configToSend: typeof config) => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tab?.id) {
          await chrome.tabs.sendMessage(tab.id, configToSend);
          logger.log("Message sent to content");
        } else {
          logger.warn("No active tab id");
        }
      } catch (e) {
        logger.error("Failed to send message:", e);
      }
    },
    []
  );

  useEffect(() => {
    if (isLoaded) {
      void sendMessage(config);
    }
  }, [config, sendMessage, isLoaded]);

  return (
    <div className="cc-flex cc-justify-center cc-flex-col cc-gap-2">
      <div>
        <p className="cc-text-3xl">Colonist Companion</p>
        <p className="cc-text-xl">1v1</p>
      </div>
      <div className="cc-flex cc-flex-col cc-gap-2">
        <Switch
          label="Show cards"
          checked={config.showCards}
          onChange={(val) => setConfigState({ showCards: val })}
        />
        <Switch
          label="Show dices"
          checked={config.showDices}
          onChange={(val) => setConfigState({ showDices: val })}
        />
      </div>
    </div>
  );
}
