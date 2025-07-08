
import React, { useState, useEffect } from 'react';
import { Loop, Setlist, Band } from '../types';
import EmbeddedPlayer from './EmbeddedPlayer';
import { DeleteIcon, LoopIcon } from './icons';

interface LoopEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (loop: Loop) => void;
  onDelete: (loopId: string) => void;
  loopToEdit: Loop | null;
  setlists: Setlist[];
  bands: Band[];
}

const LoopEditorModal: React.FC<LoopEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  loopToEdit,
  setlists,
  bands
}) => {
  const [formData, setFormData] = useState<Partial<Loop>>({});

  useEffect(() => {
    if (loopToEdit) {
      setFormData({ ...loopToEdit });
    } else {
      // This case should ideally not be hit since we create a loop first
      setFormData({
        title: '',
        bandId: null,
        looping: true,
        spotifyLink: '',
        youtubeLink: '',
        setlistIds: [],
        transposeSemitones: 0,
        tuneCents: 0,
      });
    }
  }, [loopToEdit, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'range') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSetlistChange = (setlistId: string) => {
    const currentSetlistIds = formData.setlistIds || [];
    const newSetlistIds = currentSetlistIds.includes(setlistId)
      ? currentSetlistIds.filter(id => id !== setlistId)
      : [...currentSetlistIds, setlistId];
    setFormData(prev => ({ ...prev, setlistIds: newSetlistIds }));
  };
  
  const handleSave = () => {
    if (formData.title?.trim()) {
      onSave(formData as Loop);
      onClose();
    } else {
      alert("Loop must have a title.");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this loop? This cannot be undone.")) {
      if(loopToEdit) {
        onDelete(loopToEdit.id);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 border border-skanky-yellow text-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl text-skanky-yellow">{loopToEdit ? 'Edit Loop' : 'New Loop'}</h2>
          <button onClick={onClose} className="text-white hover:text-skanky-yellow text-3xl leading-none">&times;</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {loopToEdit && <div className="text-xs text-gray-500 truncate">Filename: {loopToEdit.fileName}</div>}
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-400">Title</label>
              <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-400">Band</label>
              <select name="bandId" value={formData.bandId || ''} onChange={handleInputChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded">
                <option value="">None</option>
                {bands.map(band => <option key={band.id} value={band.id}>{band.name}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-gray-400 flex items-center gap-2"><LoopIcon /> Loop Playback</label>
              <input type="checkbox" name="looping" checked={!!formData.looping} onChange={handleInputChange} className="w-6 h-6 accent-skanky-yellow" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-400">Transpose (Semitones: {formData.transposeSemitones || 0})</label>
              <input type="range" name="transposeSemitones" min="-12" max="12" value={formData.transposeSemitones || 0} onChange={handleInputChange} className="w-full accent-skanky-yellow" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-400">Fine Tune (Cents: {formData.tuneCents || 0})</label>
              <input type="range" name="tuneCents" min="-50" max="50" value={formData.tuneCents || 0} onChange={handleInputChange} className="w-full accent-skanky-yellow" />
            </div>
             <div>
              <label className="block text-sm font-bold mb-2 text-gray-400">Add to Setlists</label>
              <div className="max-h-32 overflow-y-auto bg-gray-800 border border-gray-700 rounded p-2 space-y-1">
                {setlists.map(setlist => (
                  <label key={setlist.id} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.setlistIds?.includes(setlist.id) || false} onChange={() => handleSetlistChange(setlist.id)} className="accent-skanky-yellow" />
                    <span>{setlist.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-400">YouTube Link</label>
              <input type="text" name="youtubeLink" value={formData.youtubeLink || ''} onChange={handleInputChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1 text-gray-400">Spotify Link</label>
              <input type="text" name="spotifyLink" value={formData.spotifyLink || ''} onChange={handleInputChange} className="w-full p-2 bg-gray-800 border border-gray-700 rounded" />
            </div>
            <EmbeddedPlayer youtubeLink={formData.youtubeLink || ''} spotifyLink={formData.spotifyLink || ''} />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
            <div>
                {loopToEdit && (
                    <button onClick={handleDelete} className="flex items-center gap-2 bg-skanky-red text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors">
                        <DeleteIcon /> Delete Loop
                    </button>
                )}
            </div>
            <div className="flex gap-4">
                <button onClick={onClose} className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-500 transition-colors">Cancel</button>
                <button onClick={handleSave} className="bg-skanky-green text-black font-bold py-2 px-4 rounded hover:bg-green-400 transition-colors">Save Loop</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoopEditorModal;
