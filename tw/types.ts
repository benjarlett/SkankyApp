export interface Loop {
  id: string;
  title: string;
  bandId: string | null;
  fileName: string;
  fileType: string;
  looping: boolean;
  spotifyLink: string;
  youtubeLink: string;
  setlistIds: string[];
  transposeSemitones: number;
  tuneCents: number;
}

export interface Setlist {
  id: string;
  name: string;
}

export interface Band {
  id:string;
  name: string;
}
