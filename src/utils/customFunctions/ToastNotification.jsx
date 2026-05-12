import i18next from "i18next";
import { toast } from "react-toastify";

export const ToastNotification = (type, message) => {
  const msg = message ? i18next.t(message, { defaultValue: message }) : null;
  switch (type) {
    case "success":
      toast.success(msg);
      break;
    case "error":
      toast.error(msg || i18next.t("SomethingWentWrong"));
      break;
    case "warn":
      toast.warn(msg);
      break;
    case "info":
      toast.info(msg);
      break;
    default:
      toast(msg);
  }
  return true;
};
