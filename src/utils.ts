
import { ALL_ITEMS } from "./constants";
import { CellData } from './types';

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const generateNewBingo = (): CellData[] => {
  const shuffled = shuffleArray(ALL_ITEMS);
  const selected = shuffled.slice(0, 25);
  // 一意のID生成のためにタイムスタンプを使用
  const timestamp = Date.now();
  return selected.map((item, index) => ({
    id: `cell-${timestamp}-${index}`,
    text: item,
    isSelected: false,
    displayIndex: index + 1,
  }));
};
