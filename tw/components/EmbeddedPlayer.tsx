
import React from 'react';

interface EmbeddedPlayerProps {
  youtubeLink: string;
  spotifyLink: string;
}

const EmbeddedPlayer: React.FC<EmbeddedPlayerProps> = ({ youtubeLink, spotifyLink }) => {
  let embedUrl = '';
  let type: 'youtube' | 'spotify' | null = null;

  if (youtubeLink) {
    try {
      const url = new URL(youtubeLink);
      let videoId = url.searchParams.get('v');
      if (url.hostname === 'youtu.be') {
        videoId = url.pathname.slice(1);
      }
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
        type = 'youtube';
      }
    } catch (error) {
      console.error("Invalid YouTube URL", error);
    }
  } else if (spotifyLink) {
    try {
        const url = new URL(spotifyLink);
        if (url.hostname === 'open.spotify.com') {
            const pathParts = url.pathname.split('/');
            const trackId = pathParts[pathParts.length - 1];
            embedUrl = `https://open.spotify.com/embed/track/${trackId}`;
            type = 'spotify';
        }
    } catch(error) {
        console.error("Invalid Spotify URL", error);
    }
  }

  if (!type) {
    return (
        <div className="flex items-center justify-center h-48 bg-gray-900/50 rounded-lg text-gray-500">
            No valid YouTube or Spotify link provided.
        </div>
    );
  }

  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe
        src={embedUrl}
        width={type === 'spotify' ? "100%" : "560"}
        height={type === 'spotify' ? "152" : "315"}
        allow="encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        title={`Embedded ${type} Player`}
        className="rounded-lg shadow-lg w-full h-full"
      ></iframe>
    </div>
  );
};

export default EmbeddedPlayer;
