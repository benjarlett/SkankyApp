import React from 'react';

interface IconProps {
  className?: string;
  title?: string;
}

export const PlayIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', title }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
  </svg>
);

export const StopIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', title }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    {title && <title>{title}</title>}
    <path d="M6 6h12v12H6z" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', title }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

export const DeleteIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', title }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const LoopIcon: React.FC<IconProps> = ({ className = 'w-5 h-5', title }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 9a9 9 0 0114.13-6.36M20 15a9 9 0 01-14.13 6.36" />
    </svg>
);


export const PlusIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', title }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {title && <title>{title}</title>}
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export const MusicNoteIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', title }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {title && <title>{title}</title>}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l10-3v13M9 19c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2zm10-10c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z" />
    </svg>
);