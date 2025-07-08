
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loop, Setlist, Band } from './types';
import Sidebar from './components/Sidebar';
import LoopItem from './components/LoopItem';
import LoopEditorModal from './components/LoopEditorModal';
import { saveAudioFile, getAudioFile, deleteAudioFile, saveMetadata, loadMetadata } from './db';

if (!('randomUUID' in crypto)) {
  crypto.randomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}


const App: React.FC = () => {
  const [loops, setLoops] = useState<Loop[]>([]);
  const [setlists, setSetlists] = useState<Setlist[]>([]);
  const [bands, setBands] = useState<Band[]>([]);
  
  const [currentFilter, setCurrentFilter] = useState<string>('All');
  const [playingLoopId, setPlayingLoopId] = useState<string | null>(null);
  const [editingLoop, setEditingLoop] = useState<Loop | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBuffersCache = useRef<Map<string, AudioBuffer>>(new Map());

  useEffect(() => {
    audioContextRef.current = new AudioContext();
    // Load data from IndexedDB on startup
    const loadInitialData = async () => {
      const savedData = await loadMetadata();
      if (savedData) {
        setLoops(savedData.loops || []);
        setSetlists(savedData.setlists || []);
        setBands(savedData.bands || []);
      }
      setIsDataLoaded(true);
    };
    loadInitialData();
  }, []);

  const saveDataToDB = useCallback(async () => {
    if (!isDataLoaded) return; // Don't save until initial data is loaded
    await saveMetadata({ loops, bands, setlists });
  }, [loops, bands, setlists, isDataLoaded]);

  useEffect(() => {
    saveDataToDB();
  }, [loops, bands, setlists, saveDataToDB]);


  const stopPlayback = useCallback(() => {
    if (audioSourceRef.current) {
      audioSourceRef.current.onended = null;
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
    setPlayingLoopId(null);
  }, []);

  const playLoop = useCallback(async (loop: Loop) => {
    if (!audioContextRef.current) return;
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    const isAlreadyPlaying = playingLoopId === loop.id;
    stopPlayback();

    if (isAlreadyPlaying) {
      return;
    }
    
    setPlayingLoopId(loop.id);

    try {
        let audioBuffer: AudioBuffer;
        if (audioBuffersCache.current.has(loop.id)) {
            audioBuffer = audioBuffersCache.current.get(loop.id)!;
        } else {
            const audioFile = await getAudioFile(loop.id);
            if (!audioFile) {
                throw new Error("Audio file not found in the database.");
            }
            const arrayBuffer = await audioFile.arrayBuffer();
            audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
            audioBuffersCache.current.set(loop.id, audioBuffer);
        }
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = loop.looping;
        const playbackRate = Math.pow(2, (loop.transposeSemitones * 100 + loop.tuneCents) / 1200);
        source.playbackRate.value = playbackRate;

        source.connect(audioContextRef.current.destination);
        source.start(0);

        audioSourceRef.current = source;
        source.onended = () => {
            if (audioSourceRef.current === source) {
                setPlayingLoopId(null);
                audioSourceRef.current = null;
            }
        };

    } catch (error) {
        console.error("Error playing audio:", error);
        alert(`Could not play audio for "${loop.title}". The file may be missing or corrupt.`);
        setPlayingLoopId(null);
    }

  }, [playingLoopId, stopPlayback]);

  const handleAddLoop = async (file: File) => {
    const newLoop: Loop = {
      id: crypto.randomUUID(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      bandId: null,
      fileName: file.name,
      fileType: file.type,
      looping: true,
      spotifyLink: '',
      youtubeLink: '',
      setlistIds: [],
      transposeSemitones: 0,
      tuneCents: 0,
    };
    try {
        await saveAudioFile(newLoop.id, file);
        setLoops(prev => [...prev, newLoop]);
        setEditingLoop(newLoop); // Open editor for the new loop
    } catch (error) {
        console.error("Failed to save audio file:", error);
        alert("Could not save the audio file. Please try again.");
    }
  };
  
  const handleSaveLoop = (loopToSave: Loop) => {
    setLoops(prev => {
        const index = prev.findIndex(l => l.id === loopToSave.id);
        if (index > -1) {
            const updatedLoops = [...prev];
            updatedLoops[index] = loopToSave;
            return updatedLoops;
        }
        return prev; // Should not happen for edits, but good practice
    });
    setEditingLoop(null);
  };

  const handleDeleteLoop = async (loopId: string) => {
    if (playingLoopId === loopId) {
        stopPlayback();
    }
    try {
        await deleteAudioFile(loopId);
        audioBuffersCache.current.delete(loopId);
        setLoops(prev => prev.filter(l => l.id !== loopId));
        setEditingLoop(null);
    } catch (error) {
        console.error("Failed to delete audio file:", error);
        alert("Could not delete the audio file from the database.");
    }
  };

  const handleAddSetlist = (name: string) => {
    const newSetlist: Setlist = { id: crypto.randomUUID(), name };
    setSetlists(prev => [...prev, newSetlist]);
  };

  const handleDeleteSetlist = (id: string) => {
    if (window.confirm("Are you sure? Deleting a setlist won't delete its loops.")) {
        setSetlists(prev => prev.filter(s => s.id !== id));
        // Remove this setlist from any loops that have it
        setLoops(prev => prev.map(loop => ({
            ...loop,
            setlistIds: loop.setlistIds.filter(sid => sid !== id),
        })));
        if (currentFilter === id) {
            setCurrentFilter('All');
        }
    }
  };

  const handleAddBand = (name: string) => {
      const newBand: Band = { id: crypto.randomUUID(), name };
      setBands(prev => [...prev, newBand]);
  };

  const handleDeleteBand = (id: string) => {
      if (window.confirm("Are you sure? This will remove the band from all associated loops.")) {
          setBands(prev => prev.filter(b => b.id !== id));
          // Unassign this band from any loops
          setLoops(prev => prev.map(loop => loop.bandId === id ? {...loop, bandId: null} : loop));
      }
  };

  const filteredLoops = loops.filter(loop => {
    if (currentFilter === 'All') return true;
    return loop.setlistIds.includes(currentFilter);
  });

  return (
    <div className="min-h-screen text-white p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        <div className="lg:col-span-1">
          <Sidebar
            setlists={setlists}
            bands={bands}
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            onAddLoop={handleAddLoop}
            onAddSetlist={handleAddSetlist}
            onDeleteSetlist={handleDeleteSetlist}
            onAddBand={handleAddBand}
            onDeleteBand={handleDeleteBand}
          />
        </div>
        <main className="lg:col-span-3 space-y-4">
          {!isDataLoaded ? (
             <div className="flex flex-col items-center justify-center h-64 bg-gray-900/50 rounded-lg">
                <p className="text-gray-400 text-xl">Loading SkankyReminders...</p>
            </div>
          ) : filteredLoops.length > 0 ? (
            filteredLoops.map(loop => (
              <LoopItem
                key={loop.id}
                loop={loop}
                band={bands.find(b => b.id === loop.bandId)}
                isPlaying={playingLoopId === loop.id}
                onPlay={playLoop}
                onEdit={setEditingLoop}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-700">
                <p className="text-gray-400">No loops to display.</p>
                <p className="text-gray-500 text-sm">Add some audio files using the button in the sidebar.</p>
            </div>
          )}
        </main>
      </div>
      
      <LoopEditorModal
        isOpen={!!editingLoop}
        onClose={() => setEditingLoop(null)}
        onSave={handleSaveLoop}
        onDelete={handleDeleteLoop}
        loopToEdit={editingLoop}
        setlists={setlists}
        bands={bands}
      />
    </div>
  );
};

export default App;
