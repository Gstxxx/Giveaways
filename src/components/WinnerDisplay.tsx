import { Trophy } from 'lucide-react';
import { Winner } from '../types.js';

interface WinnerDisplayProps {
  winners: Winner[];
  onDraw: () => void;
  canDraw: boolean;
}

export function WinnerDisplay({ winners, onDraw, canDraw }: WinnerDisplayProps) {
  const latestWinners = winners.slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Ganhadores
      </h2>

      {latestWinners.length > 0 ? (
        <div className="space-y-3">
          {latestWinners.map((winner, index) => (
            <div
              key={winner.id}
              className={`bg-gradient-to-r ${index === 0 ? 'from-yellow-400 to-yellow-600' : index === 1 ? 'from-zinc-400 to-zinc-600' : index === 2 ? 'from-yellow-700 to-yellow-900' : 'from-zinc-300 to-zinc-400'} text-white p-4 rounded-lg`}
            >
              <div className="text-3xl font-bold mb-1">#{index + 1}</div>
              <div className="text-lg">{winner.buyerName}</div>
              <div className="text-sm opacity-75">
                {new Date(winner.drawDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">Aperte o botão para escolher o proximo ganhador!</p>
          <button
            onClick={onDraw}
            disabled={!canDraw}
            className={`
              px-6 py-3 rounded-lg text-white font-medium
              transition-all duration-200
              ${canDraw
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                : 'bg-gray-400 cursor-not-allowed'
              }
            `}
          >
            Escolher ganhador
          </button>
        </div>
      )}

      {latestWinners.length > 0 && (
        <button
          onClick={onDraw}
          disabled={!canDraw}
          className={`
            mt-4 px-6 py-3 rounded-lg text-white font-medium w-full
            transition-all duration-200
            ${canDraw
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              : 'bg-gray-400 cursor-not-allowed'
            }
          `}
        >
          Escolher proximo ganhador
        </button>
      )}
    </div>
  );
}