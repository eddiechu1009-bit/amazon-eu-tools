import { FeeCategoryInfo, FeeItemExplainer, FeeCategory } from './accountingTypes';

// ─── 費用大分類 ───────────────────────────────────────────────
export const feeCategories: FeeCategoryInfo[] = [
  {
    id: 'sales',
    label: '銷售收入 Sales Revenue',
    icon: '💰',
    color: '#16a34a',
    description: '商品售價與運費等買家支付的款項。Product price and shipping charges paid by buyers.',
  },
  {
    id: 'commission',
    label: '銷售佣金 Referral Fees',
    icon: '🏷️',
    color: '#ea580c',
    description: 'Amazon 依品類抽取的銷售佣金（通常 7%–15%）。Category-based commission charged by Amazon on each sale.',
  },
  {
    id: 'fba',
    label: 'FBA 物流費用 FBA Fees',
    icon: '📦',
    color: '#2563eb',
    description: '使用 FBA 服務產生的揀貨、包裝、配送、倉儲等費用。Fulfillment, storage, and logistics fees when using Fulfillment by Amazon.',
  },
  {
    id: 'advertising',
    label: '廣告費用 Advertising',
    icon: '📢',
    color: '#9333ea',
    description: 'Sponsored Products / Brands / Display 等廣告花費。Costs for Amazon PPC advertising campaigns.',
  },
  {
    id: 'subscription',
    label: '訂閱與服務費 Subscription & Service Fees',
    icon: '🔑',
    color: '#0891b2',
    description: '月租費、帳戶服務費等固定費用。Monthly subscription and account-level service charges.',
  },
  {
    id: 'refund',
    label: '退款相關 Refunds',
    icon: '↩️',
    color: '#dc2626',
    description: '買家退貨退款、佣金退還、FBA 費用退還等。Buyer refunds and associated fee reversals.',
  },
  {
    id: 'tax',
    label: '稅務相關 Tax',
    icon: '🏛️',
    color: '#4b5563',
    description: 'VAT 代收代付、數位服務稅等稅務項目。VAT collection/remittance and other tax-related items.',
  },
  {
    id: 'other',
    label: '其他費用 Other',
    icon: '📎',
    color: '#78716c',
    description: '促銷折扣、賠償、調整款等其他項目。Promotions, reimbursements, adjustments, and miscellaneous items.',
  },
];

export const feeCategoryMap: Record<FeeCategory, FeeCategoryInfo> =
  Object.fromEntries(feeCategories.map((c) => [c.id, c])) as Record<FeeCategory, FeeCategoryInfo>;


// ─── 科目明細中英對照表 ──────────────────────────────────────
// key = Settlement Report 中 amount-description 欄位的值（英文原文）
// label = 中文名稱
// description = 中英文對照說明
// formula = 計費邏輯（如適用）

