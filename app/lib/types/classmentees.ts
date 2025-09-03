export interface ClassMentee {
  id: string;
  user_id: string;
  class_id: string;
  created_at: string;
  is_verified?: boolean;
}

export interface ClassMenteeUserInput {
  notes: string
}

export interface ClassMenteeFormInput extends ClassMenteeUserInput {
  user_id: string;
  class_id: string;
  created_at?: string;
  is_verified?: boolean;
}