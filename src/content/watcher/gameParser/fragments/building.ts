import { TEntryAction, TEntryActionType } from "@/content/watcher/gameParser/types";

export const parseBuilding = (entry: Element, action: TEntryAction) => {
  const imageName = entry
    .querySelector("span")
    ?.querySelector("img")
    ?.getAttribute("alt")
    ?.toLowerCase();
  if (!imageName) return;
  action.type = TEntryActionType.Resources;

  if (imageName?.includes("road")) {
    action.resources.lumber -= 1;
    action.resources.brick -= 1;
  } else if (imageName?.includes("settlement")) {
    action.resources.lumber -= 1;
    action.resources.brick -= 1;
    action.resources.wool -= 1;
    action.resources.grain -= 1;
  } else if (imageName?.includes("city")) {
    action.resources.ore -= 3;
    action.resources.grain -= 2;
  }
};
