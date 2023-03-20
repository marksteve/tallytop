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
  public: {
    Tables: {
      climbs: {
        Row: {
          attempts: string
          competitor_id: string
          created_at: string | null
          problem_id: string
          top: number
          zone: number
        }
        Insert: {
          attempts?: string
          competitor_id: string
          created_at?: string | null
          problem_id: string
          top?: number
          zone?: number
        }
        Update: {
          attempts?: string
          competitor_id?: string
          created_at?: string | null
          problem_id?: string
          top?: number
          zone?: number
        }
      }
      competitors: {
        Row: {
          category: string | null
          created_at: string | null
          first_name: string
          id: string
          last_name: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          first_name: string
          id?: string
          last_name?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
        }
      }
      judges: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
      }
      problems: {
        Row: {
          category: string
          color: string | null
          created_at: string | null
          id: string
          round: string
          wall: string
        }
        Insert: {
          category: string
          color?: string | null
          created_at?: string | null
          id?: string
          round: string
          wall: string
        }
        Update: {
          category?: string
          color?: string | null
          created_at?: string | null
          id?: string
          round?: string
          wall?: string
        }
      }
    }
    Views: {
      scores: {
        Row: {
          category: string | null
          competitor_id: string | null
          round: string | null
          top_attempts: number | null
          tops: number | null
          walls: string[] | null
          zone_attempts: number | null
          zones: number | null
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
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_2"][]
      }
      crosstab3: {
        Args: {
          "": string
        }
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_3"][]
      }
      crosstab4: {
        Args: {
          "": string
        }
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_4"][]
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

