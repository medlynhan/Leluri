export interface AchievementConditionBase { type: string; [k: string]: any }

export interface AchievementRow {
  id: string;
  name: string;
  description: string;
  condition: AchievementConditionBase;
  badge_icon: string | null;
}