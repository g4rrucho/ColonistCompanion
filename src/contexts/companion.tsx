import { useEffect, useState, ReactNode } from "react";

import { getCompanionConfig, subscribeToConfig } from "@/content/state";
import { TColonistCompanion } from "@/content/watcher/gameParser/types";
import { CompanionContext } from "./CompanionContext";

export const CompanionProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<TColonistCompanion>(getCompanionConfig());

  useEffect(() => {
    if (typeof chrome === "undefined" || !chrome.runtime?.onMessage) return;

    const handlePopupMessage = ({
      showCards,
      showDices,
    }: {
      showDices: boolean;
      showCards: boolean;
    }) => {
      setConfig(() => {
        const curConfig = getCompanionConfig();
        const newConfig = {
          ...curConfig,
          config: {
            showCards: showCards !== undefined ? showCards : curConfig.config.showCards,
            showDices: showDices !== undefined ? showDices : curConfig.config.showDices,
          },
        };
        // Save to storage when popup sends message
        if (chrome.storage?.sync) {
          void chrome.storage.sync.set({
            showCards: newConfig.config.showCards,
            showDices: newConfig.config.showDices,
          });
        }
        return newConfig;
      });
    };

    chrome.runtime.onMessage.addListener(handlePopupMessage);
    return () => chrome.runtime.onMessage.removeListener(handlePopupMessage);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToConfig(setConfig);
    return unsubscribe;
  }, []);

  return <CompanionContext.Provider value={config}>{children}</CompanionContext.Provider>;
};
