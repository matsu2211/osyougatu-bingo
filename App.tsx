
import React, { useState, useEffect, useCallback } from 'react';
import { CellData, BingoState } from './types.ts';
import { STORAGE_KEY } from './constants.ts';
import { generateNewBingo } from './utils.ts';
import BingoCell from './components/BingoCell.tsx';

const App: React.FC = () => {
  const [cells, setCells] = useState<CellData[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  // Initialize state from local storage or generate new
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: BingoState = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.cells) && parsed.cells.length === 25) {
          // 既存データに displayIndex がない場合の補完
          const migratedCells = parsed.cells.map((cell, idx) => ({
            ...cell,
            displayIndex: cell.displayIndex || (idx + 1)
          }));
          setCells(migratedCells);
        } else {
          setCells(generateNewBingo());
        }
      } catch (e) {
        console.error('Failed to parse saved state', e);
        setCells(generateNewBingo());
      }
    } else {
      setCells(generateNewBingo());
    }
    setIsInitialized(true);
  }, []);

  // Sync state to local storage whenever cells change
  useEffect(() => {
    if (isInitialized && cells.length > 0) {
      const state: BingoState = {
        cells,
        createdAt: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [cells, isInitialized]);

  const handleCellClick = useCallback((index: number) => {
    setCells(prev => {
      const next = [...prev];
      next[index] = { ...next[index], isSelected: !next[index].isSelected };
      return next;
    });
  }, []);

  const handleResetRequest = () => {
    setIsConfirming(true);
  };

  const handleConfirmReset = () => {
    const newBoard = generateNewBingo();
    localStorage.removeItem(STORAGE_KEY);
    setCells(newBoard);
    setIsConfirming(false);
    // 画面上部へスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelReset = () => {
    setIsConfirming(false);
  };

  if (!isInitialized) return null;

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center px-4 py-8 md:py-16">
      {/* Header */}
      <header className="text-center mb-8 md:mb-14 w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-stone-700 tracking-tight mb-3">
          年末年始ビンゴ
        </h1>
        <p className="text-sm md:text-lg text-stone-400 font-medium">
          体験した、見た・聞いた・知った、でも◯でOK
        </p>
      </header>

      {/* Main Bingo Board - Increased max-width for better visibility */}
      <main className="w-full max-w-[640px] bg-white shadow-md border border-orange-100 rounded-2xl overflow-hidden mb-12">
        <div className="grid grid-cols-5 border-l border-t border-orange-100/30">
          {cells.map((cell, index) => (
            <BingoCell 
              key={cell.id} 
              data={cell} 
              onClick={() => handleCellClick(index)} 
            />
          ))}
        </div>
      </main>

      {/* Footer / Controls */}
      <footer className="w-full max-w-2xl flex flex-col items-center gap-10">
        {!isConfirming ? (
          <button
            onClick={handleResetRequest}
            className="
              px-12 py-4 bg-orange-100/60 hover:bg-orange-200/60 text-stone-600 
              rounded-full text-base md:text-lg font-medium transition-all
              active:scale-95 shadow-sm
            "
          >
            新しく作る
          </button>
        ) : (
          <div className="flex flex-col items-center gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-base text-stone-500 font-medium">新しく作り直しますか？</p>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmReset}
                className="px-10 py-3 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-full text-base font-medium transition-all active:scale-95 shadow-sm"
              >
                はい
              </button>
              <button
                onClick={handleCancelReset}
                className="px-10 py-3 bg-white border border-stone-200 text-stone-500 rounded-full text-base font-medium transition-all active:scale-95 shadow-sm"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        <div className="text-[12px] md:text-[13px] text-stone-400 text-center leading-relaxed max-w-sm opacity-80">
          このアプリは自分なりの年末年始をのんびりふりかえるためのものです。<br />
          誰かと競ったり、評価したりする必要はありません。
        </div>
      </footer>
    </div>
  );
};

export default App;
