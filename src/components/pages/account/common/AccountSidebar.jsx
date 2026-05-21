import NavTabTitles from "@/components/widgets/NavTabs";
import AccountContext from "@/context/accountContext";
import SettingContext from "@/context/settingContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { sidebarMenu } from "@/data/pages/Account";
import Btn from "@/elements/buttons/Btn";
import Loader from "@/layout/loader";
import React, { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiCloseLine } from "react-icons/ri";
import { Col } from "reactstrap";
import SidebarProfile from ".";

const AccountSidebar = ({ tabActive }) => {
  const [activeTab, setActiveTab] = useState({ id: tabActive });
  const { mobileSideBar, setMobileSideBar } = useContext(AccountContext);
  const { settingData } = useContext(SettingContext);
  const handelCallback = () => {
    setMobileSideBar(!mobileSideBar);
  };
  const { t } = useTranslation("common");
  const { isLoading } = useContext(ThemeOptionContext);

  // Hide items whose `flag` is disabled in the storefront settings.
  // For now only Earning Points uses this; future toggles can reuse the
  // same `activation.<flag>` convention.
  const visibleMenu = useMemo(() => {
    const activation = settingData?.activation || {};
    return sidebarMenu.filter((item) => !item.flag || activation[item.flag]);
  }, [settingData]);

  if (isLoading) return <Loader />;
  return (
    <Col lg={3}>
      <div className={`dashboard-sidebar ${mobileSideBar ? "open" : ""}`}>
        <Btn color="transparent" className="back-btn" onClick={handelCallback}>
          <RiCloseLine />
          <span>{t("Close")}</span>
        </Btn>
        <SidebarProfile />
        <div className="faq-tab">
          <NavTabTitles classes={{ navClass: "nav nav-tabs" }} setActiveTab={setActiveTab} activeTab={activeTab} titleList={visibleMenu} isLogout callBackFun={handelCallback} />
        </div>
      </div>
    </Col>
  );
};

export default AccountSidebar;
