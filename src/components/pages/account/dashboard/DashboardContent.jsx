import AccountContext from "@/context/accountContext";
import SettingContext from "@/context/settingContext";
import { ImagePath } from "@/utils/constants";
import Image from "next/image";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import ProfileInformation from "./ProfileInformation";

const DashboardContent = () => {
  const { t } = useTranslation("common");
  const { accountData } = useContext(AccountContext);
  const { settingData } = useContext(SettingContext);

  const showPoints = Boolean(settingData?.activation?.earning_points);
  const orderColSize = showPoints ? 6 : 12;

  return (
    <div className="counter-section">
      <div className="welcome-msg">
        <h4>
          {t("Hello")}, {accountData?.name ?? t("User")} !
        </h4>
        <p>{t("DashboardDescription")}</p>
      </div>

      <div className="total-box">
        <Row>
          {showPoints && (
            <Col md={6}>
              <div className="counter-box">
                <Image src={`${ImagePath}/icon/dashboard/account2.png`} className="img-fluid" alt="coinSvg" height={50} width={50} />
                <div>
                  <h3>{Number(accountData?.point ? accountData?.point?.balance : 0)}</h3>
                  <h5>{t("TotalPoints")}</h5>
                </div>
              </div>
            </Col>
          )}
          <Col md={orderColSize}>
            <div className="counter-box">
              <Image src={`${ImagePath}/icon/dashboard/account3.png`} className="img-fluid" alt="orderSvg" height={50} width={50} />
              <div>
                <h3>{accountData?.orders_count ? Number(accountData.orders_count) : 0}</h3>
                <h5>{t("TotalOrders")}</h5>
              </div>
            </div>
          </Col>
          <ProfileInformation />
        </Row>
      </div>
    </div>
  );
};

export default DashboardContent;
