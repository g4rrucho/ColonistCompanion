import { TEntryAction, TEntryActionType } from "@/content/watcher/gameParser/types";
import {
  getResourcesFromImages,
  getTradeResources,
} from "@/content/watcher/gameParser/utils";
import { logger } from "@/utils/logger";

export const parsePlayerTrade = (entry: Element, action: TEntryAction) => {
  action.type = TEntryActionType.PlayerTrade;

  const entrySpan = entry.querySelector("span");
  if (!entrySpan) {
    action.type = TEntryActionType.Ignore;
    logger.error("❌ Player trade entry span not found");
    return;
  }

  const texts = Array.from(entrySpan.querySelectorAll("span"));

  const giver = texts[0].textContent?.trim() || "";
  const receiver = texts[1].textContent?.trim() || "";

  const nodes = Array.from(entrySpan.childNodes);

  const gaveIndex = nodes.findIndex((el) => el.textContent?.includes("gave"));
  const gotIndex = nodes.findIndex((el) => el.textContent?.includes("and got"));
  const fromIndex = nodes.findIndex((el) => el === texts[1]);

  const gaveImgs = nodes
    .slice(gaveIndex + 1, gotIndex)
    .filter((img) => img.nodeName === "IMG") as HTMLImageElement[];
  const gotImgs = nodes
    .slice(gotIndex + 1, fromIndex - 1)
    .filter((img) => img.nodeName === "IMG") as HTMLImageElement[];

  const gaveResources = getResourcesFromImages(gaveImgs);
  const gotResources = getResourcesFromImages(gotImgs);

  action.playerTrade = [];
  action.playerTrade.push({
    playerName: giver,
    resources: getTradeResources(gaveResources, gotResources),
  });

  action.playerTrade.push({
    playerName: receiver,
    resources: getTradeResources(gotResources, gaveResources),
  });
};
