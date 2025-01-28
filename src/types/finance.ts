export type AssetType = 'property' | 'vehicle' | 'bank_account' | 'stock' | 'valuable';
export type LiabilityType = 'debt' | 'tax' | 'bill';
export type AssetStatus = 'active' | 'sold' | 'transferred';
export type LiabilityStatus = 'pending' | 'paid' | 'disputed';

export interface Asset {
  id: string;
  estate_project_id: string;
  name: string;
  type: AssetType;
  description?: string;
  estimated_value: number;
  valuation_date: string;
  status: AssetStatus;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

export interface Liability {
  id: string;
  estate_project_id: string;
  name: string;
  type: LiabilityType;
  amount: number;
  due_date?: string;
  status: LiabilityStatus;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
}

export interface FinanceTransaction {
  id: string;
  estate_project_id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description?: string;
  date: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}
