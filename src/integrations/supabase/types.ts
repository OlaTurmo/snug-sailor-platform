export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      assets: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          estate_project_id: string
          estimated_value: number
          id: string
          metadata: Json | null
          name: string
          status: string | null
          type: string
          updated_at: string | null
          valuation_date: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estate_project_id: string
          estimated_value: number
          id?: string
          metadata?: Json | null
          name: string
          status?: string | null
          type: string
          updated_at?: string | null
          valuation_date?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estate_project_id?: string
          estimated_value?: number
          id?: string
          metadata?: Json | null
          name?: string
          status?: string | null
          type?: string
          updated_at?: string | null
          valuation_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_estate_project_id_fkey"
            columns: ["estate_project_id"]
            isOneToOne: false
            referencedRelation: "estate_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string | null
          description: string | null
          file_path: string
          file_type: string
          id: string
          name: string
          project_id: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_path: string
          file_type: string
          id?: string
          name: string
          project_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_path?: string
          file_type?: string
          id?: string
          name?: string
          project_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "estate_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      estate_invitations: {
        Row: {
          created_at: string
          email: string
          estate_id: string | null
          expires_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["estate_member_role"]
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          estate_id?: string | null
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["estate_member_role"]
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          estate_id?: string | null
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["estate_member_role"]
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estate_invitations_estate_id_fkey"
            columns: ["estate_id"]
            isOneToOne: false
            referencedRelation: "estates"
            referencedColumns: ["id"]
          },
        ]
      }
      estate_members: {
        Row: {
          created_at: string
          estate_id: string | null
          id: string
          role: Database["public"]["Enums"]["estate_member_role"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          estate_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["estate_member_role"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          estate_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["estate_member_role"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estate_members_estate_id_fkey"
            columns: ["estate_id"]
            isOneToOne: false
            referencedRelation: "estates"
            referencedColumns: ["id"]
          },
        ]
      }
      estate_projects: {
        Row: {
          created_at: string
          id: string
          name: string
          responsible_heir_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          responsible_heir_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          responsible_heir_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estate_projects_responsible_heir_id_fkey"
            columns: ["responsible_heir_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      estates: {
        Row: {
          created_at: string
          deceased_date: string
          deceased_id_number: string
          deceased_name: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deceased_date: string
          deceased_id_number: string
          deceased_name: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          deceased_date?: string
          deceased_id_number?: string
          deceased_name?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      finance_transactions: {
        Row: {
          amount: number
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          category: string
          created_at: string | null
          created_by: string | null
          date: string | null
          description: string | null
          id: string
          project_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          category: string
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string | null
          id?: string
          project_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          description?: string | null
          id?: string
          project_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "estate_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      liabilities: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          due_date: string | null
          estate_project_id: string
          id: string
          metadata: Json | null
          name: string
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          estate_project_id: string
          id?: string
          metadata?: Json | null
          name: string
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          due_date?: string | null
          estate_project_id?: string
          id?: string
          metadata?: Json | null
          name?: string
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "liabilities_estate_project_id_fkey"
            columns: ["estate_project_id"]
            isOneToOne: false
            referencedRelation: "estate_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          sender_id: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          sender_id?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          sender_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          permissions: string[]
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          permissions?: string[]
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          permissions?: string[]
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      project_progress: {
        Row: {
          completed_tasks: number | null
          id: string
          last_updated: string | null
          project_id: string
          total_tasks: number | null
        }
        Insert: {
          completed_tasks?: number | null
          id?: string
          last_updated?: string | null
          project_id: string
          total_tasks?: number | null
        }
        Update: {
          completed_tasks?: number | null
          id?: string
          last_updated?: string | null
          project_id?: string
          total_tasks?: number | null
        }
        Relationships: []
      }
      project_users: {
        Row: {
          permissions: string[]
          project_id: string
          role: string
          user_id: string
        }
        Insert: {
          permissions?: string[]
          project_id: string
          role?: string
          user_id: string
        }
        Update: {
          permissions?: string[]
          project_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_users_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "estate_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          created_by: string | null
          deadline: string | null
          description: string | null
          id: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      settlement_summaries: {
        Row: {
          net_balance: number | null
          project_id: string | null
          total_expenses: number | null
          total_income: number | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "estate_projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      estate_member_role: "viewer" | "editor" | "administrator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
