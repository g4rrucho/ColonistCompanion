import { useCompanion } from "@/contexts/companion";

import CardLumber from "@/assets/card_lumber.svg?react";
import CardBrick from "@/assets/card_brick.svg?react";
import CardWool from "@/assets/card_wool.svg?react";
import CardGrain from "@/assets/card_grain.svg?react";
import CardOre from "@/assets/card_ore.svg?react";
import { TResources } from "@/content/watcher/types";

const ResourcesHeader = () => (
  <div className="cc-flex">
    <strong className="cc-text-lg cc-mb-1 cc-w-[100px]"></strong>
    <div className="cc-flex cc-gap-4">
      <CardLumber className="cc-w-8 cc-h-8" />
      <CardBrick className="cc-w-8 cc-h-8" />
      <CardWool className="cc-w-8 cc-h-8" />
      <CardGrain className="cc-w-8 cc-h-8" />
      <CardOre className="cc-w-8 cc-h-8" />
    </div>
  </div>
);

const PlayerResources = ({ resources }: { resources: TResources }) => (
  <div className="cc-flex cc-gap-4 cc-text-black">
    {Object.entries(resources).map(([resource, amount]) => (
      <div key={resource} className="cc-w-8 cc-text-center cc-text-black">
        {amount}
      </div>
    ))}
  </div>
);

const PlayerList = () => {
  const config = useCompanion();
  if (!config) return null;

  const players = Object.entries(config.players);

  return (
    <div className="">
      {players.map(([name, player]) => (
        <div key={name} className="cc-flex">
          <strong className="cc-text-center cc-text-black cc-w-[100px]">
            {name}
          </strong>
          <PlayerResources resources={player.resources} />
        </div>
      ))}
    </div>
  );
};

const GameInfo = () => (
  <div className="cc-flex cc-flex-col cc-w-full">
    <ResourcesHeader />
    <PlayerList />
  </div>
);

export default GameInfo;
