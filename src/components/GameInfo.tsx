import { useCompanion } from "@/contexts/useCompanion";

import PlayerList from "@/components/PlayerList";
import ResourcesHeader from "@/components/ResourcesHeader";
import DiceChart from "@/components/DiceChart";
import DevCards from "@/components/DevCards";

const GameInfo = () => {
  const companionConfig = useCompanion();
  if (!companionConfig) return null;

  const { showCards, showDices } = companionConfig.config;

  return (
    <div id="game-resources" className="cc-flex cc-w-full cc-flex-col cc-gap-2 cc-py-2">
      <ResourcesHeader />
      <PlayerList />
      {(showCards || showDices) && <div className="cc-mx-4 cc-h-[1px] cc-bg-gray-500" />}
      {showCards && <DevCards {...companionConfig.cards} />}
      {showDices && <DiceChart dices={companionConfig.dices} />}
    </div>
  );
};

export default GameInfo;
