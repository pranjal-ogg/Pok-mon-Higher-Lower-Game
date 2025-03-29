const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

function PokemonCard({ pokemon, title, hiddenStats }) {
  return (
    <div className="pokemon-card">
      <h2>{title}</h2>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="pokemon-image"
      />
      <h3>{pokemon.name.toUpperCase()}</h3>
      {!hiddenStats ? (
        <ul className="pokemon-stats">
          {pokemon.stats.map((stat) => (
            <li key={stat.stat.name}>
              {stat.stat.name.toUpperCase()}: {stat.base_stat}
            </li>
          ))}
        </ul>
      ) : (
        <p>Guess the stat!</p>
      )}
    </div>
  );
}
//scroe
function ScoreBoard({ score }) {
  return (
    <div className="score-board">
      <h2>Score: {score}</h2>
    </div>
  );
}

//buttons
function GameControls({ onGuess }) {
  return (
    <div className="game-controls">
      <button onClick={() => onGuess(true)} className="guess-button">
        Higher
      </button>
      <button onClick={() => onGuess(false)} className="guess-button">
        Lower
      </button>
    </div>
  );
}

function App() {
  const [currentPokemon, setCurrentPokemon] = React.useState(null);
  const [nextPokemon, setNextPokemon] = React.useState(null);
  const [score, setScore] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const fetchPokemon = async (id) => {
    try {
      const response = await fetch(`${API_URL}${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
  };

  React.useEffect(() => {
    async function loadInitialPokemon() {
      setLoading(true);
      const firstId = Math.floor(Math.random() * 150) + 1;
      const secondId = Math.floor(Math.random() * 150) + 1;
      const firstPokemon = await fetchPokemon(firstId);
      const secondPokemon = await fetchPokemon(secondId);
      setCurrentPokemon(firstPokemon);
      setNextPokemon(secondPokemon);
      setLoading(false);
    }
    loadInitialPokemon();
  }, []);
  
  const loadNewPokemon = async () => {
    const randomId = Math.floor(Math.random() * 150) + 1;
    const newPokemon = await fetchPokemon(randomId);
    setNextPokemon(newPokemon);
  };

  // Handle the player's guess based on the "hp" stat
  const handleGuess = (isHigher) => {
    if (!currentPokemon || !nextPokemon) return;

    const currentStat = currentPokemon.stats.find(
      (stat) => stat.stat.name === 'hp'
    ).base_stat;
    const nextStat = nextPokemon.stats.find(
      (stat) => stat.stat.name === 'hp'
    ).base_stat;

    const guessCorrect = isHigher ? nextStat > currentStat : nextStat < currentStat;

    if (guessCorrect) {
      setScore(score + 1);
      setCurrentPokemon(nextPokemon);
      loadNewPokemon();
    } else {
      alert(`Wrong guess! Your final score was ${score}`);
      setScore(0);
      async function resetGame() {
        const firstId = Math.floor(Math.random() * 150) + 1;
        const secondId = Math.floor(Math.random() * 150) + 1;
        const firstPokemon = await fetchPokemon(firstId);
        const secondPokemon = await fetchPokemon(secondId);
        setCurrentPokemon(firstPokemon);
        setNextPokemon(secondPokemon);
      }
      resetGame();
    }
  };

  if (loading || !currentPokemon || !nextPokemon) {
    return <div className="loading">Loading Pokémon...</div>;
  }

  return (
    <div className="app-container">
      <h1>Pokémon Higher/Lower Game</h1>
      <ScoreBoard score={score} />
      <div className="game-container">
        <PokemonCard pokemon={currentPokemon} title="Current Pokémon" />
        <div className="vs">VS</div>
        <PokemonCard
          pokemon={nextPokemon}
          title="Next Pokémon"
          hiddenStats={true}
        />
      </div>
      <GameControls onGuess={handleGuess} />
    </div>
  );
}

// Render the App into the root element
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
