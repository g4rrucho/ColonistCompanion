import { getCompanionConfig, setCompanionConfig } from "@/content/state";
import parseEntry from "@/content/watcher/gameParser";
import { SELECTORS } from "@/content/watcher/gameParser/constants";
import { logger } from "@/utils/logger";

export const gameWatcherObserver = new MutationObserver(() => {
  const config = getCompanionConfig();
  logger.log("Game watcher crawling...");

  if (!config.playHistoryEl) return logger.error("❌ Play history element not found");

  // Parse each play
  const newEntries = [...config.playHistoryEl.querySelectorAll(SELECTORS.DATA_INDEX)];
  let hasNewEntries = false;

  for (const entry of newEntries) {
    const indexAttr = entry.getAttribute("data-index");
    const index = indexAttr ? parseInt(indexAttr, 10) : null;

    if (index === null || config.logs.has(index)) continue;

    hasNewEntries = true;
    config.logs.set(index, entry);
    parseEntry(entry, config);
  }

  if (hasNewEntries) {
    setCompanionConfig(config);
  }
});
