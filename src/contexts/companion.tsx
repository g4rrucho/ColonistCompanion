import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { getCompanionConfig, subscribeToConfig } from "@/content/state";
import { TColonistCompanion } from "@/content/watcher/types";

const CompanionContext = createContext<TColonistCompanion | null>(null);

export const useCompanion = () => {
  const ctx = useContext(CompanionContext);
  if (!ctx)
    throw new Error("useCompanion must be used within CompanionProvider");
  return ctx;
};

export const CompanionProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<TColonistCompanion | null>(
    getCompanionConfig()
  );

  useEffect(() => {
    const unsubscribe = subscribeToConfig(setConfig);
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log("CompanionProvider config updated", config);
    setConfig(getCompanionConfig());
  }, [config]);

  return (
    <CompanionContext.Provider value={config}>
      {children}
    </CompanionContext.Provider>
  );
};
