import {
  TEntryAction,
  TEntryActionType,
  TResourceKey,
} from "@/content/watcher/gameParser/types";
import { DEFAULT_RESOURCES } from "../constants";
import { logger } from "@/utils/logger";

export const parseStolenResource = (
  entry: Element,
  action: TEntryAction,
  playerName: string
) => {
  action.type = TEntryActionType.Robbery;
  action.robbery = {
    victim: {
      playerName: "",
      resources: { ...DEFAULT_RESOURCES },
    },
    robber: {
      playerName: "",
      resources: { ...DEFAULT_RESOURCES },
    },
  };

  const entrySpan = entry.querySelector("span");
  if (!entrySpan) return;

  const nodes = Array.from(entrySpan.childNodes);

  // Find the player who stole
  if (
    nodes.findIndex((node) => node.textContent?.includes("You stole")) !== -1
  ) {
    action.robbery.robber.playerName = playerName;
  } else {
    action.robbery.robber.playerName =
      entrySpan.querySelectorAll("span")[0].textContent || "";
  }

  // Find the player who was stolen from
  if (
    nodes.findIndex((node) => node.textContent?.includes("from you")) !== -1
  ) {
    action.robbery.victim.playerName = playerName;
  } else {
    if (action.robbery.robber.playerName === playerName) {
      action.robbery.victim.playerName =
        entrySpan.querySelectorAll("span")[0].textContent || "";
    } else {
      action.robbery.victim.playerName =
        entrySpan.querySelectorAll("span")[1].textContent || "";
    }
  }

  if (
    action.robbery.victim.playerName.length === 0 ||
    action.robbery.robber.playerName.length === 0
  ) {
    logger.error("❌ Victim player name not found in stolen resource entry");
    action.type = TEntryActionType.Ignore;
    return;
  }

  // Get the resource stolen
  const resourceImage = entry.querySelector("span")?.querySelector("img");
  if (!resourceImage) {
    action.type = TEntryActionType.Ignore;
    logger.error("❌ Resource image not found in stolen resource entry");
    return;
  }

  const resourceName = resourceImage.getAttribute("alt")?.toLowerCase();
  if (resourceName && resourceName in action.resources) {
    action.robbery.robber.resources[resourceName as TResourceKey] += 1;
    action.robbery.victim.resources[resourceName as TResourceKey] -= 1;
  }
};
