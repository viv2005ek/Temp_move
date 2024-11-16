import { useState } from 'react';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const moduleAddress =
  "0x610ea90387f24c61fa507060dfb272a901ef420411473ab344cc45d72904e3bb";
const moduleName = "RockPaperScissors_01";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const client = new Aptos(aptosConfig);

function App() {
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const [gameState, setGameState] = useState(false); // reactive framework
  const [userSelection, setUserSelection] = useState("");
  const [computerSelection, setComputerSelection] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function toggleGameState() {
    setGameState(!gameState);

    const payload: InputTransactionData = {
      data: {
        function: `${moduleAddress}::${moduleName}::createGame`,
        functionArguments: []
      }
    };

    await handleTransaction(payload);
    setUserSelection("");
    setComputerSelection("");
    setResult("");
  }

  async function handleMove(move: string) {
    if (move === "Clear") {
      setUserSelection("");
      setComputerSelection("");
      setResult("");
    } else {
      const payload: InputTransactionData = {
        data: {
          function: `${moduleAddress}::${moduleName}::duel`,
          functionArguments: [move]
        }
      };
      await handleTransaction(payload);
      setUserSelection(move);
    }
  }

  const handleTransaction = async (payload: InputTransactionData) => {
    if (!account) return;
    setLoading(true);

    try {
      const tx = await signAndSubmitTransaction(payload);
      console.log(tx);

      const resultData = await client.getAccountResource({
        accountAddress: account?.address,
        resourceType: `${moduleAddress}::${moduleName}::DuelResult`
      });

      console.log(resultData);

      const duelResult = resultData.duel_result.toString();

      if (duelResult === "Win") {
        setResult("You win");
      } else if (duelResult === "Lose") {
        setResult("You lose");
      } else {
        setResult("Draw");
      }
      setComputerSelection(resultData.computer_selection.toString());
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center bg-neutral-100 relative">
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-xl">
            <div className="text-2xl font-semibold">Loading...</div>
          </div>
        </div>
      )}
      <div className="absolute right-4 top-4">
        <WalletSelector />
      </div>

      {connected ? (
        <div className="h-screen flex flex-col items-center justify-center">
          {/* Welcome Section */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800">Welcome to Poki-verse</h1>
            <button
              id="mode"
              className="mt-4 px-4 py-2 rounded-lg bg-yellow-400 text-black flex items-center"
            >
              <i className="fa-regular fa-lightbulb mr-2"></i>
              <span>Light mode</span>
            </button>
          </div>

          {/* Pokemon Choices */}
          <h1 className="text-3xl font-semibold text-gray-700 mb-6">
            Choose your Pokemon:
          </h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="choice text-center p-4 border rounded-lg">
              <img src="ground-removebg-preview.png" alt="Ground" className="w-16 h-16 mx-auto" />
              <i className="fa-solid fa-map-pin text-xl"></i>
              <p>Ground-type</p>
            </div>
            <div className="choice text-center p-4 border rounded-lg">
              <img src="water-removebg-preview (1).png" alt="Water" className="w-16 h-16 mx-auto" />
              <i className="fa-solid fa-droplet text-xl"></i>
              <p>Water-type</p>
            </div>
            <div className="choice text-center p-4 border rounded-lg">
              <img src="fire-removebg-preview-removebg-preview.png" alt="Fire" className="w-16 h-16 mx-auto" />
              <i className="fa-solid fa-fire text-xl"></i>
              <p>Fire-type</p>
            </div>
            <div className="choice text-center p-4 border rounded-lg">
              <img src="grass-removebg-preview.png" alt="Grass" className="w-16 h-16 mx-auto" />
              <i className="fa-brands fa-pagelines text-xl"></i>
              <p>Grass-type</p>
            </div>
            <div className="choice text-center p-4 border rounded-lg">
              <img src="flying-removebg-preview-removebg-preview.png" alt="Flying" className="w-16 h-16 mx-auto" />
              <i className="fa-solid fa-dove text-xl"></i>
              <p>Flying-type</p>
            </div>
          </div>

          {/* Game Controls */}
          <h1 className="text-2xl font-semibold text-gray-700 mb-4">
            <i className="fa-solid fa-user-ninja"></i> Choose a Pokemon
          </h1>
          <h2
            id="fight"
            className="text-xl text-blue-600 cursor-pointer"
            onClick={() => handleMove("Fire")}
          >
            <i className="fa-brands fa-free-code-camp mr-2"></i> Fight
          </h2>

          {/* Scores */}
          <div className="flex justify-around my-4 w-full">
            <div id="y_score" className="text-center">
              <h4 className="text-lg"><i className="fa-regular fa-user"></i> Your Score</h4>
              <h4 id="yourScore">0</h4>
            </div>
            <div id="c_score" className="text-center">
              <h4 className="text-lg"><i className="fa-solid fa-computer"></i> Computer Score</h4>
              <h4 id="computerScore">0</h4>
            </div>
          </div>

          {/* Result */}
          <div id="result" className="mt-6">
            <div className="bg-green-500 text-white rounded-lg p-4 text-2xl font-semibold text-center">
              Game Results: {result || "-"}
            </div>
          </div>

          {/* Rules Section */}
          <details id="rules" className="mt-6">
            <summary>
              <h3 className="inline-block text-lg">
                <i className="fa-solid fa-scale-balanced mr-2"></i> Rules
              </h3>
            </summary>
            <p className="text-sm mt-2">
              <span className="font-bold">Rules:</span> Fire type pokemon weakness is Water and Ground type pokemon...
            </p>
          </details>

          {/* About Me Section */}
          <fieldset id="aboutMe" className="mt-6">
            <legend className="font-bold">About Me</legend>
            <p>
              To know about me, please visit the page <a
                href="https://6f636e60-1268-46ab-97bc-8837abd70373-00-1qn7pm9q7ojyg.kirk.replit.dev/"
                target="_blank"
                className="text-blue-600"
              >
                Intro-Vivek
              </a>
            </p>
          </fieldset>
        </div>
      ) : (
        <div className="h-screen flex justify-center items-center">
          <h1 className="text-4xl font-semibold text-gray-700">Please connect your wallet to continue</h1>
        </div>
      )}
    </div>
  );
}

export default App;
