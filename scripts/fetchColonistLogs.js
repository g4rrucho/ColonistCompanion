window.fetchColonistLogs = async function () {
  const findPlayLogWithPlayEntries = () => {
    const playLog = [...document.querySelectorAll("[data-index]")];
    if (playLog.length === 0) {
      console.error("❌ No colonist log entries found");
      return;
    }

    const logContainer = playLog[0].closest("[data-index]")?.parentElement;
    if (
      !logContainer ||
      !/^\d+px$/.test(getComputedStyle(logContainer).height)
    ) {
      console.error("❌ Log container not found or has invalid height");
      return;
    }
    return logContainer;
  };

  const findPlayLogWithRulebookAnchor = () => {
    const rulebookAnchor = [...document.querySelectorAll("span")].find((span) =>
      span.innerText?.includes("rulebook")
    );
    if (!rulebookAnchor) {
      console.debug("❌ Rulebook anchor not found");
      return;
    }

    return rulebookAnchor.closest("[data-index]")?.parentElement;
  };

  const getPlayLogContainer = () => {
    // Find the log container with rulebook anchor for a new game starting
    const logContainerFromAnchor = findPlayLogWithRulebookAnchor();
    if (logContainerFromAnchor) return logContainerFromAnchor;

    console.debug("Trying to find an game play log entry");
    // Find the log container using play log entries for mid-game loading
    const logContainerFromEntries = findPlayLogWithPlayEntries();
    if (logContainerFromEntries) return logContainerFromEntries;
  };

  // Main function
  // Get play log container
  const logContainer = getPlayLogContainer();
  if (!logContainer) {
    console.error("❌ Unable to find colonist log container");
    return;
  }

  console.log("✅ Log container found");
  // Get parent scrollable element and scroll to the top
  const scrollElement = logContainer.parentElement;
  if (!scrollElement || !scrollElement.scrollHeight) {
    console.error("❌ Scrollable element not found or has no scroll height");
    return;
  }
  scrollElement.scrollTop = 0;
  const scrollElementHeight = scrollElement.scrollHeight;
  const scrollElementViewHeight = scrollElement.clientHeight;
  const logs = new Map();

  // Fetch all log entries
  for (let i = 0; i <= scrollElementHeight; i += scrollElementViewHeight) {
    scrollElement.scrollTop = i;
    // Wait for the scroll to complete
    await new Promise((resolve) => setTimeout(resolve, 10));


    const logEntries = [...logContainer.querySelectorAll("[data-index]")];
    for (const entry of logEntries) {
      const index = parseInt(entry.getAttribute("data-index"), 10);
      if (!logs.has(index)) {
        logs.set(index, entry);
      }
    }
  }

  const logList = [...logs.values()];
  window.colonistLogElements = logList;
  console.log(`✅ Fetched ${logList.length} unique log entries`);
  return logList;
};
