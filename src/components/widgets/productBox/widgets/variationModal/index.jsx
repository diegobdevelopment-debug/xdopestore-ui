import ProductAttribute from "@/components/productDetails/common/productAttribute/ProductAttribute";
import WishlistCompareShare from "@/components/productDetails/common/WishlistCompareShare";
import CustomModal from "@/components/widgets/CustomModal";
import { useState } from "react";
import { Col, Row } from "reactstrap";
import LeftSideModal from "./LeftSideModal";
import RightVariationModal from "./RightSideModal";
import VariationAddToCart from "./VariationAddToCart";
import VariationModalQty from "./VariationModalQty";

const getInitialVariationState = (productObj) => {
  const attributeValues = [];
  const statusIds = [];
  productObj?.variations?.forEach((variation) => {
    variation?.attribute_values?.forEach((av) => {
      if (!attributeValues.includes(av.id)) attributeValues.push(av.id);
    });
    if (!variation.status) {
      variation?.attribute_values?.forEach((av) => {
        if (!statusIds.includes(av.id)) statusIds.push(av.id);
      });
    }
  });
  // assign variation_image to matching attribute_values on image-style attributes
  productObj?.attributes?.forEach((attribute) => {
    if (attribute.style === "image") {
      productObj?.variations?.forEach((variation) => {
        const varAttrIds = variation?.attribute_values?.map((av) => av.id);
        attribute.attribute_values?.forEach((av) => {
          if (varAttrIds?.includes(av.id)) {
            av.variation_image = variation.variation_image;
          }
        });
      });
    }
  });
  return { product: productObj, attributeValues, statusIds, productQty: 1, selectedVariation: "", variantIds: [] };
};

const VariationModal = ({ productObj, variationModal, setVariationModal }) => {
  const [cloneVariation, setCloneVariation] = useState(() => getInitialVariationState(productObj));

  return (
    <CustomModal modal={productObj?.id == variationModal} setModal={setVariationModal} classes={{ modalClass: "quick-view-modal modal-lg theme-modal-2", modalHeaderClass: "p-0" }}>
      <Row className="g-sm-4 g-3">
        <LeftSideModal cloneVariation={cloneVariation} productObj={productObj} />
        <Col lg="6" className="rtl-text">
          <div className="right-sidebar-modal product-page-details">
            <RightVariationModal cloneVariation={cloneVariation} />
            {cloneVariation?.product && productObj?.id == variationModal && (
              <div className="modal-attributes">
                <ProductAttribute noHoverEffect={true} productState={cloneVariation} setProductState={setCloneVariation} />
              </div>
            )}
            <div className="product-buttons">
              <VariationModalQty cloneVariation={cloneVariation} setCloneVariation={setCloneVariation} />
              <VariationAddToCart  cloneVariation={cloneVariation} setVariationModal={setVariationModal} />
            </div>
          </div>
        </Col>
      </Row>
    </CustomModal>
  );
};

export default VariationModal;
