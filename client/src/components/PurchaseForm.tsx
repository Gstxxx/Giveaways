import React, { useState } from 'react';
import { Buyer } from '../types';
import { UserPlus, X } from 'lucide-react';
import { useToast } from "../hooks/use-toast.js"
import { submit as buyer } from "@/lib/buyer.js";

interface PurchaseFormProps {
  onPurchase: (buyer: Omit<Buyer, 'id' | 'purchaseDate'>) => void;
  availableNumbers: number[];
  selectedNumbers: number[];
  onNumberSelect: (number: number) => void;
  onClearSelection: () => void;
}

export function PurchaseForm({
  onPurchase,
  selectedNumbers,
  onClearSelection
}: PurchaseFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && selectedNumbers.length > 0) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('numbers', selectedNumbers.join(','));

      try {

        const name = formData.get("name")?.toString();
        const numbers = formData.get("numbers")?.toString().split(',').map(Number);

        if (!name || !numbers || numbers.length === 0) {
          return { error: "Invalid name or numbers." };
        }

        const response = await buyer({ name, numbers });
        if (response.ok) {
          const newBuyer = { name, numbers: selectedNumbers };
          onPurchase(newBuyer);
          setName('');
          onClearSelection();
          window.location.reload();
          toast({
            title: "Compra realizada",
            description: `Comprador ${newBuyer.name} adicionado com sucesso.`,
          });
          return { success: true, message: "Purchase successful" };
        }
        return { error: "An error occurred while processing the purchase.", err: response.status };
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const totalPrice = selectedNumbers.length * 10;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <UserPlus className="w-5 h-5" />
        Registrar Compra
      </h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nome do comprador
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Numeros selecionados
          </label>
          {selectedNumbers.length > 0 && (
            <button
              type="button"
              onClick={onClearSelection}
              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              limpar
            </button>
          )}
        </div>

        <div className="min-h-[3rem] p-2 bg-gray-50 rounded-md flex flex-wrap gap-2">
          {selectedNumbers.length === 0 ? (
            <p className="text-gray-500 text-sm">Aperte o numero na tabela pra escolhe-lo</p>
          ) : (
            selectedNumbers.sort((a, b) => a - b).map(num => (
              <span
                key={num}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm font-medium"
              >
                #{num}
              </span>
            ))
          )}
        </div>
      </div>

      {selectedNumbers.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-md">
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-700">Valor por numero:</span>
            <span className="font-medium">R$ 10,00</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-blue-700">Numeros selecionados:</span>
            <span className="font-medium">{selectedNumbers.length}</span>
          </div>
          <div className="border-t border-blue-200 mt-2 pt-2 flex justify-between items-center">
            <span className="text-blue-800 font-medium">Total:</span>
            <span className="text-blue-800 font-bold">R$ {totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={selectedNumbers.length === 0 || !name}
        className={`
          w-full py-2 px-4 rounded-md transition-colors
          ${selectedNumbers.length === 0 || !name
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
          }
        `}
      >
        Registrar compra
      </button>
    </form>
  );
}