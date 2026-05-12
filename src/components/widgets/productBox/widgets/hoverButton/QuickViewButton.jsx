import { useState } from "react";
import { useTranslation } from "react-i18next";
import VariationModal from "../variationModal";

const QuickViewButton = ({ productstate, hideAction, className }) => {
  const { t } = useTranslation("common");
  const [variationModal, setVariationModal] = useState("");
  return (
    <>
      {!hideAction?.includes("view") && (
        <div className={className ? className : ""} title={t("ViewProduct")} onClick={() => setVariationModal(productstate.id)}>
          <a>
            <i className="ri-search-line" />
          </a>
        </div>
      )}
      <VariationModal setVariationModal={setVariationModal} variationModal={variationModal} productObj={productstate} />
    </>
  );
};

export default QuickViewButton;
