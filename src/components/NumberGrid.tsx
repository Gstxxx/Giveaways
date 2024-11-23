import { Buyer } from '../types.js';

interface NumberGridProps {
  totalNumbers: number;
  buyers: Buyer[];
  selectedNumbers: number[];
  onNumberClick: (number: number) => void;
}

export function NumberGrid({ totalNumbers, buyers, selectedNumbers, onNumberClick }: NumberGridProps) {
  const isSold = (number: number) => buyers.some(buyer => buyer.numbers.includes(number));
  const isSelected = (number: number) => selectedNumbers.includes(number);
  const getBuyerName = (number: number) => buyers.find(buyer => buyer.numbers.includes(number))?.name;

  return (
    <div className="grid grid-cols-5 gap-1 p-4 bg-white rounded-lg shadow-lg md:grid-cols-20">
      {Array.from({ length: totalNumbers }, (_, i) => i + 1).map((number) => {
        const sold = isSold(number);
        const selected = isSelected(number);
        const buyerName = getBuyerName(number);

        return (
          <button
            key={number}
            onClick={() => !sold && onNumberClick(number)}
            disabled={sold}
            className={`
              aspect-square p-2 text-sm font-medium rounded-md
              transition-all duration-200 relative group
              ${sold
                ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                : selected
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }
            `}
          >
            {number}
            {sold && (
              <div className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded-md -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                {buyerName}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}