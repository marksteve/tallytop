export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      advancements: {
        Row: {
          division_id: string | null
          round_id: string | null
          id: string
          created_at: string | null
          order: number
        }
        Insert: {
          division_id?: string | null
          round_id?: string | null
          id?: string
          created_at?: string | null
          order?: number
        }
        Update: {
          division_id?: string | null
          round_id?: string | null
          id?: string
          created_at?: string | null
          order?: number
        }
      }
      attempts: {
        Row: {
          competitor_id: string
          climb_id: string
          is_zone: boolean | null
          is_top: boolean | null
          hold: number | null
          is_plus: boolean | null
          id: string
          created_at: string | null
        }
        Insert: {
          competitor_id: string
          climb_id: string
          is_zone?: boolean | null
          is_top?: boolean | null
          hold?: number | null
          is_plus?: boolean | null
          id?: string
          created_at?: string | null
        }
        Update: {
          competitor_id?: string
          climb_id?: string
          is_zone?: boolean | null
          is_top?: boolean | null
          hold?: number | null
          is_plus?: boolean | null
          id?: string
          created_at?: string | null
        }
      }
      climbs: {
        Row: {
          name: string | null
          color: string | null
          score: number | null
          round_id: string | null
          id: string
          created_at: string | null
        }
        Insert: {
          name?: string | null
          color?: string | null
          score?: number | null
          round_id?: string | null
          id?: string
          created_at?: string | null
        }
        Update: {
          name?: string | null
          color?: string | null
          score?: number | null
          round_id?: string | null
          id?: string
          created_at?: string | null
        }
      }
      competitors: {
        Row: {
          id: string
          division_id: string
          number: string
          advancement_id: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          division_id: string
          number: string
          advancement_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          division_id?: string
          number?: string
          advancement_id?: string | null
          created_at?: string | null
        }
      }
      comps: {
        Row: {
          name: string
          id: string
          created_at: string | null
        }
        Insert: {
          name: string
          id?: string
          created_at?: string | null
        }
        Update: {
          name?: string
          id?: string
          created_at?: string | null
        }
      }
      divisions: {
        Row: {
          comp_id: string
          name: string
          id: string
          created_at: string | null
        }
        Insert: {
          comp_id: string
          name: string
          id?: string
          created_at?: string | null
        }
        Update: {
          comp_id?: string
          name?: string
          id?: string
          created_at?: string | null
        }
      }
      rounds: {
        Row: {
          comp_id: string
          name: string
          type: string
          id: string
          created_at: string | null
        }
        Insert: {
          comp_id: string
          name: string
          type: string
          id?: string
          created_at?: string | null
        }
        Update: {
          comp_id?: string
          name?: string
          type?: string
          id?: string
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

