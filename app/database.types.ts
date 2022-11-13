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
      attempts: {
        Row: {
          competitor_id: number
          route_id: number
          is_zone: boolean | null
          is_top: boolean | null
          hold: number | null
          is_plus: boolean | null
          created_at: string | null
          id: number
        }
        Insert: {
          competitor_id: number
          route_id: number
          is_zone?: boolean | null
          is_top?: boolean | null
          hold?: number | null
          is_plus?: boolean | null
          created_at?: string | null
          id?: number
        }
        Update: {
          competitor_id?: number
          route_id?: number
          is_zone?: boolean | null
          is_top?: boolean | null
          hold?: number | null
          is_plus?: boolean | null
          created_at?: string | null
          id?: number
        }
      }
      competitors: {
        Row: {
          division_id: number
          number: string
          name: string | null
          created_at: string | null
          id: number
        }
        Insert: {
          division_id: number
          number: string
          name?: string | null
          created_at?: string | null
          id?: number
        }
        Update: {
          division_id?: number
          number?: string
          name?: string | null
          created_at?: string | null
          id?: number
        }
      }
      comps: {
        Row: {
          name: string
          created_at: string | null
          id: number
        }
        Insert: {
          name: string
          created_at?: string | null
          id?: number
        }
        Update: {
          name?: string
          created_at?: string | null
          id?: number
        }
      }
      divisions: {
        Row: {
          comp_id: number
          name: string
          created_at: string | null
          id: number
        }
        Insert: {
          comp_id: number
          name: string
          created_at?: string | null
          id?: number
        }
        Update: {
          comp_id?: number
          name?: string
          created_at?: string | null
          id?: number
        }
      }
      rounds: {
        Row: {
          comp_id: number
          name: string
          type: string
          created_at: string | null
          id: number
        }
        Insert: {
          comp_id: number
          name: string
          type: string
          created_at?: string | null
          id?: number
        }
        Update: {
          comp_id?: number
          name?: string
          type?: string
          created_at?: string | null
          id?: number
        }
      }
      routes: {
        Row: {
          round_id: number
          name: string | null
          color: string | null
          score: number | null
          judge_id: string | null
          created_at: string | null
          id: number
        }
        Insert: {
          round_id: number
          name?: string | null
          color?: string | null
          score?: number | null
          judge_id?: string | null
          created_at?: string | null
          id?: number
        }
        Update: {
          round_id?: number
          name?: string | null
          color?: string | null
          score?: number | null
          judge_id?: string | null
          created_at?: string | null
          id?: number
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
