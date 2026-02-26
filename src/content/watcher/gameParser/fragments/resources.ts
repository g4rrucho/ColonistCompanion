import {
  TEntryAction,
  TEntryActionType,
  TResourceKey,
} from "@/content/watcher/gameParser/types";

export const parseResources = (entry: Element, action: TEntryAction) => {
  action.type = TEntryActionType.Resources;
  const entryImages = entry.querySelectorAll("img");
  for (const img of entryImages) {
    const altText = img.getAttribute("alt")?.toLowerCase();
    if (altText && altText in action.resources)
      action.resources[altText as TResourceKey] += 1;
  }
};

export const parseDiscardedResources = (entry: Element, action: TEntryAction) => {
  action.type = TEntryActionType.Resources;
  const entryImages = entry.querySelectorAll("img");
  for (const img of entryImages) {
    const altText = img.getAttribute("alt")?.toLowerCase();
    if (altText && altText in action.resources) {
      action.resources[altText as TResourceKey] -= 1;
    }
  }
};

export const parseYearOfPlenty = (entry: Element, action: TEntryAction) => {
  action.type = TEntryActionType.Resources;
  const entryImages = entry.querySelectorAll("img");
  for (const img of entryImages) {
    const altText = img.getAttribute("alt")?.toLowerCase();
    if (altText && altText in action.resources) {
      action.resources[altText as TResourceKey] += 1;
    }
  }
};
