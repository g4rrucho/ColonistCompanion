import { createContext } from "react";
import { TColonistCompanion } from "@/content/watcher/gameParser/types";

export const CompanionContext = createContext<TColonistCompanion | null>(null);
