import Btn from "@/elements/buttons/Btn";
import request from "@/utils/axiosUtils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PlaceOrder = ({ values, addToCartData, errors }) => {
  const { t } = useTranslation("common");
  const access_token = Cookies.get("uat");
  const router = useRouter();
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!access_token) {
      setDisable(Object.keys(errors).length > 0);
    } else {
      setDisable(!(values["billing_address_id"] && values["payment_method"]));
    }
  }, [access_token, values, errors]);

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await request({ url: "/payment/initialize", method: "post", data: values });
      if (res?.data?.redirect_url) {
        window.location.href = res.data.redirect_url;
      } else if (res?.data?.order_id) {
        router.push(`/order/success?id=${res.data.order_id}`);
      }
    } catch (err) {
      console.error("[PlaceOrder] error:", err);
    } finally {
      setLoading(false);
    }
  };  
  return (
    <div className="text-end">
      {addToCartData?.is_digital_only ? (
        <Btn className="order-btn" onClick={handleClick} disabled={loading || (values["billing_address_id"] && values["payment_method"] ? false : true)}>
          {loading ? t("Loading") : t("PlaceOrder")}
        </Btn>
      ) : (
        <Btn className="order-btn" onClick={handleClick} disabled={loading || disable}>
          {loading ? t("Loading") : t("PlaceOrder")}
        </Btn>
      )}
    </div>
  );
};

export default PlaceOrder;
