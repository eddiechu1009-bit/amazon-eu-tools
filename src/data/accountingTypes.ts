/** Amazon EU Settlement Report 帳務分析相關型別 */

export interface TransactionRow {
  /** 原始列資料 */
  raw: Record<string, string>;
  /** 結算日期 */
  date: string;
  /** 訂單編號 */
  orderId: string;
  /** SKU */
  sku: string;
  /** 交易類型 (Order / Refund / Service Fee 等) */
  transactionType: string;
  /** 金額類型 (ProductCharges / FBA fees 等) */
  amountType: string;
  /** 科目描述 */
  amountDescription: string;
  /** 金額 */
  amount: number;
  /** 幣別 */
  currency: string;
  /** 市場 */
  marketplace: string;
}

export type FeeCategory =
  | 'sales'
  | 'fba'
  | 'commission'
  | 'advertising'
  | 'subscription'
  | 'refund'
  | 'tax'
  | 'other';

export interface FeeCategoryInfo {
  id: FeeCategory;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export interface FeeItemExplainer {
  /** Settlement Report 中的 amount-description 值 */
  key: string;
  /** 中文名稱 */
  label: string;
  /** 歸屬分類 */
  category: FeeCategory;
  /** 中文說明 */
  description: string;
  /** 計費邏輯 */
  formula?: string;
}

export interface AccountingSummary {
  currency: string;
  totalSales: number;
  totalFBA: number;
  totalCommission: number;
  totalAdvertising: number;
  totalSubscription: number;
  totalRefund: number;
  totalTax: number;
  totalOther: number;
  netProceeds: number;
  byCategory: Record<FeeCategory, number>;
  byItem: Record<string, number>;
  rowCount: number;
}
