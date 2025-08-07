import { getCompanionConfig, setCompanionConfig } from "@/content/state";
import { TColonistCompanion } from "@/content/watcher/types";
import { gameWatcherObserver } from "@/content/watcher/gameWatcher";
import parseEntry from "@/content/watcher/parser";

// #endgame-item-box

const goToScrollTop = async (
  scrollEl: HTMLElement,
  playHistoryEl: HTMLElement,
  maxAttempts = 300
) => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const currentEntries = [...playHistoryEl.querySelectorAll("[data-index]")];

    for (const entry of currentEntries) {
      const anchorEl = entry.querySelector("a");
      if (anchorEl && anchorEl.getAttribute("href") === "#open-rulebook")
        return;
    }

    scrollEl.scrollTop = 0;
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log(scrollEl.scrollTop, "scrollTop");
    attempts++;
    console.log(attempts, "attempts");
  }
};

const parseInitialGame = async (config: TColonistCompanion) => {
  console.log("Parsing initial game...");
  if (!config.playHistoryEl) {
    console.error("❌ Play history element not found");
    return;
  }
  const scrollEl = config.playHistoryEl.parentElement;
  if (!scrollEl || !scrollEl.scrollHeight) {
    console.error("❌ Scrollable element not found or has no scroll height");
    return;
  }

  await goToScrollTop(scrollEl, config.playHistoryEl);
  const viewHeight = scrollEl.clientHeight;
  const totalHeight = scrollEl.scrollHeight;
  scrollEl.scrollTop = 0;

  for (let i = 0; i <= totalHeight; i += viewHeight) {
    scrollEl.scrollTop = i;
    await new Promise((resolve) => setTimeout(resolve, 50));

    const logEntries = [
      ...config.playHistoryEl.querySelectorAll("[data-index]"),
    ];
    for (const entry of logEntries) {
      const index = parseInt(entry.getAttribute("data-index") ?? "0", 10);
      if (!config.logs.has(index)) config.logs.set(index, entry);
    }
  }

  // Parse resources
  console.log("Logs", config.logs.values());
  for (const entry of config.logs.values()) parseEntry(entry, config);

  // TODO remove this
  console.log("Initial game parse completed", config.logs.size);
};

const gameStartObserver = new MutationObserver(async () => {
  const gameContainer = document.querySelector("#ui-game");
  if (!gameContainer) {
    console.error("❌ #ui-game not found");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return;
  }
  console.log("✅ Game started");

  const logs = gameContainer.querySelectorAll("[data-index]");
  if (logs.length === 0) {
    console.log("Waiting for logs");
    return;
  }

  const logContainer = logs[0].closest("[data-index]")?.parentElement;
  if (!logContainer || !/^\d+px$/.test(getComputedStyle(logContainer).height)) {
    console.error("❌ Log container not found or has invalid height");
    return;
  }

  gameStartObserver.disconnect();
  const config = getCompanionConfig();
  config.playHistoryEl = logContainer;
  await parseInitialGame(config);
  setCompanionConfig(config);

  gameWatcherObserver.observe(logContainer, { childList: true, subtree: true });
});

function observerColonist() {
  gameStartObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export default observerColonist;
