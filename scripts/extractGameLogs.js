/**
 * Enhanced Colonist Game Log Extractor
 * Usage: Copy this script into the browser console on colonist.io during a game
 * Then run: await extractGameLogs()
 */

window.extractGameLogs = async function () {
  console.log("🔍 Starting log extraction...");

  // Helper to get player name from entry
  const getPlayerName = (entry) => {
    const name = entry.children[0]?.querySelector("span")?.children[0]?.textContent;
    return name?.trim() || "";
  };

  // Helper to extract resources from images
  const getResourcesFromEntry = (entry) => {
    const images = [...entry.querySelectorAll("img")];
    const resources = [];
    images.forEach((img) => {
      const alt = img.getAttribute("alt");
      if (alt && ["lumber", "brick", "wool", "grain", "ore"].includes(alt.toLowerCase())) {
        resources.push(alt.toLowerCase());
      }
    });
    return resources;
  };

  // Helper to categorize action type
  const getActionType = (text) => {
    if (text.includes("rolled")) return "rolled";
    if (text.includes("got")) return "got";
    if (text.includes("received starting resources")) return "starting_resources";
    if (text.includes("discarded")) return "discarded";
    if (text.includes("gave bank")) return "bank_trade";
    if (text.includes("bought")) return "bought";
    if (text.includes("built")) return "built";
    if (text.includes("stole")) return "stole";
    if (text.includes("took from bank")) return "year_of_plenty";
    if (text.includes("used")) return "used_dev_card";
    if (text.includes("wants to trade")) return "trade_offer";
    if (text.includes("traded")) return "trade_accepted";
    if (text.includes("disconnected")) return "disconnected";
    if (text.includes("reconnected")) return "reconnected";
    if (text.includes("rulebook")) return "rulebook";
    return "unknown";
  };

  // Find log container
  const findLogContainer = () => {
    const playLog = [...document.querySelectorAll("[data-index]")];
    if (playLog.length === 0) {
      console.error("❌ No log entries found");
      return null;
    }

    const logContainer = playLog[0].closest("[data-index]")?.parentElement;
    if (!logContainer || !/^\d+px$/.test(getComputedStyle(logContainer).height)) {
      console.error("❌ Log container not found or has invalid height");
      return null;
    }
    return logContainer;
  };

  const logContainer = findLogContainer();
  if (!logContainer) {
    console.error("❌ Unable to find log container");
    return null;
  }

  console.log("✅ Log container found");

  // Scroll to collect all logs
  const scrollElement = logContainer.parentElement;
  if (!scrollElement || !scrollElement.scrollHeight) {
    console.error("❌ Scrollable element not found");
    return null;
  }

  scrollElement.scrollTop = 0;
  const scrollElementHeight = scrollElement.scrollHeight;
  const scrollElementViewHeight = scrollElement.clientHeight;
  const logsMap = new Map();

  console.log("📜 Scrolling through logs...");
  for (let i = 0; i <= scrollElementHeight; i += scrollElementViewHeight) {
    scrollElement.scrollTop = i;
    await new Promise((resolve) => setTimeout(resolve, 50));

    const logEntries = [...logContainer.querySelectorAll("[data-index]")];
    for (const entry of logEntries) {
      const index = parseInt(entry.getAttribute("data-index"), 10);
      if (!logsMap.has(index)) {
        logsMap.set(index, entry);
      }
    }
  }

  console.log(`✅ Found ${logsMap.size} unique log entries`);

  // Extract structured data
  const logs = [];
  for (const [index, entry] of logsMap.entries()) {
    const text = entry.textContent || "";
    const playerName = getPlayerName(entry);
    const actionType = getActionType(text.toLowerCase());
    const resources = getResourcesFromEntry(entry);

    logs.push({
      index,
      playerName,
      actionType,
      text: text.trim(),
      resources,
      html: entry.outerHTML.substring(0, 200) + "...", // First 200 chars
    });
  }

  // Sort by index
  logs.sort((a, b) => a.index - b.index);

  // Store in window for easy access
  window.gameLogs = logs;
  window.gameLogsJSON = JSON.stringify(logs, null, 2);

  console.log("✅ Logs extracted successfully!");
  console.log("📊 Access via: window.gameLogs (array) or window.gameLogsJSON (string)");
  console.log("📋 To copy: copy(window.gameLogsJSON)");
  console.log("💾 To download: downloadGameLogs()");

  return logs;
};

/**
 * Download logs as JSON file
 */
window.downloadGameLogs = function () {
  if (!window.gameLogsJSON) {
    console.error("❌ No logs extracted yet. Run extractGameLogs() first.");
    return;
  }

  const blob = new Blob([window.gameLogsJSON], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `colonist-logs-${new Date().toISOString()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("✅ Logs downloaded!");
};

/**
 * Analyze logs for specific patterns
 */
window.analyzeLogs = function (playerName = null) {
  if (!window.gameLogs) {
    console.error("❌ No logs extracted yet. Run extractGameLogs() first.");
    return;
  }

  const logs = playerName
    ? window.gameLogs.filter((log) => log.playerName === playerName)
    : window.gameLogs;

  const analysis = {
    totalActions: logs.length,
    actionTypes: {},
    players: new Set(),
    resourceActions: [],
  };

  logs.forEach((log) => {
    // Count action types
    analysis.actionTypes[log.actionType] = (analysis.actionTypes[log.actionType] || 0) + 1;

    // Collect players
    if (log.playerName) {
      analysis.players.add(log.playerName);
    }

    // Track resource actions
    if (log.resources.length > 0) {
      analysis.resourceActions.push({
        index: log.index,
        player: log.playerName,
        action: log.actionType,
        resources: log.resources,
        text: log.text,
      });
    }
  });

  analysis.players = [...analysis.players];

  console.log("📊 Log Analysis:", analysis);
  return analysis;
};

console.log("✅ Log extraction script loaded!");
console.log("🚀 Run: await extractGameLogs()");
console.log("📊 Then: analyzeLogs() or analyzeLogs('PlayerName')");
console.log("💾 Download: downloadGameLogs()");
