export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  trackbit: {
    Tables: {
      profile: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_path: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_path?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_path?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          color: string;
          icon: string;
          category: string | null;
          frequency_type: 'daily' | 'weekdays' | 'custom';
          custom_days: number[] | null;
          target_count: number;
          is_active: boolean;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          color?: string;
          icon?: string;
          category?: string | null;
          frequency_type?: 'daily' | 'weekdays' | 'custom';
          custom_days?: number[] | null;
          target_count?: number;
          is_active?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          color?: string;
          icon?: string;
          category?: string | null;
          frequency_type?: 'daily' | 'weekdays' | 'custom';
          custom_days?: number[] | null;
          target_count?: number;
          is_active?: boolean;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      habit_completions: {
        Row: {
          id: string;
          user_id: string;
          habit_id: string;
          completed_on: string;
          completed_count: number;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          habit_id: string;
          completed_on: string;
          completed_count?: number;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          habit_id?: string;
          completed_on?: string;
          completed_count?: number;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      habit_streaks: {
        Row: {
          habit_id: string;
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_completed_on: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          habit_id: string;
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_completed_on?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          habit_id?: string;
          user_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_completed_on?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          period_type: 'weekly' | 'monthly';
          bucket_start_date: string;
          due_on: string | null;
          is_done: boolean;
          done_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          period_type: 'weekly' | 'monthly';
          bucket_start_date: string;
          due_on?: string | null;
          is_done?: boolean;
          done_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          period_type?: 'weekly' | 'monthly';
          bucket_start_date?: string;
          due_on?: string | null;
          is_done?: boolean;
          done_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      focus_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_type: 'focus' | 'short_break' | 'long_break';
          planned_minutes: number;
          actual_minutes: number;
          distraction_count: number;
          started_at: string;
          ended_at: string | null;
          is_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_type: 'focus' | 'short_break' | 'long_break';
          planned_minutes: number;
          actual_minutes?: number;
          distraction_count?: number;
          started_at?: string;
          ended_at?: string | null;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_type?: 'focus' | 'short_break' | 'long_break';
          planned_minutes?: number;
          actual_minutes?: number;
          distraction_count?: number;
          started_at?: string;
          ended_at?: string | null;
          is_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      finance_entries: {
        Row: {
          id: string;
          user_id: string;
          description: string;
          amount: number;
          entry_type: 'income' | 'expense';
          category: string;
          entry_on: string;
          is_recurring: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          description: string;
          amount: number;
          entry_type: 'income' | 'expense';
          category: string;
          entry_on?: string;
          is_recurring?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          description?: string;
          amount?: number;
          entry_type?: 'income' | 'expense';
          category?: string;
          entry_on?: string;
          is_recurring?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      keepalive_ping: {
        Row: {
          id: number;
          label: string;
          last_seen_at: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          label?: string;
          last_seen_at?: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          label?: string;
          last_seen_at?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      run_retention_cleanup: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
