import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NumberGrid } from './components/NumberGrid.js';
import { PurchaseForm } from './components/PurchaseForm.js';
import { WinnerDisplay } from './components/WinnerDisplay.js';
import { WinnerHistory } from './components/WinnerHistory.js';
import { Stats } from './components/Stats.js';
import { Buyer, RaffleState } from './types.js';
import { LayoutGrid, Users } from 'lucide-react';
import { useToast } from "./hooks/use-toast.js"
import { Toaster } from "./components/ui/toaster.js"
import { submit as buyersAction } from "@/lib/buyers.js";
import { submit as winnersAction } from "@/lib/winners.js";
import { submit as testAction } from "@/lib/test.js";
import { submit as getWinnersAction } from "@/lib/get-winners.js"

const TOTAL_NUMBERS = 400;

interface BuyerResponse {
  id: string;
  name: string;
  purchaseDate: string;
  raffleStateId: string | null;
  purchases: { id: string; number: number; buyerId: string }[];
}

function App() {
  const { toast } = useToast()
  const [state, setState] = useState<RaffleState>({
    buyers: [],
    winners: [],
    totalNumbers: TOTAL_NUMBERS,
  });
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const response = await buyersAction();
        if (response.ok) {
          const buyers: BuyerResponse[] = await response.json();
          const transformedBuyers = buyers.map((buyer: BuyerResponse) => ({
            ...buyer,
            numbers: buyer.purchases.map(purchase => purchase.number),
          }));
          setState(prev => ({ ...prev, buyers: transformedBuyers }));
        } else {
          console.error('Failed to fetch buyers:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching buyers:', error);
      }
    };

    const fetchWinners = async () => {
      try {
        const response = await getWinnersAction();
        if (response.ok) {
          const winners = await response.json();
          setState(prev => ({ ...prev, winners }));
        } else {
          console.error('Failed to fetch winners:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching winners:', error);
      }
    };

    fetchBuyers();
    fetchWinners();
  }, []);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await testAction();
        if (response.ok) {
          const data = await response.json();
          console.log('Test data:', data);
        } else {
          console.error('Failed to fetch test data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching test data:', error);
      }
    };

    fetchTest();
  }, []);

  const availableNumbers = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1)
    .filter(num => !state.buyers.some(buyer => buyer.numbers.includes(num)));


  const handleNumberClick = (number: number) => {
    setSelectedNumbers(prev =>
      prev.includes(number)
        ? prev.filter(n => n !== number)
        : [...prev, number]
    );
  };

  const handlePurchase = (newBuyer: Omit<Buyer, 'id' | 'purchaseDate'>) => {
    const buyer: Buyer = {
      id: uuidv4(),
      ...newBuyer,
      purchaseDate: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      buyers: [...prev.buyers, buyer],
    }));
  };
  const handleDraw = async () => {
    if (state.buyers.length === 0) return;

    const weightedNumbers = state.buyers.flatMap(buyer =>
      buyer.numbers.map(number => ({
        number,
        buyerId: buyer.id,
        buyerName: buyer.name,
        weight: buyer.numbers.length,
      }))
    );

    const shuffledNumbers = weightedNumbers.sort(() => Math.random() - 0.5);

    const podium = shuffledNumbers.slice(0, 5).map(entry => ({
      id: uuidv4(),
      buyerId: entry.buyerId,
      buyerName: entry.buyerName,
      number: entry.number,
      drawDate: new Date().toISOString(),
    }));

    try {
      const response = await winnersAction(podium);
      if (response.ok) {
        const savedWinners = await response.json();
        setState(prev => ({
          ...prev,
          winners: [...savedWinners, ...prev.winners],
          buyers: prev.buyers.map(buyer => {
            if (podium.some(winner => winner.buyerId === buyer.id)) {
              return {
                ...buyer,
                numbers: buyer.numbers.filter(n => !podium.some(winner => winner.number === n)),
              };
            }
            return buyer;
          }).filter(buyer => buyer.numbers.length > 0),
        }));
        toast({
          title: "Sorteio realizado",
          description: "Os vencedores foram selecionados com sucesso.",
        });
      } else {
        console.error('Failed to save winners');
        toast({
          title: "Erro",
          description: "Falha ao salvar os vencedores.",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro durante o sorteio.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Rifa do pitoco</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Stats
          soldCount={TOTAL_NUMBERS - availableNumbers.length}
          availableCount={availableNumbers.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5" />
                  Números disponíveis
                </h2>
              </div>
              <NumberGrid
                totalNumbers={TOTAL_NUMBERS}
                buyers={state.buyers}
                selectedNumbers={selectedNumbers}
                onNumberClick={handleNumberClick}
              />
            </div>

            <WinnerHistory winners={state.winners} />
          </div>

          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
                <Users className="w-5 h-5" />
                Compradores
              </h2>
              <div className="space-y-2 overflow-y-auto max-h-48">
                {state.buyers.map(buyer => (
                  <div
                    key={buyer.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <span className="text-gray-700">{buyer.name}</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {[...new Set(buyer.numbers)].map(number => (
                        <span key={number} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm">
                          #{number}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {state.buyers.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Sem compradores</p>
                )}
              </div>
            </div>

            <PurchaseForm
              onPurchase={handlePurchase}
              availableNumbers={availableNumbers}
              selectedNumbers={selectedNumbers}
              onNumberSelect={handleNumberClick}
              onClearSelection={() => setSelectedNumbers([])}
            />

            <WinnerDisplay
              winners={state.winners}
              onDraw={handleDraw}
              canDraw={state.buyers.some(buyer => buyer.numbers.length > 0)}
            />
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
}

export default App;