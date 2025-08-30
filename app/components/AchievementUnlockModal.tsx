"use client";
import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export interface AchievementUnlockData {
  id: string;
  name: string;
  description: string;
  badge_icon: string | null;
}

interface Props {
  queue: AchievementUnlockData[];
  onClose: (id: string) => void;
}

const AchievementUnlockModal: React.FC<Props> = ({ queue, onClose }) => {
  if (!queue.length) return null;
  const current = queue[0];
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" aria-live="polite">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-8 animate-[fadeIn_.25s_ease] text-center">
        <button aria-label="Tutup" onClick={() => onClose(current.id)} className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-semibold mb-2">Petualangan Anda Sukses!</h3>
        <p className="text-sm text-gray-600 mb-6">Anda mendapatkan badge <span className="text-amber-600 font-medium">"{current.name}"</span></p>
        <div className="mx-auto mb-8 w-40 h-40 rounded-full border-4 border-amber-400 flex items-center justify-center bg-amber-50">
          {current.badge_icon ? (
            <Image src={current.badge_icon.trim()} alt={current.name} width={140} height={140} className="object-contain" />
          ) : (
            <span className="text-xs leading-tight px-2">{current.name}</span>
          )}
        </div>
        <button
          onClick={() => onClose(current.id)}
          className="w-full border rounded-full h-11 flex items-center justify-center text-sm font-medium hover:bg-gray-50"
        >Lanjutkan</button>
        {queue.length > 1 && <p className="mt-3 text-[11px] text-gray-400">{queue.length - 1} badge lagi menunggu...</p>}
      </div>
    </div>
  );
};

export default AchievementUnlockModal;
