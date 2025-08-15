import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { getCompanionConfig, subscribeToConfig } from "@/content/state";
import { TColonistCompanion } from "@/content/watcher/gameParser/types";

const CompanionContext = createContext<TColonistCompanion | null>(null);

export const useCompanion = () => {
  const ctx = useContext(CompanionContext);
  if (!ctx)
    throw new Error("useCompanion must be used within CompanionProvider");
  return ctx;
};

export const CompanionProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<TColonistCompanion>(
    getCompanionConfig()
  );

  useEffect(() => {
    const handlePopupMessage = ({
      showCards,
      showDices,
    }: {
      showDices: boolean;
      showCards: boolean;
    }) => {
      setConfig(() => {
        const curConfig = getCompanionConfig();
        return {
          ...curConfig,
          config: {
            showCards: showCards ?? curConfig.config.showCards,
            showDices: showDices ?? curConfig.config.showDices,
          },
        };
      });
    };

    chrome.runtime.onMessage.addListener(handlePopupMessage);
    return () => chrome.runtime.onMessage.removeListener(handlePopupMessage);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToConfig(setConfig);
    return unsubscribe;
  }, []);

  return (
    <CompanionContext.Provider value={config}>
      {children}
    </CompanionContext.Provider>
  );
};
