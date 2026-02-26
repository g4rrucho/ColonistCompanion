import { DEBUG } from "@/content/watcher/gameParser/constants";

export const logger = {
  log: (...args: unknown[]) => {
    if (DEBUG) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (DEBUG) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    // Always show errors
    console.error(...args);
  },
};
