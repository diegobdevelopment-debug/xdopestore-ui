import request from "@/utils/axiosUtils";
import { SettingAPI } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import SettingContext from ".";

const SettingProvider = (props) => {
  const [menuLoader, setMenuLoader] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState({});
  const [settingState, setSettingData] = useState({});
  const [settingObj, setSettingObj] = useState({});
  const { data: settingData, isLoading, refetch } = useFetchQuery([SettingAPI], () => request({ url: SettingAPI }),
     { enabled: false, refetchOnWindowFocus: false, select: (res) => res?.data?.values});

  useEffect(() => {
    refetch(); // 🔁 Fetch settings when component mounts
  }, []);

  useEffect(() => {
    if (settingData) {
      if (settingData?.maintenance?.maintenance_mode) {
        Cookies.set("maintenance", JSON.stringify(true));
      } else {
        Cookies.remove("maintenance");
      }
      setSettingData(settingData);
      setSettingObj(settingData);
    }
  }, [settingData]);

  useEffect(() => {
    isLoading && refetch();
  }, [isLoading]);
  const convertCurrency = useCallback(
    (value) => {
      const currency = selectedCurrency?.code ? selectedCurrency : settingObj?.general?.default_currency;
      const position = currency?.symbol_position || "before_price";
      const symbol = currency?.symbol || "$";
      const rate = Number(currency?.exchange_rate) || 1;
      const amount = Number(value) * rate;
      if (isNaN(amount)) return `${symbol}0`;
      // Currencies without decimals (COP, CLP, JPY, KRW, etc.)
      const noDecimals = ["COP", "CLP", "JPY", "KRW", "VND", "IDR"].includes(currency?.code);
      const formatted = noDecimals
        ? Math.round(amount).toLocaleString("es-CO")
        : amount.toFixed(2);
      return position === "before_price" ? `${symbol}${formatted}` : `${formatted} ${symbol}`;
    },
    [settingObj, selectedCurrency]
  );
  return <SettingContext.Provider value={{ ...props, settingData, convertCurrency, selectedCurrency, setSelectedCurrency, menuLoader, isLoading, setMenuLoader }}>{props.children}</SettingContext.Provider>;
};
export default SettingProvider;
