import NoDataFound from "@/components/widgets/NoDataFound";
import CartContext from "@/context/cartContext";
import SettingContext from "@/context/settingContext";
import Loader from "@/layout/loader";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import ApplyCoupon from "./ApplyCoupon";
import PlaceOrder from "./PlaceOrder";
import PointWallet from "./PointWallet";

const BillingSummary = ({ data, values, setFieldValue, isLoading, mutate, storeCoupon, setStoreCoupon, errorCoupon, appliedCoupon, setAppliedCoupon, errors }) => {
  const { convertCurrency } = useContext(SettingContext);
  const { cartProducts, cartTotal } = useContext(CartContext);
  const { t } = useTranslation("common");

  const subtotal = cartTotal || cartProducts?.reduce((s, i) => s + (i.sub_total || 0), 0) || 0;
  const shipping = values?.shipping_total || 0;
  const couponDiscount = data?.data?.coupon_total_discount || 0;
  const total = (data?.data?.total) ?? (subtotal + shipping - couponDiscount);

  return (
    <div className="checkout-details ">
      {cartProducts?.length > 0 ? (
        <div className="order-box">
          <div className="title-box">
            <h4>{t("BillingSummary")}</h4>
            <ApplyCoupon values={values} setFieldValue={setFieldValue} data={data} storeCoupon={storeCoupon} setStoreCoupon={setStoreCoupon} errorCoupon={errorCoupon} appliedCoupon={appliedCoupon} setAppliedCoupon={setAppliedCoupon} mutate={mutate} isLoading={isLoading} />
          </div>
          <div>
            <div className="custom-box-loader">
              {isLoading && (
                <div className="box-loader">
                  <Loader />
                </div>
              )}
              <ul className="sub-total">
                <li>
                  {t("Subtotal")}
                  <span className="count">{convertCurrency(subtotal)}</span>
                </li>
                <li>
                  {t("Shipping")}
                  <span className="count">{convertCurrency(shipping)}</span>
                </li>
                {couponDiscount > 0 && (
                  <li>
                    {t("YouSave")}
                    <span className="count">- {convertCurrency(couponDiscount)}</span>
                  </li>
                )}

                <PointWallet values={values} setFieldValue={setFieldValue} data={data} />
              </ul>
              <ul className="total">
                <li className="list-total">
                  {t("Total")}
                  <span className="count">{convertCurrency(total)}</span>
                </li>
              </ul>
              <PlaceOrder values={values} errors={errors} />
            </div>
          </div>
        </div>
      ) : (
        <NoDataFound customClass="no-data-added" height={156} width={180} imageUrl={`/assets/svg/empty-items.svg`} title="EmptyCart" />
      )}
    </div>
  );
};

export default BillingSummary;
