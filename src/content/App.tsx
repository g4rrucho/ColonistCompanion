import { useCompanion } from "@/contexts/companion";
import "./App.css";

const PlayerList = () => {
  const config = useCompanion();
  console.log("PlayerList config:", config);
  if (!config) return null;

  return (
    <div>
      <h1>Players</h1>
      {Object.entries(config.players).map(([name, player]) => (
        <div key={name} className="cc-mb-4">
          <strong className="cc-block cc-mb-2">{name}</strong>
          <div className="cc-flex cc-flex-row cc-gap-4">
            {Object.entries(player.resources).map(([resource, count]) => (
              <div
                key={resource}
                className="cc-flex cc-flex-col cc-items-center"
              >
                <div className="cc-font-medium">{resource}</div>
                <div>{count}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* {Object.entries(config.players).map(([name, player]) => (
        <div key={name}>
          <strong>{name}</strong>
          <div className="cc-flex cc-flex-col">
            <div className="cc-flex cc-flex-row">
              {Object.keys(player.resources).map((resource) => (
                <div>{resource}</div>
              ))}
            </div>
            <div className='cc-flex cc-flex-row'>
              {Object.entries(player.resources).map(([_, count]) => (
                <div>{count}</div>
              ))}
            </div>
          </div>
        </div>
      ))} */}
    </div>
  );
};

function App() {
  return (
    <div
      className="cc-absolute cc-bottom-4 cc-right-8 cc-z-50 cc-cursor-move cc-select-none"
      draggable="true"
    >
      <div className="cc-bg-orange-500 cc-w-[400px] cc-m-8">
        <h1>Colonist Companion</h1>
        <PlayerList />
      </div>
    </div>
  );
}

export default App;
