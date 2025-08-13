import { TResources } from "@/content/watcher/gameParser/types";

export const getPlayerName = (entry: Element) =>
  entry.children[0].querySelector("span")?.children[0]?.textContent || "";

export const getResourcesFromImages = (images: HTMLImageElement[]) => {
  const resources: TResources = {
    brick: 0,
    lumber: 0,
    grain: 0,
    wool: 0,
    ore: 0,
  };
  images.forEach((img) => {
    const altText = img.getAttribute("alt")?.toLowerCase();
    if (altText && altText in resources) {
      resources[altText as keyof TResources] += 1;
    }
  });
  return resources;
};

export const getTradeResources = (
  gaveResources: TResources,
  gotResources: TResources
): TResources => {
  const tradeResources: TResources = {
    brick: 0,
    lumber: 0,
    grain: 0,
    wool: 0,
    ore: 0,
  };

  for (const k in gaveResources) {
    tradeResources[k as keyof TResources] =
      gotResources[k as keyof TResources] -
      gaveResources[k as keyof TResources];
  }

  return tradeResources;
};
