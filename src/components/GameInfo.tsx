import { useCompanion } from "@/contexts/companion";

import PlayerList from "@/components/PlayerList";
import ResourcesHeader from "@/components/ResourcesHeader";
import DiceChart from "@/components/DiceChart";
import DevCards from "@/components/DevCards";

const GameInfo = () => {
  const config = useCompanion();
  if (!config) return null;

  return (
    <div className="cc-flex cc-flex-col cc-w-full cc-gap-2">
      <ResourcesHeader />
      <PlayerList />
      <div className="cc-h-[1px] cc-mx-4 cc-bg-gray-500" />
      <DevCards {...config.cards} />
      <DiceChart dices={config.dices} />
    </div>
  );
};

export default GameInfo;
