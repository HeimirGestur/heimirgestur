export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      about_me: {
        Row: {
          bio: string
          id: string
          updated_at: string
        }
        Insert: {
          bio?: string
          id?: string
          updated_at?: string
        }
        Update: {
          bio?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_page: {
        Row: {
          commercials_contact_1_email: string | null
          commercials_contact_1_name: string | null
          commercials_contact_2_email: string | null
          commercials_contact_2_name: string | null
          commercials_contact_3_email: string | null
          commercials_contact_3_name: string | null
          features_email: string | null
          features_name: string | null
          id: string
          instagram_url: string | null
          music_videos_email: string | null
          music_videos_name: string | null
          personal_email: string | null
          personal_name: string | null
          representation_link: string | null
          representation_title: string | null
          updated_at: string
          vimeo_url: string | null
        }
        Insert: {
          commercials_contact_1_email?: string | null
          commercials_contact_1_name?: string | null
          commercials_contact_2_email?: string | null
          commercials_contact_2_name?: string | null
          commercials_contact_3_email?: string | null
          commercials_contact_3_name?: string | null
          features_email?: string | null
          features_name?: string | null
          id?: string
          instagram_url?: string | null
          music_videos_email?: string | null
          music_videos_name?: string | null
          personal_email?: string | null
          personal_name?: string | null
          representation_link?: string | null
          representation_title?: string | null
          updated_at?: string
          vimeo_url?: string | null
        }
        Update: {
          commercials_contact_1_email?: string | null
          commercials_contact_1_name?: string | null
          commercials_contact_2_email?: string | null
          commercials_contact_2_name?: string | null
          commercials_contact_3_email?: string | null
          commercials_contact_3_name?: string | null
          features_email?: string | null
          features_name?: string | null
          id?: string
          instagram_url?: string | null
          music_videos_email?: string | null
          music_videos_name?: string | null
          personal_email?: string | null
          personal_name?: string | null
          representation_link?: string | null
          representation_title?: string | null
          updated_at?: string
          vimeo_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: Database["public"]["Enums"]["video_category"]
          created_at: string
          director: string | null
          hover_video_url: string | null
          id: string
          is_visible: boolean
          production: string | null
          sort_order: number
          source_type: Database["public"]["Enums"]["video_source_type"]
          subtitle: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
          vimeo_id: string | null
          year: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["video_category"]
          created_at?: string
          director?: string | null
          hover_video_url?: string | null
          id?: string
          is_visible?: boolean
          production?: string | null
          sort_order?: number
          source_type?: Database["public"]["Enums"]["video_source_type"]
          subtitle?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
          vimeo_id?: string | null
          year?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["video_category"]
          created_at?: string
          director?: string | null
          hover_video_url?: string | null
          id?: string
          is_visible?: boolean
          production?: string | null
          sort_order?: number
          source_type?: Database["public"]["Enums"]["video_source_type"]
          subtitle?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
          vimeo_id?: string | null
          year?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "user"
      video_category: "selected" | "films" | "commercials" | "music-videos"
      video_source_type: "vimeo" | "cloudinary" | "direct" | "youtube" | "hls"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      video_category: ["selected", "films", "commercials", "music-videos"],
      video_source_type: ["vimeo", "cloudinary", "direct", "youtube", "hls"],
    },
  },
} as const
