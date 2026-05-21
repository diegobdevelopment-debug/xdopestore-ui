import SettingContext from "@/context/settingContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Input, Label } from "reactstrap";

// "Pay with points" line in the checkout sidebar. The wallet line that used
// to live here was removed along with the My Wallet feature, and the points
// block is now gated by the storefront's earning_points activation flag.
const PointWallet = ({ values, setFieldValue, data }) => {
  const { convertCurrency, settingData } = useContext(SettingContext);
  const { t } = useTranslation("common");

  if (!settingData?.activation?.earning_points) return null;

  return (
    <>
      <li>
        <h4 className={`${values["points_amount"] ? "fw-bold txt-primary" : "text-muted"}`}>{t("Points")}</h4>
        <h4 className={`${values["points_amount"] ? "price fw-bold txt-primary" : "price text-muted"}`}>
          {convertCurrency(data?.data?.total?.convert_point_amount || 0)}
        </h4>
      </li>
      <li className="border-cls">
        <Label className="form-check-label m-0">{t("Wouldyouprefertopayusingpoints")}?</Label>
        <Input
          type="checkbox"
          className="checkbox_animated check-it"
          checked={values["points_amount"] ? true : false}
          onChange={() => setFieldValue("points_amount", !values["points_amount"])}
        />
      </li>
    </>
  );
};

export default PointWallet;
