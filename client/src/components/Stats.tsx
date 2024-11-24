import { DollarSign } from 'lucide-react';

interface StatsProps {
  soldCount: number;
  availableCount: number;
}

export function Stats({ soldCount, availableCount }: StatsProps) {
  const totalRevenue = soldCount * 10;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-sm text-gray-500">Vendidos</div>
        <div className="text-2xl font-bold text-emerald-600">{soldCount}</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-sm text-gray-500">Disponiveis</div>
        <div className="text-2xl font-bold text-blue-600">{availableCount}</div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <DollarSign className="w-4 h-4" />
          Arrecadado
        </div>
        <div className="text-2xl font-bold text-gray-900">
          R$ {totalRevenue.toFixed(2)}
        </div>
      </div>
    </div>
  );
}