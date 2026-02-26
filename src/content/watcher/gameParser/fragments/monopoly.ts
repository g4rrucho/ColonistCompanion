import {
  TEntryAction,
  TEntryActionType,
  TResourceKey,
} from "@/content/watcher/gameParser/types";
import { logger } from "@/utils/logger";

export const parseMonopolyRobbery = (entry: Element, action: TEntryAction) => {
  action.type = TEntryActionType.MonopolyRobbery;

  const span = entry.querySelector("span");
  if (!span) {
    action.type = TEntryActionType.Ignore;
    logger.error("❌ Span not found in monopoly robbery entry");
    return;
  }

  // Get player name
  const playerName = span.querySelector("span")?.textContent;
  if (!playerName) {
    action.type = TEntryActionType.Ignore;
    logger.error("❌ Player name not found in monopoly robbery entry");
    return;
  }

  // Get resource type
  const resourceImage = span?.querySelector("img");
  if (!resourceImage) {
    action.type = TEntryActionType.Ignore;
    logger.error("❌ Resource image not found in monopoly robbery entry");
    return;
  }
  const resourceName = resourceImage.getAttribute("alt")?.toLowerCase();
  action.resource = resourceName as TResourceKey;

  // Get number of resources stolen
  const nodes = Array.from(entry.querySelectorAll("span"));
  const text = nodes
    .find((el) => el.textContent?.includes("stole"))
    ?.textContent?.split(" ");

  const amount = parseInt(text?.[2] || "");
  if (isNaN(amount)) action.resources[resourceName as TResourceKey] = 1;
  else action.resources[resourceName as TResourceKey] = amount;
};
