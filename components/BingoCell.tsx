
import React from 'react';
import { CellData } from '../types.ts';

interface BingoCellProps {
  data: CellData;
  onClick: () => void;
}

const BingoCell: React.FC<BingoCellProps> = ({ data, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative aspect-square w-full p-2 sm:p-4 border-r border-b border-orange-100/60
        flex items-center justify-center text-center
        transition-all duration-300 ease-in-out
        ${data.isSelected 
          ? 'bg-orange-50/40' 
          : 'bg-white hover:bg-orange-50/20'
        }
        active:scale-95
      `}
    >
      {/* 左上の番号 - 少し視認性を上げつつ控えめに */}
      <span className="absolute top-1.5 left-2 text-[9px] sm:text-[11px] text-stone-300 font-bold select-none">
        {data.displayIndex}
      </span>

      <span className={`
        text-[11px] sm:text-sm md:text-[15px] leading-[1.3] text-stone-600 font-medium px-0.5
        ${data.isSelected ? 'opacity-40' : 'opacity-100'}
        break-words
      `}>
        {data.text}
      </span>
      
      {data.isSelected && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg 
            className="w-[85%] h-[85%] text-orange-200/70" 
            viewBox="0 0 100 100" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="4"
          >
            <circle cx="50" cy="50" r="42" />
          </svg>
        </div>
      )}
    </button>
  );
};

export default BingoCell;
