import MessageCreate from "./MessageCreate";
import { ToastNotification } from "./ToastNotification";

const SuccessHandle = (resData, router, path, message, setCouponError, pathName,setShowBoxMessage) => {
  if (resData.status === 201 || resData.status === 200) {
    path && router && router.push(path ? path : pathName.slice(0, pathName.slice(1).indexOf("/") + 1));
    {
      message !== 'No' && ToastNotification("success", message ? message : (router && MessageCreate(pathName)));
    }
  } else if (resData.response?.data?.message || resData?.data?.errors?.[0]?.message || resData?.data?.message) {
    const errMsg = resData.response?.data?.message || resData?.data?.errors?.[0]?.message || resData?.data?.message;
    setCouponError && setCouponError(errMsg);
    message !== 'No' && ToastNotification("error", errMsg);
    setShowBoxMessage && setShowBoxMessage(errMsg);
  
  } else { message !== 'No' && ToastNotification("error"); }
};

export default SuccessHandle;
