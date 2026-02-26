import { useCompanion } from "@/contexts/useCompanion";

import PlayerList from "@/components/PlayerList";
import ResourcesHeader from "@/components/ResourcesHeader";
import DiceChart from "@/components/DiceChart";
import DevCards from "@/components/DevCards";

const GameInfo = () => {
  const companionConfig = useCompanion();
  if (!companionConfig) return null;

  const { showCards, showDices } = companionConfig.config;

  return  (
    <div id='game-resources' className="cc-flex cc-flex-col cc-w-full cc-gap-2 cc-py-2">
      <ResourcesHeader />
      <PlayerList />
      {(showCards || showDices) && (
        <div className="cc-h-[1px] cc-mx-4 cc-bg-gray-500" />
      )}
      {showCards && <DevCards {...companionConfig.cards} />}
      {showDices && <DiceChart dices={companionConfig.dices} />}
    </div>
  );
};

export default GameInfo;
