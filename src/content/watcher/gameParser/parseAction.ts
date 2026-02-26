import {
  TColonistCompanion,
  TEntryAction,
  TEntryActionType,
  TResourceKey,
  TRobbery,
} from "@/content/watcher/gameParser/types";
import { handleResourcesChange } from "@/content/watcher/gameParser/utils";
import { DEFAULT_RESOURCES } from "./constants";
import { logger } from "@/utils/logger";

// Clean up any ghost players (players with empty names)
const cleanupGhostPlayers = (config: TColonistCompanion) => {
  for (const playerName in config.players) {
    if (!playerName || !playerName.trim()) {
      delete config.players[playerName];
      logger.warn("Removed ghost player with empty name");
    }
  }
};

export const parseAction = (action: TEntryAction, config: TColonistCompanion) => {
  const { playerName } = action;

  // Skip if player name is empty or action should be ignored
  // Exception: Robbery actions have player names inside action.robbery
  if (!playerName || !playerName.trim()) {
    if (action.type !== TEntryActionType.Robbery) {
      logger.warn("Skipping action with empty player name:", action);
      cleanupGhostPlayers(config);
      return;
    }
  }

  // Create player entry if needed (skip for empty names and Ignore/Robbery types)
  if (
    playerName &&
    playerName.trim() &&
    !config.players[playerName] &&
    action.type !== TEntryActionType.Ignore &&
    action.type !== TEntryActionType.Robbery
  ) {
    config.players[playerName] = {
      resources: { ...DEFAULT_RESOURCES },
    };
  }

  switch (action.type) {
    case TEntryActionType.DevCard:
      config.cards.dev -= 1;
      handleResourcesChange(action, config);
      break;
    case TEntryActionType.MonopolyRobbery: {
      const resource: TResourceKey = action.resource as TResourceKey;

      for (const playerKey in config.players)
        if (playerKey !== action.playerName)
          config.players[playerKey].resources[resource] = 0;

      config.players[action.playerName].resources[resource] += action.resources[resource];
      break;
    }
    case TEntryActionType.Robbery: {
      const robbery = action.robbery as TRobbery;

      // Ensure both players exist
      if (!config.players[robbery.robber.playerName]) {
        config.players[robbery.robber.playerName] = {
          resources: { ...DEFAULT_RESOURCES },
        };
      }
      if (!config.players[robbery.victim.playerName]) {
        config.players[robbery.victim.playerName] = {
          resources: { ...DEFAULT_RESOURCES },
        };
      }

      for (const key in action.robbery?.victim.resources) {
        config.players[robbery.victim.playerName].resources[key as TResourceKey] +=
          robbery.victim.resources[key as TResourceKey];
      }
      for (const key in action.robbery?.robber.resources) {
        config.players[robbery.robber.playerName].resources[key as TResourceKey] +=
          robbery.robber.resources[key as TResourceKey];
      }
      break;
    }
    case TEntryActionType.Resources:
      handleResourcesChange(action, config);
      break;
    case TEntryActionType.PlayerTrade:
      logger.log("Player trade action:", action);
      if (!action.playerTrade?.length) return;

      action.playerTrade.forEach((trade) => {
        for (const key in trade.resources) {
          config.players[trade.playerName].resources[key as TResourceKey] +=
            trade.resources[key as TResourceKey];
        }
      });
      break;
    case TEntryActionType.BuildRoad:
      config.cards.roadBuilding += 1;
      break;
    case TEntryActionType.Knight:
      config.cards.knight += 1;
      break;
    case TEntryActionType.YearOfPlenty:
      config.cards.yearOfPlenty += 1;
      break;
    case TEntryActionType.Monopoly:
      config.cards.monopoly += 1;
      break;
    case TEntryActionType.Dice:
      config.dices[action.diceNumber - 2] += 1;
      break;
    case TEntryActionType.Ignore:
    default:
      break;
  }
};
