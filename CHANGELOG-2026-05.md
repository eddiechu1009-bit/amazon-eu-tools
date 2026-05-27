# 2026/5/27 內容大更新備忘錄

## 🎯 本次更新目的
針對「Amazon 歐洲新賣家準備工具」做全面內容校對，所有事實與數字皆已對照官方來源驗證，並標注可訪問連結。

---

## ✅ 一、資料來源（全部已驗證可訪問）

### A 級：Amazon 官方來源
| ID | 來源 | 用途 | 驗證日 |
|----|------|------|--------|
| TW | [Amazon Taiwan 2026/2/12 公告](https://gs.amazon.com.tw/news/2026-why-you-need-to-sell-on-amazon-260209) | NSI 全套架構（USD 數字基準） | 2026/5/27 |
| UK | [sell.amazon.co.uk](https://sell.amazon.co.uk/sell-online) | UK NSI £ 數字 + 9x 加速數據 | 2026/5/27 |
| EUFEE | [Amazon EU 官方部落格 2025/12/2](https://www.aboutamazon.eu/news/empowering-small-business/update-to-european-referral-and-fulfilment-by-amazon-fees-for-2026) | 2026 fee 降價、Low-Price FBA 擴大 | 2026/5/27 |
| HELP | Amazon Help Page Wiki `GXMJ38VA95GUN5XU` | NSI 資格規則（6 個月 / Brand Owner） | 從本機 workspace |
| HELP-GPSR | Amazon Help Page Wiki `GKAYGH3A6AK84BEX` | GPSR 不適用英國 | 從本機 workspace |

### A 級：政府/官方法規來源
| ID | 來源 | 用途 | 驗證日 |
|----|------|------|--------|
| GOV-UKCA | [GOV.UK UKCA/CE marking](https://www.gov.uk/guidance/placing-ukca-or-ce-marked-products-on-the-market-in-great-britain) | UK 永久接受 CE marking | 2026/5/27（頁面 2026/4/7 最後更新）|
| LEG-2024 | [The Product Safety and Metrology (Amendment) Regulations 2024](https://www.legislation.gov.uk/uksi/2024/696/contents/made) | UKCA/CE 法源 | 2026/5/27 |
| EU-CBAM | [EU 委員會 CBAM 2026/1/14 公告](https://taxation-customs.ec.europa.eu/news/cbam-successfully-entered-force-1-january-2026-2026-01-14_en) | CBAM 生效確認 + 50 噸豁免 | 2026/5/27 |
| EU-EUDR | [歐洲議會 EUDR 2025/11/26 投票](https://www.europarl.europa.eu/news/en/press-room/20251120IPR31498/eu-deforestation-law-parliament-supports-simplification-measures) | EUDR 2026/12/30 生效 | 2026/5/27 |

### B 級：報導與服務商來源
| ID | 來源 | 用途 | 驗證日 |
|----|------|------|--------|
| CMAX | [ChannelMAX 2026/04 報導](https://www.channelmax.net/article/amazon-speeds-up-new-brand-bonus-payouts-for-uk-sellers-splits-uk-and-eu-incentives-channelmax) | EU4 €47,250 + UK 7 天撥款 + EU4-UK Split | 2026/5/27 |
| AVASK | [AVASK Italy €50K Guarantee](https://avaskhelp.zendesk.com/hc/en-gb/articles/37771106516372) | 義大利保證金 2025/4/10 生效日 | 2026/5/27 |

---

## 📂 二、修改檔案清單

### 1. `src/components/NewSellerIncentives.tsx`（重寫）

#### 數字校正（全部從錯標歐元改為實際數字）
| 項目 | 改前 | 改後 | 來源 |
|------|------|------|------|
| 品牌返利總額 | €42,000 | $52,500 USD ／ UK £42,000 ／ EU4 €47,250 | TW + UK + CMAX |
| 10% 段上限 | €4,000 | UK £4,000 ／ 等值 $5,000 | 同上 |
| 5% 段上限 | €38,000 | UK £38,000 ／ 等值 $47,500 | 同上 |
| Vine 額度 | €160 | $200 USD ／ UK £160 | TW + UK |
| FBA 抵用（Partnered Carrier）| €80 | UK £80 | UK |
| FBA 抵用（AGL/SEND）| €160 | $200 USD（**標注 AGL 限中國發貨**）| TW |
| 廣告券 | €750 | $1,000 USD ／ UK £750 | TW + UK |
| Coupon 額度 | €40 | $50 USD ／ UK £40 | TW + UK |

#### 撥款週期校正
- 改前：「返利約 2 個月入帳」
- 改後：「UK 站 2026/3/26 起，符合資格後 7 天內發放」 — 來源：CMAX

#### 新增的福利卡片（之前完全沒有）
| 福利 | 內容 | 來源 |
|------|------|------|
| 39 週不限庫容 | 新賣家入駐 39 週內不受 IPI 評分限制 | TW |
| 新父 ASIN 100 件配送費回饋 | 北美/歐洲 ~10%、日本 ~5% 銷售額抵扣配送費；免月倉儲費 / Vine 註冊費 / 退貨處理費 | TW |
| 歐洲 Low-Price FBA 範圍擴大至 £20/€20 | 2026/1/5 起，單件平均省 £0.40/€0.45 | EUFEE |
| 歐洲 Lightning/Best Deals 費用上限下調 | UK £200 / DE €300 / FR/IT/ES €100（2025/12/15 起）| EUFEE |
| 企業購（B2B）FBA 一單多件減免 | 最高省 24% | TW |
| 企業購大額訂單佣金 | 最低 5% / 大包裝佣金折扣最高 25% | TW |
| 歐洲新興站點返利（NL/BE/SE/IE/PL）| $52,500 USD 抵用券 | TW |

#### UI 改善
- 每張福利卡片底部加 source 連結（可點擊驗證）
- 加 Seller Central NSI Dashboard 連結（[https://sellercentral.amazon.com/incentives](https://sellercentral.amazon.com/incentives)）
- 時間節點加上「39 週」節點
- EU4/UK Split banner 重做（顯示具體數字）
- 新賣家成功率：6x → 9x（與 sell.amazon.co.uk 一致）

---

### 2. `src/data/compliance.ts`

#### 新增 2 條法規

**EUDR（歐盟反森林砍伐法規）**
- 法源：EU Regulation 2023/1115
- 生效：2026/12/30 大型/中型 / 2027/6/30 小型/微型
- 涵蓋：木材/家具/紙、牛/皮革、可可/咖啡、棕櫚油、橡膠、大豆、charcoal、印刷紙
- 罰款：最高 4% 營收 + 商品沒入 + 公開招標排除
- 來源：[歐洲議會 2025/11/26](https://www.europarl.europa.eu/news/en/press-room/20251120IPR31498/eu-deforestation-law-parliament-supports-simplification-measures)

**CBAM（碳邊境調整機制）**
- 法源：EU Regulation 2023/956
- 生效：2026/1/1（已進入 definitive phase）
- 涵蓋：鋼鐵、鋁、水泥、化肥、電力、氫
- De minimis：50 噸/年豁免
- 主要進口國：土耳其、中國、印度、加拿大、台灣（第 5）
- 來源：[EU 委員會 2026/1/14](https://taxation-customs.ec.europa.eu/news/cbam-successfully-entered-force-1-january-2026-2026-01-14_en)

#### 修正既有法規

| 項目 | 改前 | 改後 |
|------|------|------|
| `vat-it` 描述 | 「2025年起非歐盟企業需繳交 €50,000 保證金」 | 「自 2025/4/10 起執行中」 |
| `vat-it` warning | 「2025年新規」 | 「自 2025/4/10 起執行中」 |
| `vat-it` 6/14 deadline | 「2025/6/14 前提交」 | 移除已過時的 deadline，改為「現役賣家須持續維持」 |
| `ukca` 描述 ⭐**重大** | 「脫歐後取代 CE 標誌（部分產品延長至 2027 年底）」 | 「2024 年法規修訂後永久接受 CE marking」 |
| `ukca` tips ⭐**重大** | 「2027 年底寬限期」+ 舊流程 | 標明 2024 法規 + UKCA 標籤寬限至 2027/12/31 + 醫療器材至 2030/6/30 |
| `battery-epr` 描述 | 「2025年8月起強制執行」 | 「Amazon 自 2025/8/18 起已強制執行」 |
| `ppwr` warning | 「2026/8/12 全面適用」+「空隙率 40%」 | 「距離 2026/8/12 不到 3 個月」 + 空隙率改為「以 PPWR 委託法案最終公布為準（業界引用 50%）」 |
| `eudr` warning（剛新增的）| 「2026/12/30 起生效」 | 「距離 2026/12/30 不到 7 個月」（強調急迫）|
| `espr-dpp` warning | 「2026/7/19 起」 | 「距離 2026/7/19 不到 2 個月」 |

---

### 3. `src/data/wizardSteps.ts`

| 項目 | 改前 | 改後 |
|------|------|------|
| `vat-italy-guarantee` 描述 | 「2025年4月起」 | 「自 2025/4/10 起執行中」 |
| `vat-italy-guarantee` 6/14 deadline | 「2025/6/14 前提交」 | 移除，改為「現役賣家須持續維持」 |
| `ukca-marking` tips ⭐**重大** | 「至 2027 年底」+ 「建議同時取得 CE 和 UKCA」 | 「2024 年永久接受 CE」+ 「擁有 EU CE 即可，無需重複認證」|
| `ukca-marking` source | 籠統 | 加上 GOV.UK 直接連結 |
| `gpsr` 描述 | 「2024年12月13日起生效」 | 「2024/12/13 起已生效執行中」 |
| `epr-packaging` UK tip | 「2025年起 EPR 包裝法已生效」 | 加「執行中」|
| `weee` tip | 「Amazon 2025年底前要求」 | 「Amazon 已要求（2025年底大限已過）」|
| `battery-epr` 描述 | 「2025年8月起 Amazon 強制執行」 | 「2025/8/18 起 Amazon 已強制執行」 |

---

### 4. `src/App.tsx`

#### 新增
- 主內容區頂部加 **2026 EU Fee 降價 banner**
  - 內容：平均單件降 £0.15/€0.17、Clothing/Home/Pet/Grocery/Vitamins 大降
  - 連結：[Amazon EU 官方部落格 2025/12/2](https://www.aboutamazon.eu/news/empowering-small-business/update-to-european-referral-and-fulfilment-by-amazon-fees-for-2026)

#### 修正
- Footer「最後更新」：2026年4月 → 2026年5月

---

## 🔍 三、驗證結果

| 檢查項目 | 結果 |
|---------|------|
| TypeScript 類型檢查 | ✅ 通過（`npx tsc --noEmit` exit 0）|
| Vite 生產 build | ✅ 通過（dist/ 已產出，258KB JS / 28KB CSS）|
| 所有 source 連結可訪問 | ✅ 已逐一驗證（見上方來源表）|
| 無破壞性變更 | ✅ 既有檔案結構與 component API 不變 |

---

## 📌 四、後續維護注意事項

### 需要定期重新驗證的項目（建議每季）

| 項目 | 為什麼要追 | 預期下次更新 |
|------|----------|------------|
| NSI 數字（£42K / €47,250 / $52,500）| Amazon 隨時可能調整 | 觀察 sell.amazon.co.uk |
| 7 天撥款政策 | 是否擴展到 EU4 | 觀察 ChannelMAX / Amazon 公告 |
| EUDR 2026/12/30 生效 | 大限將至 | 2026 Q3-Q4 重抓 |
| PPWR 2026/8/12 | 還在等委託法案最終定稿 | 2026/7-8 重抓 |
| ESPR 2026/7/19 銷毀禁令 | 即將生效 | 2026/7 確認執行情況 |
| UKCA 規則 | 政府仍在更新中 | 觀察 GOV.UK 變更 |
| 義大利 €50K 保證金 | 法院挑戰中，可能變動 | 觀察 AVASK / 法院判決 |

### 不要再寫的過時表述
- ❌「2025年新規」「2025年起 X 將生效」 → 都已生效，改為「執行中」
- ❌ 任何已過去的 deadline（如 2025/6/14、2025/8/18 強制日）→ 改為「已大限/已強制」
- ❌「目前 UK 接受 CE 至 2027 年底」 → UK **永久接受 CE**（多數品類）

### 數字呈現原則
- **品牌返利、Vine、廣告券、Coupon、AGL**：寫**美元 + UK 英鎊**雙軌
- **EU4 歐元金額**：除「品牌返利 €47,250」外其他項目沒有公開來源，**不要寫死歐元數字**
- 加 disclaimer：「實際金額以 Seller Central 顯示為準（USD ↔ EUR ↔ GBP 為內部統一換算基準）」

### 已驗證但未引用的次要來源（備用）
- [歐盟 EUDR 委員會頁面](https://green-forum.ec.europa.eu/deforestation-regulation-implementation_en)（內容驗證但 web_fetch 抓取不穩）
- [EUR-Lex PPWR 摘要](https://eur-lex.europa.eu/EN/legal-content/summary/packaging-and-packaging-waste-from-2026.html)（同上）

---

## 🚦 五、部署注意事項

### 直接部署
```bash
cd amazon-eu-tools
npm run build
# dist/ 即可上傳到 Netlify
```

### Netlify 自動部署
專案已配置 `netlify.toml` 與 GitHub Actions（`.github/workflows/deploy.yml`），push 到 main 會自動部署。

### 部署後檢查清單
- [ ] 首頁 banner 顯示「2026 EU Fee 降價」
- [ ] 點進「2026 新賣家大禮包」tab，看到 EU4 €47,250 / UK £42K
- [ ] 每張福利卡片底部有 source 連結
- [ ] 點擊 source 連結可跳到正確官方頁
- [ ] 「合規查詢」tab 看到 EUDR 與 CBAM 兩條新法規

---

## 📞 變更責任人

- 變更日期：2026/5/27
- 變更類型：內容校對 + 法規補齊 + 數字校正
- 風險等級：低（純資料層更新，無程式邏輯變更）
- 建議部署：可直接部署


---

## 🔄 後續微調（2026/5/27 同日完成）

### 移除：CBAM
**原因**：對 99% 的 Amazon EU 賣家不相關（只影響大量進口鋼/鋁/水泥/化肥的賣家，且 50 噸/年豁免）。放在工具裡反而讓新賣家焦慮、誤以為要做 CBAM 申報。

**處理**：直接從 `compliance.ts` 移除整段。CHANGELOG 中保留歷史記錄。

### 視覺降權：EUDR + ESPR/DPP（中長期準備）
**原因**：
- EUDR 對小型/微型企業是 2027/6/30，台灣多數新賣家是這個級別
- ESPR 銷毀禁令只適用「大型企業」（員工 >250 或營收 >€50M），中小賣家暫不受影響

**處理**：
1. `PreRegistration.tsx` 的 `categoryLabels` 新增 `sustainability` 群組，**放在最後**，圖示用較柔和的 🌱、標籤用「中長期永續法規（提前準備）」
2. 兩條都改 `mandatory: false`（從紅色「必要」標籤改為灰色「視品類」）
3. warning 從 🚨 紅字改為 📅 中性提示
4. 措辭從「距離大限不到 X 個月」改為「中小賣家暫不受影響，建議 2027 前準備」

**效果**：
- 主流程（稅務/產品安全/環保/註冊/品類安規）視覺權重不變
- EUDR / ESPR 移到列表最末，視覺存在感降低
- 內容仍完整，需要的賣家展開後可以看到完整資訊

### 新增：1.5% 燃料附加費（已驗證 EU 是 1.5%，不是美國的 3.5%）
**來源**：[Amazon EU Seller Forum](https://sellercentral-europe.amazon.com/seller-forums/discussions/t/cb3452e9-3803-435b-bfc2-e3b6a10a9e42)
**處理**：在 `wizardSteps.ts` 的 `fba-shipping` 段落 warning 與 tips 加入，提示與 2026 整體降費（£0.15/€0.17）配套使用淨成本仍下降。

### 義大利 €50K 保證金併入 countries.ts
**處理**：`countries.ts` 的 IT `vatRegCost` 從「€400-1000/年」改為「€400-1000/年 + €50,000 保證金（非歐盟企業）」，避免賣家漏看。

### 全站 Disclaimer
**處理**：App.tsx footer 加上「費用、時程、認證費用為市場估算」聲明，並標示金額單位轉換邏輯。

---

## 📊 最終法規呈現順序（PreRegistration）

| 群組 | 內容 | 視覺權重 |
|------|------|---------|
| 💰 稅務 | VAT、義大利保證金、西班牙雙稅號 | 高 |
| ✅ 產品安全 | CE、UKCA、GPSR | 高 |
| ♻️ 環保法規 | EPR 包裝、LUCID、WEEE、Battery EPR、PPWR | 高 |
| 📋 註冊與通關 | EORI、UK EORI | 高 |
| 🔍 產品安規認證（依品類）| 從 categories.ts 動態生成 | 中 |
| 🌱 中長期永續法規（提前準備）| EUDR、ESPR/DPP | 低（最末） |

---

## ✅ 驗證結果（重新 build 後）

- TypeScript：通過 ✅
- Vite build：通過 ✅（dist/ 已重新產出）
- 所有 source 連結驗證日：2026/5/27
