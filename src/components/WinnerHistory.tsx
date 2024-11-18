import { History } from 'lucide-react';
import { Winner } from '../types';

interface WinnerHistoryProps {
  winners: Winner[];
}

export function WinnerHistory({ winners }: WinnerHistoryProps) {
  if (winners.length === 0) return null;

  const chunkWinners = (winners: Winner[], size: number) => {
    const chunks = [];
    for (let i = 0; i < winners.length; i += size) {
      chunks.push(winners.slice(i, i + size));
    }
    return chunks;
  };

  const winnerChunks = chunkWinners(winners, 5);

  return (
    <div className="space-y-6">
      {winnerChunks.map((chunk, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <History className="w-5 h-5" />
            Ganhadores do sorteio #{index + 1}
          </h2>

          <div className="flex space-x-3">
            {chunk.map((winner) => (
              <div
                key={winner.id}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg"
              >
                <div className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-md">
                  #{winner.number}
                </div>
                <div className="text-gray-700">{winner.buyerName}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}