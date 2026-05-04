import SettingContext from "@/context/settingContext";
import request from "@/utils/axiosUtils";
import { ProductAPI } from "@/utils/axiosUtils/API";
import { useCustomSearchParams } from "@/utils/hooks/useCustomSearchParams";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AccordionBody, AccordionHeader, AccordionItem, Input, Label } from "reactstrap";

// Round a raw step up to a "pretty" multiple — 1, 2, 5, or 10 × the relevant
// power of 10. e.g. 125980 → 200000, 47200 → 50000, 8.4 → 10.
const niceStep = (raw) => {
  if (raw <= 0) return 1;
  const exp = Math.floor(Math.log10(raw));
  const base = Math.pow(10, exp);
  const m = raw / base; // 1..<10
  if (m <= 1) return 1 * base;
  if (m <= 2) return 2 * base;
  if (m <= 5) return 5 * base;
  return 10 * base;
};

// Build clean price buckets covering [0, max]. Cutoffs are always multiples of
// `niceStep(max / count)` so labels look like "Below $200,000", "$200,000 -
// $400,000", … "$600,000 +" instead of awkward intermediates.
// Returns [{ value, min, max, kind: "below"|"range"|"above" }].
const buildBuckets = (rawMin, rawMax, count = 5) => {
  if (!rawMax || rawMax <= 0) return [];
  const step = niceStep(rawMax / count);
  if (!step) return [];

  const buckets = [];
  buckets.push({ value: `0-${step}`, min: 0, max: step, kind: "below" });

  let lo = step;
  while (lo + step <= rawMax && buckets.length < count - 1) {
    const hi = lo + step;
    buckets.push({ value: `${lo}-${hi}`, min: lo, max: hi, kind: "range" });
    lo = hi;
  }
  buckets.push({ value: `${lo}-`, min: lo, max: null, kind: "above" });
  return buckets;
};

const CollectionPrice = ({ filter, setFilter, attributeAPIData, isOffCanvas }) => {
  const router = useRouter();
  const [category, attribute, sortBy, field, rating, layout] = useCustomSearchParams(["category", "attribute", "sortBy", "field", "rating", "layout"]);
  const { t } = useTranslation("common");
  const { convertCurrency } = useContext(SettingContext);
  const pathname = usePathname();

  const { data: priceRange } = useFetchQuery(
    ["product-price-range"],
    () => request({ url: `${ProductAPI}/price-range` }),
    { refetchOnWindowFocus: false, select: (res) => res?.data }
  );

  const buckets = useMemo(
    () => buildBuckets(priceRange?.min ?? 0, priceRange?.max ?? 0, 5),
    [priceRange?.min, priceRange?.max]
  );

  const checkPrice = (value) => filter?.price?.indexOf(value) !== -1;

  const applyPrice = (event) => {
    const value = event?.target?.value;
    let temp = [...filter?.price];
    if (event.target.checked) {
      if (!temp.includes(value)) temp.push(value);
    } else {
      const idx = temp.indexOf(value);
      if (idx !== -1) temp.splice(idx, 1);
    }
    setFilter((prev) => ({ ...prev, price: temp }));

    const base = { ...category, ...attribute, ...sortBy, ...field, ...rating, ...layout };
    const queryParams = new URLSearchParams(temp.length > 0 ? { ...base, price: temp } : base).toString();
    router.push(`${pathname}?${queryParams}`, { scroll: false });
  };

  const labelFor = (b) => {
    if (b.kind === "below") return `${t("Below") || "Below"} ${convertCurrency(b.max)}`;
    if (b.kind === "above") return `${convertCurrency(b.min)} +`;
    return `${convertCurrency(b.min)} - ${convertCurrency(b.max)}`;
  };

  return (
    <AccordionItem className={`open ${isOffCanvas ? "col-lg-3" : ""}`}>
      <AccordionHeader targetId={(attributeAPIData?.length + 3).toString()}>
        <span>{t("Price")}</span>
      </AccordionHeader>
      <AccordionBody accordionId={(attributeAPIData?.length + 3).toString()}>
        <div className="custom-sidebar-height">
          <ul className="shop-category-list">
            {buckets.length === 0 ? (
              <li className="text-muted small">{t("NoDataFound") || "No price data"}</li>
            ) : (
              buckets.map((b, i) => (
                <div key={b.value} className="form-check collection-filter-checkbox">
                  <Input
                    className="checkbox_animated"
                    type="checkbox"
                    id={`price-${i}`}
                    value={b.value}
                    checked={checkPrice(b.value)}
                    onChange={applyPrice}
                  />
                  <Label className="form-check-label" htmlFor={`price-${i}`}>
                    <span className="name">{labelFor(b)}</span>
                  </Label>
                </div>
              ))
            )}
          </ul>
        </div>
      </AccordionBody>
    </AccordionItem>
  );
};

export default CollectionPrice;