export const feeExplainers: FeeItemExplainer[] = [
  // ═══════════════════════════════════════════════════════════
  // 銷售收入 Sales Revenue
  // ═══════════════════════════════════════════════════════════
  {
    key: 'Principal',
    label: '商品售價',
    category: 'sales',
    description:
      '買家支付的商品價格（不含運費）。The item price paid by the buyer, excluding shipping.',
  },
  {
    key: 'Shipping',
    label: '運費收入',
    category: 'sales',
    description:
      '買家支付的運費。Shipping charges paid by the buyer.',
  },
  {
    key: 'ShippingTax',
    label: '運費稅金',
    category: 'tax',
    description:
      '運費上的 VAT 稅金。VAT charged on shipping fees.',
  },
  {
    key: 'Tax',
    label: '商品稅金（VAT）',
    category: 'tax',
    description:
      '商品售價上的 VAT 稅金。VAT charged on the item price.',
  },
  {
    key: 'GiftWrap',
    label: '禮品包裝費',
    category: 'sales',
    description:
      '買家選擇禮品包裝時支付的費用。Gift wrap charges paid by the buyer.',
  },
  {
    key: 'GiftWrapTax',
    label: '禮品包裝稅金',
    category: 'tax',
    description:
      '禮品包裝費上的 VAT 稅金。VAT charged on gift wrap fees.',
  },
  {
    key: 'ShippingHB',
    label: '運費回扣（Shipping Holdback）',
    category: 'sales',
    description:
      'Amazon 對賣家自配送訂單預扣的運費差額。Shipping holdback amount on merchant-fulfilled orders.',
  },
  {
    key: 'Goodwill',
    label: '商譽補償',
    category: 'sales',
    description:
      'Amazon 為維護客戶體驗而給予的補償金額。Goodwill credit issued by Amazon for customer experience.',
  },

  // ═══════════════════════════════════════════════════════════
  // 銷售佣金 Referral Fees
  // ═══════════════════════════════════════════════════════════
  {
    key: 'Commission',
    label: '銷售佣金',
    category: 'commission',
    description:
      'Amazon 依商品品類收取的銷售佣金，通常為售價的 7%–15%。Referral fee charged by Amazon based on product category, typically 7%–15% of the sale price.',
    formula: '商品售價 × 品類佣金比例（%）',
  },
  {
    key: 'RefundCommission',
    label: '退款佣金退還',
    category: 'refund',
    description:
      '買家退貨時，Amazon 退還部分或全部佣金（通常退還佣金的 80%–100%）。Referral fee refund when a buyer return occurs. Amazon typically refunds 80%–100% of the original commission.',
    formula: '原佣金 × 退還比例',
  },
  {
    key: 'FixedClosingFee',
    label: '固定成交費',
    category: 'commission',
    description:
      '特定品類（如媒體類商品：書籍、DVD、音樂）的固定成交費。Fixed closing fee for media categories (books, DVDs, music, etc.).',
    formula: '每筆訂單固定金額（依品類而定）',
  },
  {
    key: 'VariableClosingFee',
    label: '變動成交費',
    category: 'commission',
    description:
      '依商品重量或尺寸計算的變動成交費（主要適用於媒體類）。Variable closing fee based on item weight/size, mainly for media categories.',
  },
  {
    key: 'HighVolumeListingFee',
    label: '大量刊登費',
    category: 'commission',
    description:
      '當賣家 ASIN 數量超過一定門檻時收取的額外費用（通常超過 200 萬個 ASIN）。Fee charged when seller exceeds a high number of active ASINs (typically over 2 million).',
    formula: '超出門檻的 ASIN 數 × 單價',
  },

  // ═══════════════════════════════════════════════════════════
  // FBA 物流費用 FBA Fees
  // ═══════════════════════════════════════════════════════════
  {
    key: 'FBAPerUnitFulfillmentFee',
    label: 'FBA 單件配送費',
    category: 'fba',
    description:
      'FBA 每件商品的揀貨、包裝與配送費用，依商品尺寸與重量分級計費。Per-unit fulfillment fee covering pick, pack, and ship for each FBA item. Tiered by size and weight.',
    formula: '依尺寸分級（Small Standard / Large Standard / Small Oversize / Large Oversize）× 重量',
  },
  {
    key: 'FBAWeightBasedFee',
    label: 'FBA 重量附加費',
    category: 'fba',
    description:
      '超過基本重量門檻後，依實際重量加收的配送費。Additional weight-based handling fee when item exceeds the base weight threshold.',
    formula: '(實際重量 − 基本重量) × 每公斤費率',
  },
  {
    key: 'FBAPerOrderFulfillmentFee',
    label: 'FBA 每單配送費',
    category: 'fba',
    description:
      '每筆訂單的基礎配送處理費（部分方案適用）。Per-order fulfillment fee (applicable to certain FBA programs).',
  },
  {
    key: 'FBAInventoryStorageFee',
    label: 'FBA 月倉儲費',
    category: 'fba',
    description:
      '依商品在 FBA 倉庫佔用的體積按月計費。1–9 月為標準費率，10–12 月（旺季）費率較高。Monthly storage fee based on cubic volume in FBA warehouses. Standard rate Jan–Sep; peak rate Oct–Dec.',
    formula: '體積（立方公尺）× 月費率（標準 / 旺季）',
  },
  {
    key: 'FBALongTermStorageFee',
    label: 'FBA 長期倉儲費',
    category: 'fba',
    description:
      '庫存在 FBA 倉庫超過 365 天的附加倉儲費，鼓勵賣家清理滯銷庫存。Surcharge for inventory stored in FBA warehouses over 365 days, incentivizing sellers to clear aged stock.',
    formula: '超齡庫存體積 × 長期倉儲費率（或每件最低收費，取較高者）',
  },
  {
    key: 'FBAInventoryPlacementServiceFee',
    label: 'FBA 庫存配置服務費',
    category: 'fba',
    description:
      '選擇將庫存集中送至單一倉庫時的額外費用（否則 Amazon 會要求分倉入庫）。Fee for choosing to ship inventory to a single fulfillment center instead of distributed placement.',
    formula: '每件 × 尺寸分級費率',
  },
  {
    key: 'FBARemovalFee',
    label: 'FBA 移除費',
    category: 'fba',
    description:
      '將庫存從 FBA 倉庫退回賣家或銷毀的費用。Fee to return or dispose of inventory from FBA warehouses.',
    formula: '每件 × 尺寸分級費率',
  },
  {
    key: 'FBADisposalFee',
    label: 'FBA 銷毀費',
    category: 'fba',
    description:
      '請求 Amazon 銷毀 FBA 倉庫中庫存的費用。Fee for Amazon to dispose/destroy inventory in FBA warehouses.',
    formula: '每件 × 尺寸分級費率',
  },
  {
    key: 'FBAInboundTransportationFee',
    label: 'FBA 入庫運輸費',
    category: 'fba',
    description:
      '使用 Amazon 合作承運商將貨物送至 FBA 倉庫的運輸費。Inbound shipping fee when using Amazon-partnered carriers to send inventory to FBA.',
  },
  {
    key: 'FBAReturnProcessingFee',
    label: 'FBA 退貨處理費',
    category: 'fba',
    description:
      '服裝與鞋類等免費退貨品類，Amazon 對每件退貨收取的處理費。Return processing fee for categories with free customer returns (e.g., clothing, shoes).',
    formula: '等同該商品的 FBA 配送費',
  },
  {
    key: 'FBACustomerReturnPerUnitFee',
    label: 'FBA 客戶退貨單件費',
    category: 'fba',
    description:
      '買家退貨時，FBA 處理退回商品的單件費用。Per-unit fee for processing customer returns in FBA.',
  },
  {
    key: 'FBAInboundDefectFee',
    label: 'FBA 入庫缺陷費',
    category: 'fba',
    description:
      '入庫貨件不符合 Amazon 包裝/標籤要求時的罰款。Penalty fee when inbound shipments do not meet Amazon packaging/labeling requirements.',
  },
  {
    key: 'FBAUnplannedServiceFee',
    label: 'FBA 非預期服務費',
    category: 'fba',
    description:
      '入庫商品需要額外處理（如重新貼標、重新包裝）時的費用。Fee for unplanned prep services (re-labeling, re-packaging) at the fulfillment center.',
  },
  {
    key: 'FBAManualProcessingFee',
    label: 'FBA 人工處理費',
    category: 'fba',
    description:
      '未使用 Amazon 入庫工作流程而需人工處理的費用。Fee for manual processing when seller does not use Amazon inbound workflow.',
  },
  {
    key: 'FBAOverageFee',
    label: 'FBA 超量倉儲費',
    category: 'fba',
    description:
      '庫存超過倉儲容量限制時的額外費用。Overage fee when inventory exceeds storage capacity limits.',
  },
  {
    key: 'FBALowInventoryLevelFee',
    label: 'FBA 低庫存水位費',
    category: 'fba',
    description:
      '熱銷商品庫存過低導致 Amazon 無法有效配送時的附加費（2024 年新增）。Surcharge when popular items have insufficient FBA inventory for efficient fulfillment (introduced 2024).',
  },

  // ═══════════════════════════════════════════════════════════
  // 廣告費用 Advertising
  // ═══════════════════════════════════════════════════════════
  {
    key: 'SponsoredProductsAdFee',
    label: 'SP 商品推廣廣告費',
    category: 'advertising',
    description:
      'Sponsored Products 廣告的點擊費用（CPC）。Cost-per-click charges for Sponsored Products campaigns.',
    formula: '每次點擊出價 × 點擊次數',
  },
  {
    key: 'SponsoredBrandsAdFee',
    label: 'SB 品牌推廣廣告費',
    category: 'advertising',
    description:
      'Sponsored Brands 廣告的點擊費用。Cost-per-click charges for Sponsored Brands campaigns.',
    formula: '每次點擊出價 × 點擊次數',
  },
  {
    key: 'SponsoredDisplayAdFee',
    label: 'SD 展示型推廣廣告費',
    category: 'advertising',
    description:
      'Sponsored Display 廣告費用（CPC 或 vCPM）。Charges for Sponsored Display campaigns (CPC or vCPM model).',
  },
  {
    key: 'CouponRedemptionFee',
    label: '優惠券兌換費',
    category: 'advertising',
    description:
      '買家使用優惠券時，Amazon 收取的每次兌換手續費（€0.50/次）。Per-redemption fee charged by Amazon when a buyer clips and uses a coupon (€0.50 per redemption).',
    formula: '兌換次數 × €0.50',
  },
  {
    key: 'LightningDealFee',
    label: '限時秒殺費',
    category: 'advertising',
    description:
      '參加 Lightning Deal（限時秒殺）活動的固定費用，旺季費率較高。Fixed fee for participating in Lightning Deals. Higher rates during peak seasons (e.g., Prime Day, Black Friday).',
  },
  {
    key: 'DealFee',
    label: '促銷活動費',
    category: 'advertising',
    description:
      '參加 Best Deal / Deal of the Day 等促銷活動的費用。Fee for participating in Best Deals, Deal of the Day, and other promotional events.',
  },

  // ═══════════════════════════════════════════════════════════
  // 訂閱與服務費 Subscription & Service Fees
  // ═══════════════════════════════════════════════════════════
  {
    key: 'Subscription',
    label: '專業賣家月租費',
    category: 'subscription',
    description:
      'Amazon 專業賣家帳戶月租費（歐洲統一帳戶 €39/月，不含 VAT）。Professional seller monthly subscription fee (€39/month excl. VAT for unified EU account).',
    formula: '€39/月（不含 VAT）',
  },
  {
    key: 'PerItemFee',
    label: '個人賣家單件費',
    category: 'subscription',
    description:
      '個人賣家帳戶每售出一件商品的費用（€0.99/件）。Per-item fee for Individual seller accounts (€0.99 per item sold).',
    formula: '€0.99/件',
  },
  {
    key: 'TranscriptionFee',
    label: '帳戶轉換費',
    category: 'subscription',
    description:
      '帳戶類型轉換或特殊服務的手續費。Fee for account type conversion or special account services.',
  },
  {
    key: 'CrossBorderFulfillmentFee',
    label: '跨境配送費',
    category: 'fba',
    description:
      '歐洲跨境配送（EFN）的額外費用，當商品從非本地倉庫配送至買家時產生。Additional fee for European Fulfillment Network (EFN) cross-border delivery from a non-local warehouse.',
  },
  {
    key: 'PanEuropeanFBAFee',
    label: '泛歐 FBA 費用',
    category: 'fba',
    description:
      '使用 Pan-European FBA 方案時的配送費用，Amazon 自動將庫存分配至歐洲各國倉庫。Fulfillment fee under the Pan-European FBA program where Amazon distributes inventory across EU warehouses.',
  },

  // ═══════════════════════════════════════════════════════════
  // 退款相關 Refunds
  // ═══════════════════════════════════════════════════════════
  {
    key: 'RefundPrincipal',
    label: '退款 — 商品售價',
    category: 'refund',
    description:
      '退還給買家的商品售價。Refund of the item price to the buyer.',
  },
  {
    key: 'RefundShipping',
    label: '退款 — 運費',
    category: 'refund',
    description:
      '退還給買家的運費。Refund of shipping charges to the buyer.',
  },
  {
    key: 'RefundTax',
    label: '退款 — 稅金',
    category: 'refund',
    description:
      '退還給買家的 VAT 稅金。Refund of VAT tax to the buyer.',
  },
  {
    key: 'RefundShippingTax',
    label: '退款 — 運費稅金',
    category: 'refund',
    description:
      '退還給買家的運費 VAT 稅金。Refund of VAT on shipping charges to the buyer.',
  },
  {
    key: 'RefundGiftWrap',
    label: '退款 — 禮品包裝費',
    category: 'refund',
    description:
      '退還給買家的禮品包裝費。Refund of gift wrap charges to the buyer.',
  },
  {
    key: 'RestockingFee',
    label: '退貨重新上架費',
    category: 'refund',
    description:
      '部分退貨情境下，Amazon 向買家收取的重新上架費（賣家可保留部分退款）。Restocking fee charged to the buyer in certain return scenarios, allowing the seller to retain a portion of the refund.',
  },
  {
    key: 'ReturnShipping',
    label: '退貨運費',
    category: 'refund',
    description:
      '退貨產生的運費，可能由賣家或買家承擔（依退貨原因而定）。Return shipping cost, borne by seller or buyer depending on the return reason.',
  },
  {
    key: 'Clawback',
    label: '追回款（Clawback）',
    category: 'refund',
    description:
      'Amazon 追回先前多付給賣家的款項。Amount reclaimed by Amazon for previously overpaid funds to the seller.',
  },

  // ═══════════════════════════════════════════════════════════
  // 稅務相關 Tax
  // ═══════════════════════════════════════════════════════════
  {
    key: 'MarketplaceFacilitatorTax',
    label: '市場代徵稅（Marketplace Facilitator Tax）',
    category: 'tax',
    description:
      'Amazon 作為市場代徵人（Marketplace Facilitator）代收代付的 VAT。VAT collected and remitted by Amazon as the Marketplace Facilitator on behalf of the seller.',
  },
  {
    key: 'MarketplaceWithheldTax',
    label: '市場預扣稅',
    category: 'tax',
    description:
      'Amazon 從賣家撥款中預扣的稅金。Tax withheld by Amazon from seller disbursements.',
  },
  {
    key: 'LowValueGoodsTax',
    label: '低價商品進口 VAT（IOSS）',
    category: 'tax',
    description:
      '€150 以下進口商品的 VAT，透過 IOSS（Import One-Stop Shop）機制由 Amazon 代收。VAT on imported goods ≤€150, collected by Amazon via the IOSS (Import One-Stop Shop) scheme.',
  },
  {
    key: 'DigitalServicesTax',
    label: '數位服務稅（DST）',
    category: 'tax',
    description:
      '部分歐洲國家對數位平台服務收取的稅金（如法國 3%、義大利 3%、西班牙 3%）。Digital Services Tax levied by certain EU countries on digital platform services (e.g., France 3%, Italy 3%, Spain 3%).',
  },
  {
    key: 'RegulatoryFee',
    label: '法規合規費',
    category: 'tax',
    description:
      '因歐盟法規要求（如 EPR 延伸生產者責任）而產生的費用。Fee arising from EU regulatory requirements such as EPR (Extended Producer Responsibility).',
  },
  {
    key: 'EPRFee',
    label: 'EPR 延伸生產者責任費',
    category: 'tax',
    description:
      '歐盟包裝法規要求的延伸生產者責任費用，依國家和包裝材質計費。Extended Producer Responsibility fee required by EU packaging regulations, charged by country and packaging material.',
  },

  // ═══════════════════════════════════════════════════════════
  // 其他費用 Other
  // ═══════════════════════════════════════════════════════════
  {
    key: 'PromotionDiscount',
    label: '促銷折扣',
    category: 'other',
    description:
      '賣家設定的促銷折扣金額（如買一送一、百分比折扣）。Promotional discount amount set by the seller (e.g., BOGO, percentage-off deals).',
  },
  {
    key: 'PromotionShippingDiscount',
    label: '促銷免運折扣',
    category: 'other',
    description:
      '促銷活動中提供的免運費折扣。Free shipping discount offered as part of a promotion.',
  },
  {
    key: 'AmazonShippingReimbursement',
    label: 'Amazon 運費補償',
    category: 'other',
    description:
      'Amazon 對賣家的運費補償（如 Buy Shipping 服務的差額補償）。Shipping reimbursement from Amazon (e.g., Buy Shipping service cost adjustments).',
  },
  {
    key: 'WarehouseDamage',
    label: '倉庫損壞賠償',
    category: 'other',
    description:
      'FBA 倉庫中商品損壞時，Amazon 給予賣家的賠償。Reimbursement from Amazon for items damaged in FBA warehouses.',
  },
  {
    key: 'WarehouseLost',
    label: '倉庫遺失賠償',
    category: 'other',
    description:
      'FBA 倉庫中商品遺失時，Amazon 給予賣家的賠償。Reimbursement from Amazon for items lost in FBA warehouses.',
  },
  {
    key: 'FreeReplacementRefundItems',
    label: '免費換貨退款',
    category: 'other',
    description:
      '買家收到免費替換商品後退回原商品的退款處理。Refund processing for free replacement items returned by the buyer.',
  },
  {
    key: 'ReversalReimbursement',
    label: '賠償沖銷',
    category: 'other',
    description:
      '先前賠償款項的沖銷（如找回遺失商品後收回賠償）。Reversal of a previous reimbursement (e.g., when a lost item is found).',
  },
  {
    key: 'CompensatedClawback',
    label: '補償追回',
    category: 'other',
    description:
      '先前補償金額的追回調整。Clawback of a previously issued compensation amount.',
  },
  {
    key: 'BalanceAdjustment',
    label: '餘額調整',
    category: 'other',
    description:
      'Amazon 對賣家帳戶餘額的手動調整。Manual balance adjustment made by Amazon to the seller account.',
  },
  {
    key: 'TransferToBank',
    label: '撥款至銀行',
    category: 'other',
    description:
      '結算週期結束後，Amazon 將淨額撥款至賣家銀行帳戶。Disbursement of net proceeds to the seller bank account at the end of the settlement period.',
  },
  {
    key: 'PreviousReserveAmount',
    label: '前期預留款',
    category: 'other',
    description:
      '上一結算週期預留的款項，在本期釋放。Reserve amount from the previous settlement period, released in the current period.',
  },
  {
    key: 'CurrentReserveAmount',
    label: '本期預留款',
    category: 'other',
    description:
      '本結算週期預留的款項（用於保障退款、索賠等），將在下期釋放。Amount reserved in the current settlement period (to cover potential refunds, claims, etc.), released in the next period.',
  },
  {
    key: 'SuccessfulChargeback',
    label: '信用卡拒付（Chargeback）',
    category: 'other',
    description:
      '買家透過信用卡公司發起的拒付，金額從賣家帳戶扣除。Credit card chargeback initiated by the buyer through their card issuer, deducted from the seller account.',
  },
  {
    key: 'ChargebackRefund',
    label: '拒付退還',
    category: 'other',
    description:
      '拒付申訴成功後，退還給賣家的金額。Amount returned to the seller after a successful chargeback dispute.',
  },
  {
    key: 'AToZGuaranteeRefund',
    label: 'A-to-Z 保障索賠',
    category: 'other',
    description:
      '買家透過 Amazon A-to-Z Guarantee 提出索賠，從賣家帳戶扣除的金額。Amount deducted from the seller account due to an Amazon A-to-Z Guarantee claim by the buyer.',
  },
  {
    key: 'SafeTReimbursement',
    label: 'SAFE-T 賠償',
    category: 'other',
    description:
      '賣家透過 SAFE-T（Seller Assurance for E-commerce Transactions）申訴成功後獲得的賠償。Reimbursement received after a successful SAFE-T claim by the seller.',
  },
  {
    key: 'VineEnrollmentFee',
    label: 'Vine 計畫費用',
    category: 'other',
    description:
      '參加 Amazon Vine 評論計畫的費用。Enrollment fee for the Amazon Vine review program.',
  },
  {
    key: 'BrandRegistryFee',
    label: '品牌註冊相關費用',
    category: 'other',
    description:
      'Amazon Brand Registry 相關的服務費用。Fees related to Amazon Brand Registry services.',
  },
  {
    key: 'TransparencyFee',
    label: 'Transparency 防偽費',
    category: 'other',
    description:
      '使用 Amazon Transparency 防偽標籤服務的費用。Fee for using the Amazon Transparency anti-counterfeiting label service.',
  },
];


// ─── 快速查找工具 ─────────────────────────────────────────────

/** 以 key（英文科目名）快速查找說明 */
export const feeExplainerMap: Record<string, FeeItemExplainer> = Object.fromEntries(
  feeExplainers.map((f) => [f.key, f])
);

/** 依分類取得該分類下所有科目 */
export function getExplainersByCategory(cat: FeeCategory): FeeItemExplainer[] {
  return feeExplainers.filter((f) => f.category === cat);
}

/**
 * 模糊比對科目：嘗試用 key 精確匹配，
 * 若找不到則用 key 的小寫子字串匹配
 */
export function matchExplainer(description: string): FeeItemExplainer | undefined {
  const exact = feeExplainerMap[description];
  if (exact) return exact;

  const lower = description.toLowerCase().replace(/[\s_-]/g, '');
  return feeExplainers.find((f) => {
    const fLower = f.key.toLowerCase().replace(/[\s_-]/g, '');
    return lower.includes(fLower) || fLower.includes(lower);
  });
}
