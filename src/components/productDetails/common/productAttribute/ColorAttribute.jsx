import React, { Fragment, useState } from "react";
import ColorTooltip from "./ColorTooltip";

const toId = (val) => val?.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-_]/g, "") || "attr";

const ColorAttribute = ({ elem, soldOutAttributesIds, productState, setVariant, noHoverEffect }) => {
  const [tooltipOpen, setTooltipOpen] = useState("");
  const toggle = (target) => {
    setTooltipOpen((prevState) => ({ [target]: !prevState[target] }));
  };

  return (
    <ul className={`quantity-variant ${elem?.style}`}>
      {elem?.attribute_values?.map((value, index) => (
        <Fragment key={index}>
          {productState?.attributeValues?.includes(value?.id) ? (
            <>
              {noHoverEffect ? (
                <li onClick={() => setVariant(productState?.product?.variations, value, "click")} className={`bg-light ${soldOutAttributesIds.includes(value.id) ? "disabled" : ""} ${productState?.variantIds?.includes(value.id) ? "active" : ""}`}>
                  <span id={toId(value?.value)} style={{ backgroundColor: value?.hex_color }} />
                  <ColorTooltip target={toId(value?.value)} title={value?.value} toggle={() => toggle(toId(value?.value))} tooltipOpen={tooltipOpen[toId(value?.value)] || false} />
                </li>
              ) : (
                <li onClick={() => setVariant(productState?.product?.variations, value, "click")} className={`bg-light ${soldOutAttributesIds.includes(value.id) ? "disabled" : ""} ${productState?.variantIds?.includes(value.id) ? "active" : ""}`}>
                  <span id={toId(value?.value)} style={{ backgroundColor: value?.hex_color }} />
                  <ColorTooltip target={toId(value?.value)} title={value?.value} toggle={() => toggle(toId(value?.value))} tooltipOpen={tooltipOpen[toId(value?.value)] || false} />
                </li>
              )}
            </>
          ) : null}
        </Fragment>
      ))}
    </ul>
  );
};

export default ColorAttribute;
