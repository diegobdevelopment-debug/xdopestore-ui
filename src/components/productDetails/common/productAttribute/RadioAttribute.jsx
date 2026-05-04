import { Input, Label } from "reactstrap";

const RadioAttribute = ({ elem, soldOutAttributesIds, productState, setVariant, i }) => {
  return (
    <ul className="quantity-variant radio">
      {elem?.attribute_values.map((value, index) =>
        productState?.attributeValues?.includes(value?.id) ? (
          <li key={index} className={`${productState?.statusIds?.includes(value?.id) || soldOutAttributesIds.includes(value.id) ? "disabled" : ""}`} onClick={() => setVariant(productState?.product?.variations, value, "click")}>
            <div className="form-check">
              <Input type="radio" className="form-check-input" id={`radio-${i}-${index}`} name={`radio-group-${i}`} value={index} checked={productState?.variantIds?.includes(value?.id) && !soldOutAttributesIds.includes(value.id)} onChange={() => {}} disabled={productState?.statusIds?.includes(value?.id) || soldOutAttributesIds.includes(value.id)} />
              <Label htmlFor={`radio-${i}-${index}`} className="form-check-label">
                {value?.value}
              </Label>
            </div>
          </li>
        ) : null
      )}
    </ul>
  );
};

export default RadioAttribute;
