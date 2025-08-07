import { getCompanionConfig, setCompanionConfig } from "@/content/state";
import parseEntry from "@/content/watcher/parser";

export const gameWatcherObserver = new MutationObserver(async () => {
  const config = getCompanionConfig();
  console.log("Game watcher crawling...");

  if (!config.playHistoryEl)
    return console.error("❌ Play history element not found");

  // Parse each play
  const newEntries = [...config.playHistoryEl.querySelectorAll("[data-index]")];

  for (const entry of newEntries) {
    const indexAttr = entry.getAttribute("data-index");
    const index = indexAttr ? parseInt(indexAttr, 10) : null;

    if (index === null || config.logs.has(index)) {
      console.log(`Skipping entry with index ${index} (already parsed)`);
      continue;
    }

    console.log("Handling new entry with index:", index);
    config.logs.set(index, entry);
    parseEntry(entry, config);
    setCompanionConfig(config);
  }
});
