import AccountContext from "@/context/accountContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

const AddressTable = ({ address }) => {
  const { accountData } = useContext(AccountContext);
  const { t } = useTranslation("common");
  return (
    <>
      <div className="top">
        <h6>
          {accountData?.name} <span>{address?.title}</span>
          {address?.is_default && (
            <span className="badge bg-dark ms-2" style={{ fontSize: '0.65rem', verticalAlign: 'middle' }}>
              {t("Default") || "Default"}
            </span>
          )}
        </h6>
      </div>
      <div className="middle">
        <div className="address">
          <p>{address?.street}{address?.city ? `, ${address.city}` : ''}</p>
          <p>
            {address?.state?.name}{address?.state?.name && address?.country?.name ? ', ' : ''}{address?.country?.name}
          </p>
          <p>{address?.pincode}</p>
        </div>
        <div className="number">
          <p>
            Phone: {address?.country_code ? `+${address.country_code}` : ''} {address?.phone}
          </p>
        </div>
      </div>
    </>
  );
};

export default AddressTable;
