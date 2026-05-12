import WishlistContext from "@/context/wishlistContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { Href } from "@/utils/constants";
import Cookies from "js-cookie";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";

const AddToWishlist = ({ productObj, customClass }) => {
  const { t } = useTranslation("common");
  const { setOpenAuthModal } = useContext(ThemeOptionContext);
  const { addToWishlist, removeWishlist, wishlistIds } = useContext(WishlistContext);

  const productId = String(productObj?.id || productObj?._id || "");
  const isWishlisted = !!wishlistIds?.[productId];

  const handelWishlist = () => {
    if (Cookies.get("uat")) {
      if (isWishlisted) {
        removeWishlist(productId, wishlistIds[productId]);
      } else {
        addToWishlist(productObj);
      }
    } else {
      setOpenAuthModal(true);
    }
  };

  return (
    <>
      {customClass ? (
        <a onClick={handelWishlist} href={Href} className={customClass ? customClass : ""}>
          {isWishlisted ? <RiHeartFill className="theme-color" /> : <RiHeartLine />}
        </a>
      ) : (
        <li title={t("WishlistTitle")} onClick={handelWishlist}>
          <a className={"heart-icon"}>{isWishlisted ? <RiHeartFill className="theme-color" /> : <RiHeartLine />}</a>
        </li>
      )}
    </>
  );
};

export default AddToWishlist;
