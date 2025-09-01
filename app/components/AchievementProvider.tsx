"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { fetchUnlockedAchievements, evaluateAchievements, recordAction, AchievementRow } from '../lib/achievements';
import AchievementUnlockModal from './AchievementUnlockModal';

interface AchievementContextValue {
  achievements: AchievementRow[];
  unlockQueue: AchievementRow[];
  recordAchievementAction: (actionType: string, targetId?: string) => Promise<void>;
  loading: boolean;
  userId: string | null;
}

const AchievementContext = createContext<AchievementContextValue | undefined>(undefined);

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<AchievementRow[]>([]);
  const [unlockQueue, setUnlockQueue] = useState<AchievementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    })();
  }, []);

  useEffect(() => {
    if (!userId || initialized) return;
    (async () => {
      setLoading(true);
      const unlocked = await fetchUnlockedAchievements(userId);
      setAchievements(unlocked);
      const newly = await evaluateAchievements(userId);
      if (newly.length) {
        setAchievements(prev => [...prev, ...newly]);
        setUnlockQueue(prev => [...prev, ...newly]);
      }
      setLoading(false);
      setInitialized(true);
    })();
  }, [userId, initialized]);

  const recordAchievementAction = useCallback(async (actionType: string, targetId?: string) => {
    if (!userId) return;
    try {
      await recordAction(userId, actionType, targetId);
      const newly = await evaluateAchievements(userId);
      if (newly.length) {
        const additions = newly.filter(n => !achievements.some(a => a.id === n.id));
        if (additions.length) {
          setAchievements(prev => [...prev, ...additions]);
          setUnlockQueue(prev => [...prev, ...additions]);
        }
      }
    } catch (e) {
      console.error('[AchievementProvider] record action error', e);
    }
  }, [userId, achievements]);

  const handleModalClose = (id: string) => {
    setUnlockQueue(q => q.filter(x => x.id !== id));
  };

  return (
    <AchievementContext.Provider value={{ achievements, unlockQueue, recordAchievementAction, loading, userId }}>
      {children}
      <AchievementUnlockModal
        queue={unlockQueue.map(a => ({ id: a.id, name: a.name, description: a.description, badge_icon: a.badge_icon ? a.badge_icon.trim() : null }))}
        onClose={handleModalClose}
      />
    </AchievementContext.Provider>
  );
};

export function useAchievement() {
  const ctx = useContext(AchievementContext);
  if (!ctx) throw new Error('useAchievement must be used inside <AchievementProvider />');
  return ctx;
}

export default AchievementProvider;
