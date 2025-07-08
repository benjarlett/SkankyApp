
import React from 'react';
import { Loop, Band } from '../types';
import { PlayIcon, StopIcon, EditIcon, LoopIcon } from './icons';

interface LoopItemProps {
  loop: Loop;
  band: Band | undefined;
  isPlaying: boolean;
  onPlay: (loop: Loop) => void;
  onEdit: (loop: Loop) => void;
}

const LoopItem: React.FC<LoopItemProps> = ({ loop, band, isPlaying, onPlay, onEdit }) => {
  const playbackRate = Math.pow(2, (loop.transposeSemitones * 100 + loop.tuneCents) / 1200);

  return (
    <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700 hover:border-skanky-yellow transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onPlay(loop)}
          className={`p-3 rounded-full transition-colors ${isPlaying ? 'bg-skanky-red text-white' : 'bg-skanky-green text-black'}`}
        >
          {isPlaying ? <StopIcon /> : <PlayIcon />}
        </button>
        <div>
          <h3 className="text-lg text-white font-bold">{loop.title}</h3>
          <p className="text-sm text-gray-400">{band?.name || 'No Band'}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-gray-400">
        {loop.looping && <LoopIcon className="w-5 h-5 text-skanky-yellow" title="Looping enabled" />}
        <div className="text-center text-xs hidden sm:block">
            <div>Tune</div>
            <div>{(playbackRate).toFixed(3)}x</div>
        </div>
        <div className="text-center text-xs hidden sm:block">
          <div>Transpose</div>
          <div>{loop.transposeSemitones >= 0 ? `+${loop.transposeSemitones}`: loop.transposeSemitones} st</div>
        </div>
        <button onClick={() => onEdit(loop)} className="p-2 text-gray-400 hover:text-skanky-yellow transition-colors">
          <EditIcon />
        </button>
      </div>
    </div>
  );
};

export default LoopItem;
