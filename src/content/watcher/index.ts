import { getCompanionConfig, setCompanionConfig } from "@/content/state";
import { TColonistCompanion } from "@/content/watcher/gameParser/types";
import { gameWatcherObserver } from "@/content/watcher/gameWatcher";
import parseEntry from "@/content/watcher/gameParser";
import {
  MAX_SCROLL_ATTEMPTS,
  SCROLL_ATTEMPT_DELAY_MS,
  SCROLL_CHUNK_DELAY_MS,
  SELECTORS,
} from "@/content/watcher/gameParser/constants";
import { logger } from "@/utils/logger";

// #endgame-item-box

const goToScrollTop = async (
  scrollEl: HTMLElement,
  playHistoryEl: HTMLElement,
  maxAttempts = MAX_SCROLL_ATTEMPTS
) => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const currentEntries = [...playHistoryEl.querySelectorAll(SELECTORS.DATA_INDEX)];

    for (const entry of currentEntries) {
      const anchorEl = entry.querySelector("a");
      if (anchorEl && anchorEl.getAttribute("href") === SELECTORS.RULEBOOK_LINK) return;
    }

    scrollEl.scrollTop = 0;
    await new Promise((resolve) => setTimeout(resolve, SCROLL_ATTEMPT_DELAY_MS));
    logger.log(scrollEl.scrollTop, "scrollTop");
    attempts++;
    logger.log(attempts, "attempts");
  }
};

const parseInitialGame = async (config: TColonistCompanion) => {
  logger.log("Parsing initial game...");
  if (!config.playHistoryEl) {
    logger.error("❌ Play history element not found");
    return;
  }
  const scrollEl = config.playHistoryEl.parentElement;
  if (!scrollEl || !scrollEl.scrollHeight) {
    logger.error("❌ Scrollable element not found or has no scroll height");
    return;
  }

  await goToScrollTop(scrollEl, config.playHistoryEl);
  const viewHeight = scrollEl.clientHeight;
  const totalHeight = scrollEl.scrollHeight;
  scrollEl.scrollTop = 0;

  for (let i = 0; i <= totalHeight; i += viewHeight) {
    scrollEl.scrollTop = i;
    await new Promise((resolve) => setTimeout(resolve, SCROLL_CHUNK_DELAY_MS));

    const logEntries = [...config.playHistoryEl.querySelectorAll(SELECTORS.DATA_INDEX)];
    for (const entry of logEntries) {
      const index = parseInt(entry.getAttribute("data-index") ?? "0", 10);
      if (!config.logs.has(index)) config.logs.set(index, entry);
    }
  }

  // Parse resources
  logger.log("Logs", config.logs.values());
  for (const entry of config.logs.values()) parseEntry(entry, config);

  logger.log("Initial game parse completed", config.logs.size);
};

const gameStartObserver = new MutationObserver(() => {
  void (async () => {
    const gameContainer = document.querySelector(SELECTORS.GAME_CONTAINER);
    if (!gameContainer) {
      logger.error("❌ Game container not found");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return;
    }
    logger.log("✅ Game started");

    const logs = gameContainer.querySelectorAll(SELECTORS.DATA_INDEX);
    if (logs.length === 0) {
      logger.log("Waiting for logs");
      return;
    }

    const logContainer = logs[0].closest(SELECTORS.DATA_INDEX)?.parentElement;
    if (!logContainer || !/^\d+px$/.test(getComputedStyle(logContainer).height)) {
      logger.error("❌ Log container not found or has invalid height");
      return;
    }

    gameStartObserver.disconnect();
    const config = getCompanionConfig();
    config.playHistoryEl = logContainer;
    const playerNameEl = document.querySelector(SELECTORS.PLAYER_NAME);
    if (playerNameEl) config.playerName = playerNameEl.textContent || "";

    await parseInitialGame(config);
    setCompanionConfig(config);

    gameWatcherObserver.observe(logContainer, { childList: true, subtree: true });
  })();
});

function observerColonist() {
  gameStartObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export default observerColonist;
