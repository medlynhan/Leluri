import { supabase } from './supabase';

interface AchievementConditionBase { type: string; [k: string]: any }

export interface AchievementRow {
  id: string;
  name: string;
  description: string;
  condition: AchievementConditionBase;
  badge_icon: string | null;
}

export async function recordAction(userId: string, actionType: string, targetId?: string) {
  if (!userId) return;
  await supabase.from('user_actions').insert({ user_id: userId, action_type: actionType, target_id: targetId || null });
}

export async function evaluateAchievements(userId: string): Promise<AchievementRow[]> {
  if (!userId) return [];
  const { data: allAchData } = await supabase.from('achievements').select('*');
  if (!allAchData) return [];
  const achievements: AchievementRow[] = allAchData.map(a => ({ ...a, condition: a.condition }));
  const { data: unlocked } = await supabase.from('user_achievements').select('achievement_id').eq('user_id', userId);
  const unlockedSet = new Set((unlocked || []).map(u => u.achievement_id));
  const { data: allActions } = await supabase
    .from('user_actions')
    .select('action_type')
    .eq('user_id', userId);
  const counts: Record<string, number> = {};
  (allActions || []).forEach(a => { counts[a.action_type] = (counts[a.action_type] || 0) + 1; });

  const newlyUnlocked: AchievementRow[] = [];

  for (const ach of achievements) {
    if (unlockedSet.has(ach.id)) continue;
    const cond = ach.condition || {};
    const type = cond.type;
    let ok = false;
    switch (type) {
      case 'like_post':
        ok = (counts['like_post'] || 0) >= (cond.count || 0);
        break;
      case 'buy_product':
        ok = (counts['buy_product'] || 0) >= (cond.count || 0);
        break;
      case 'follow':
        ok = (counts['follow'] || 0) >= (cond.count || 0);
        break;
      case 'comment':
        ok = (counts['comment'] || 0) >= (cond.count || 0);
        break;
      case 'buy_product_month':
        ok = (counts['buy_product'] || 0) >= (cond.count || 0);
        break;
      case 'join_class':
        ok = (counts['join_class'] || 0) >= (cond.count || 0);
        break;
      case 'open_store':
        ok = (counts['open_store'] || 0) >= (cond.count || 0);
        break;
      case 'sell_product':
        ok = (counts['sell_product'] || 0) >= (cond.count || 0);
        break;
      case 'class_students':
        ok = (counts['class_students'] || 0) >= (cond.count || 0);
        break;
      default:
        break;
    }
    if (ok) {
      const { error } = await supabase.from('user_achievements').insert({ user_id: userId, achievement_id: ach.id });
      if (!error) newlyUnlocked.push(ach);
    }
  }
  return newlyUnlocked;
}

export async function fetchUnlockedAchievements(userId: string): Promise<AchievementRow[]> {
  if (!userId) return [];
  const { data } = await supabase
    .from('user_achievements')
    .select('achievement_id, achievements ( id, name, description, condition, badge_icon )')
    .eq('user_id', userId)
    .order('unlocked_at', { ascending: true });
  return (data || []).map((r: any) => ({ ...r.achievements, condition: r.achievements.condition }));
}
