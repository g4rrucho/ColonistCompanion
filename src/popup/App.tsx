import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Switch from "@/components/Switch";

export default function App() {
  const [config, setConfig] = useState({
    showCards: true,
    showDices: true,
  });

  const setConfigState = useCallback(
    ({ showCards, showDices }: Partial<typeof config>) => {
      setConfig((prev) => ({
        ...prev,
        showCards: showCards ?? prev.showCards,
        showDices: showDices ?? prev.showDices,
      }));
    },
    []
  );

  const sendMessage = useCallback(
    async ({ showCards, showDices }: Partial<typeof config>) => {
      try {
        const [tab] = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tab?.id) {
          await chrome.tabs.sendMessage(tab.id, {
            showCards: showCards ?? config.showCards,
            showDices: showDices ?? config.showDices,
          });
          console.log("Message sent to content");
        } else {
          console.warn("No active tab id");
        }
      } catch (e) {
        console.error("Failed to send message:", e);
      }
    },
    []
  );

  useEffect(() => {
    sendMessage(config);
  }, [config, sendMessage]);

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
