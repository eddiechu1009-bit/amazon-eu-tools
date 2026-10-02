import { productCategories } from './categories';
import { CertificationReq, CountryCode, ProductCategory } from './types';

/**
 * EU＋UK 同時在範圍內時，GB 項目與同品類的歐盟認證共用同一套測試文件：
 * 回傳顯示用的成本／時程／說明（測試費只在歐盟那一項計一次）；不共用時回傳原值。
 */
export function certDisplay(cat: ProductCategory, cert: CertificationReq, countries: CountryCode[]) {
  const pairedEu = cert.reusesTestsOf
    ? cat.certifications.find((c) => c.name === cert.reusesTestsOf)
    : undefined;
  const shared = !!pairedEu && pairedEu.countries !== 'all'
    && pairedEu.countries.some((c) => countries.includes(c));
  if (!shared) return { shared, cost: cert.cost, timeline: cert.timeline, description: cert.description };
  return {
    shared,
    cost: `$0 新增測試費（與「${pairedEu!.name}」共用測試文件，只計一次；英國端新增項另計）`,
    timeline: '隨歐盟測試文件一併確認',
    description: `${cert.description}。已同時選歐盟站：測試文件與「${pairedEu!.name}」共用，這裡只需確認英國端實際新增的項目（標示、英國責任人等）`,
  };
}

/** 依所選品類與國家組出產品認證待辦（同名認證只列一次）。 */
export function buildProductCertItems(selectedCategories: string[], allCountries: CountryCode[]) {
  const seenCertNames = new Set<string>();
  return selectedCategories.flatMap((catId) => {
    const cat = productCategories.find((c) => c.id === catId);
    if (!cat) return [];
    return cat.certifications
      .filter((cert) => cert.countries === 'all' || cert.countries.some((c) => allCountries.includes(c)))
      .filter((cert) => {
        if (seenCertNames.has(cert.name)) return false;
        seenCertNames.add(cert.name);
        return true;
      })
      .map((cert) => {
        const fromCategories = selectedCategories
          .map((cid) => productCategories.find((c) => c.id === cid))
          .filter((c) => c && c.certifications.some((cc) => cc.name === cert.name))
          .map((c) => c!.name);

        const view = certDisplay(cat, cert, allCountries);

        return {
          id: `cert-${catId}-${cert.name}`,
          name: `${cert.name}`,
          fullName: `${cert.name}`,
          description: view.description,
          countries: (cert.countries === 'all' ? allCountries : cert.countries.filter((c) => allCountries.includes(c))) as CountryCode[],
          timeline: view.timeline,
          cost: view.cost,
          difficulty: cert.difficulty as 1 | 2 | 3 | 4 | 5,
          mandatory: cert.mandatory,
          category: 'productCert' as const,
          source: `歐盟官方法規`,
          warning: undefined as string | undefined,
          prerequisites: undefined as string[] | undefined,
          documents: undefined as undefined,
          tips: undefined as string[] | undefined,
          fromCategories,
        };
      });
  });
}

/** 取報價區間下界。replace(/,/g)：'$1,500-64,000' 有兩個逗號。 */
export const lowerBound = (cost: string): number => {
  const match = cost.match(/[\d,]+/);
  return match ? parseInt(match[0].replace(/,/g, '')) : 0;
};
