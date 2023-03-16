export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  roc_royale_2023: {
    Tables: {
      finals: {
        Row: {
          attempts: string
          created_at: string | null
          problem_id: string
          team_id: string
          top: number
          zone: number
        }
        Insert: {
          attempts?: string
          created_at?: string | null
          problem_id: string
          team_id: string
          top?: number
          zone?: number
        }
        Update: {
          attempts?: string
          created_at?: string | null
          problem_id?: string
          team_id?: string
          top?: number
          zone?: number
        }
      }
      finals_problems: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          wall: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          wall: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          wall?: string
        }
      }
      qualis: {
        Row: {
          created_at: string | null
          is_flash: boolean | null
          is_top: boolean | null
          problem_id: string
          team_id: string
        }
        Insert: {
          created_at?: string | null
          is_flash?: boolean | null
          is_top?: boolean | null
          problem_id: string
          team_id: string
        }
        Update: {
          created_at?: string | null
          is_flash?: boolean | null
          is_top?: boolean | null
          problem_id?: string
          team_id?: string
        }
      }
      qualis_problems: {
        Row: {
          color: string | null
          created_at: string | null
          description: string
          id: string
          points: number
          wall: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description: string
          id?: string
          points: number
          wall: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string
          id?: string
          points?: number
          wall?: string
        }
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
      }
    }
    Views: {
      finals_scores: {
        Row: {
          name: string | null
          top_attempts: number | null
          tops: number | null
          walls: string[] | null
          zone_attempts: number | null
          zones: number | null
        }
      }
      qualis_scores: {
        Row: {
          flashes: number | null
          id: string | null
          name: string | null
          score: number | null
        }
      }
    }
    Functions: {
      crosstab: {
        Args: {
          "": string
        }
        Returns: Record<string, unknown>[]
      }
      crosstab2: {
        Args: {
          "": string
        }
        Returns: Database["roc_royale_2023"]["CompositeTypes"]["tablefunc_crosstab_2"][]
      }
      crosstab3: {
        Args: {
          "": string
        }
        Returns: Database["roc_royale_2023"]["CompositeTypes"]["tablefunc_crosstab_3"][]
      }
      crosstab4: {
        Args: {
          "": string
        }
        Returns: Database["roc_royale_2023"]["CompositeTypes"]["tablefunc_crosstab_4"][]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      tablefunc_crosstab_2: {
        row_name: string
        category_1: string
        category_2: string
      }
      tablefunc_crosstab_3: {
        row_name: string
        category_1: string
        category_2: string
        category_3: string
      }
      tablefunc_crosstab_4: {
        row_name: string
        category_1: string
        category_2: string
        category_3: string
        category_4: string
      }
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

