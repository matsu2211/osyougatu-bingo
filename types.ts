
export interface CellData {
  id: string;
  text: string;
  isSelected: boolean;
  displayIndex: number;
}

export interface BingoState {
  cells: CellData[];
  createdAt: number;
}
