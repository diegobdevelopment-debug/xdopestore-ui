import Btn from "@/elements/buttons/Btn";
import CartContext from "@/context/cartContext";
import request from "@/utils/axiosUtils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const PlaceOrder = ({ values, addToCartData, errors }) => {
  const { t } = useTranslation("common");
  const access_token = Cookies.get("uat");
  const router = useRouter();
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(false);
  // Cart context is used to flush the local cart state after a successful
  // order so the header badge and cart drawer reflect the cleared server cart.
  const { setCartProducts, setCartTotal, refetch: cartRefetch } = useContext(CartContext) || {};

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
      const ok = res?.status === 200 || res?.status === 201;

      if (ok && res?.data?.redirect_url) {
        // Gateway-redirect flow (MercadoPago, etc.): the server keeps the
        // server cart intact until /payment/verify confirms approval. The
        // full-page redirect blows away React state anyway, so we don't
        // touch the local cart here — if the gateway succeeds, /payment/verify
        // clears the server cart and the next CartProvider mount picks that
        // up. If it fails, the user comes back and their items are still here.
        window.location.href = res.data.redirect_url;
        return;
      }

      if (ok && res?.data?.order_id) {
        // COD / inline-success flow: the server already ran Cart.deleteMany
        // for this consumer inside /payment/initialize, so pull the empty
        // cart down to keep React state in sync.
        setCartProducts && setCartProducts([]);
        setCartTotal && setCartTotal(0);
        if (typeof window !== "undefined") {
          // Clear any guest-cart residue so a later logout doesn't resurrect
          // the just-purchased items.
          try { localStorage.removeItem("cart"); } catch {}
        }
        cartRefetch && cartRefetch();
        router.push(`/order/success?id=${res.data.order_id}`);
        return;
      }

      // Anything else — surface to the user via the existing toast machinery.
      console.error("[PlaceOrder] unexpected response:", res?.data);
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
