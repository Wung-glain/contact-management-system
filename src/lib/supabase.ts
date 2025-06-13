
import { supabase } from '@/integrations/supabase/client'

export { supabase }

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          category: 'work' | 'personal' | 'family' | 'other'
          avatar: string | null
          created_at: string
          is_favorite: boolean | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          category: 'work' | 'personal' | 'family' | 'other'
          avatar?: string | null
          created_at?: string
          is_favorite?: boolean | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          category?: 'work' | 'personal' | 'family' | 'other'
          avatar?: string | null
          created_at?: string
          is_favorite?: boolean | null
        }
      }
    }
  }
}
