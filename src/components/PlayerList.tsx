import PlayerResources from "@/components/PlayerResources";
import { useCompanion } from "@/contexts/useCompanion";

const PlayerList = () => {
  const config = useCompanion();
  if (!config) return null;

  const players = Object.entries(config.players);

  return (
    <div>
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

export default PlayerList;
