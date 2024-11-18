export interface Buyer {
  id: string;
  name: string;
  numbers: number[];
  purchaseDate: string;
}

export interface Winner {
  id: string;
  buyerId: string;
  buyerName: string;
  number: number;
  drawDate: string;
}

export interface RaffleState {
  buyers: Buyer[];
  winners: Winner[];
  totalNumbers: number;
}