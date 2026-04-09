export type CountryCode = 'DE' | 'FR' | 'IT' | 'ES' | 'UK';

export interface Country {
  code: CountryCode;
  name: string;
  nameEn: string;
  flag: string;
  currency: string;
  vatRate: number;
  vatRegTimeline: string;
  vatRegCost: string;
  eoriRequired: boolean;
}

export interface WizardStep {
  id: string;
  title: string;
  icon: string;
  description: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  countries: CountryCode[] | 'all';
  required: boolean;
  documents?: DocumentExample[];
  timeline?: string;
  cost?: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  tips?: string[];
  source?: string;
  /** 警告訊息，顯示在項目頂部的醒目提示 */
  warning?: string;
  /** 前置條件說明，必須先完成哪些步驟才能進行此項目 */
  prerequisites?: string[];
}

export interface DocumentExample {
  name: string;
  description: string;
  fields?: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  nameEn: string;
  referralFeeEU: string;
  referralFeeUK: string;
  certifications: CertificationReq[];
}

export interface CertificationReq {
  name: string;
  countries: CountryCode[] | 'all';
  description: string;
  timeline: string;
  cost: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  mandatory: boolean;
}

export interface ComplianceItem {
  id: string;
  name: string;
  fullName: string;
  description: string;
  countries: CountryCode[];
  timeline: string;
  cost: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  mandatory: boolean;
  category: 'tax' | 'safety' | 'environment' | 'registration';
  documents?: DocumentExample[];
  tips?: string[];
  source?: string;
  warning?: string;
  prerequisites?: string[];
}
