export const isPlayerTrade = (entry: Element): boolean => {
  const text = entry.textContent?.toLowerCase() ?? "";

  if (!text.includes("gave")) return false;
  if (!(text.includes("and got") || text.includes("and took"))) return false;
  if (!text.includes("from")) return false;

  // Must have at least 2 player name spans
  const nameSpans = entry.querySelectorAll("span[style]");
  if (nameSpans.length < 2) return false;

  // Must have resource images before and after "and got/and took"
  const imgs = entry.querySelectorAll("img[alt]");
  if (imgs.length < 2) return false; // one per side at least

  return true;
};

export const isEntrySeparator = (entry: Element) => {
  return entry.querySelector("hr");
};
