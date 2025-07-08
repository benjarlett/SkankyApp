
import React, { useRef, useState } from 'react';
import { Setlist, Band } from '../types';
import { DeleteIcon, PlusIcon, MusicNoteIcon } from './icons';

interface SidebarProps {
  setlists: Setlist[];
  bands: Band[];
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  onAddLoop: (file: File) => void;
  onAddSetlist: (name: string) => void;
  onDeleteSetlist: (id: string) => void;
  onAddBand: (name: string) => void;
  onDeleteBand: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  setlists,
  bands,
  currentFilter,
  onFilterChange,
  onAddLoop,
  onAddSetlist,
  onDeleteSetlist,
  onAddBand,
  onDeleteBand,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newSetlistName, setNewSetlistName] = useState('');
  const [newBandName, setNewBandName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      Array.from(event.target.files).forEach(file => onAddLoop(file));
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleAddSetlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSetlistName.trim()) {
      onAddSetlist(newSetlistName.trim());
      setNewSetlistName('');
    }
  };

  const handleAddBand = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBandName.trim()) {
      onAddBand(newBandName.trim());
      setNewBandName('');
    }
  };


  return (
    <aside className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-skanky-yellow text-center tracking-wider">SkankyReminders</h1>
      
      <input type="file" multiple accept="audio/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
      <button onClick={triggerFileSelect} className="w-full flex items-center justify-center gap-2 bg-skanky-green text-black font-bold py-3 px-4 rounded hover:bg-green-400 transition-colors">
        <PlusIcon /> Add Audio Loop(s)
      </button>

      {/* Setlists */}
      <div>
        <h2 className="text-xl font-bold text-skanky-yellow mb-2">Setlists</h2>
        <div className="flex flex-col gap-1">
            <button onClick={() => onFilterChange('All')} className={`p-2 text-left rounded ${currentFilter === 'All' ? 'bg-skanky-yellow text-black' : 'text-white hover:bg-gray-700'}`}>All Loops</button>
            {setlists.map(setlist => (
            <div key={setlist.id} className={`flex items-center justify-between rounded ${currentFilter === setlist.id ? 'bg-skanky-yellow text-black' : 'text-white hover:bg-gray-700'}`}>
                <button onClick={() => onFilterChange(setlist.id)} className="p-2 text-left flex-grow">{setlist.name}</button>
                <button onClick={() => onDeleteSetlist(setlist.id)} className="p-2 hover:text-skanky-red"><DeleteIcon className="w-4 h-4"/></button>
            </div>
            ))}
        </div>
        <form onSubmit={handleAddSetlist} className="flex gap-2 mt-2">
          <input type="text" value={newSetlistName} onChange={e => setNewSetlistName(e.target.value)} placeholder="New Setlist Name" className="flex-grow p-2 bg-gray-800 border border-gray-700 rounded text-white" />
          <button type="submit" className="p-2 bg-skanky-yellow text-black rounded hover:bg-yellow-200"><PlusIcon className="w-5 h-5"/></button>
        </form>
      </div>

      {/* Bands */}
      <div>
        <h2 className="text-xl font-bold text-skanky-yellow mb-2 flex items-center gap-2"><MusicNoteIcon /> Bands</h2>
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
            {bands.map(band => (
            <div key={band.id} className="flex items-center justify-between text-white hover:bg-gray-700 rounded pr-2">
                <span className="p-2 text-left flex-grow">{band.name}</span>
                <button onClick={() => onDeleteBand(band.id)} className="p-2 hover:text-skanky-red"><DeleteIcon className="w-4 h-4"/></button>
            </div>
            ))}
        </div>
         <form onSubmit={handleAddBand} className="flex gap-2 mt-2">
          <input type="text" value={newBandName} onChange={e => setNewBandName(e.target.value)} placeholder="New Band Name" className="flex-grow p-2 bg-gray-800 border border-gray-700 rounded text-white" />
          <button type="submit" className="p-2 bg-skanky-yellow text-black rounded hover:bg-yellow-200"><PlusIcon className="w-5 h-5"/></button>
        </form>
      </div>
    </aside>
  );
};

export default Sidebar;
