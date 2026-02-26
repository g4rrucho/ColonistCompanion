import {
  TColonistCompanion,
  TEntryAction,
  TResourceKey,
  TResources,
} from "@/content/watcher/gameParser/types";
import { DEFAULT_RESOURCES } from "./constants";

export const getPlayerName = (entry: Element): string => {
  const name = entry.children[0]?.querySelector("span")?.children[0]?.textContent;
  return name?.trim() || "";
};

export const getResourcesFromImages = (images: HTMLImageElement[]): TResources => {
  const resources: TResources = { ...DEFAULT_RESOURCES };
  images.forEach((img) => {
    const altText = img.getAttribute("alt")?.toLowerCase();
    if (altText && altText in resources) {
      resources[altText as keyof TResources] += 1;
    }
  });
  return resources;
};

export const handleResourcesChange = (
  action: TEntryAction,
  config: TColonistCompanion
) => {
  const { playerName } = action;

  for (const key in action.resources)
    config.players[playerName].resources[key as TResourceKey] +=
      action.resources[key as TResourceKey];
};

export const getTradeResources = (
  gaveResources: TResources,
  gotResources: TResources
): TResources => {
  const tradeResources: TResources = { ...DEFAULT_RESOURCES };

  for (const k in gaveResources) {
    tradeResources[k as keyof TResources] =
      gotResources[k as keyof TResources] - gaveResources[k as keyof TResources];
  }

  return tradeResources;
};
