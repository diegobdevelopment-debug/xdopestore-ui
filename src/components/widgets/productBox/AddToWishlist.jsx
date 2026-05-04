import WishlistContext from "@/context/wishlistContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { Href } from "@/utils/constants";
import Cookies from "js-cookie";
import { useContext } from "react";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";

const AddToWishlist = ({ productObj, customClass }) => {
  const { setOpenAuthModal } = useContext(ThemeOptionContext);
  const { addToWishlist, removeWishlist } = useContext(WishlistContext);

  const handelWishlist = (productObj) => {
    if (Cookies.get("uat")) {
      if (productObj.is_wishlist) {
        removeWishlist(productObj.id, productObj.wish_list_id ?? productObj.id);
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
        <a onClick={() => handelWishlist(productObj)} href={Href} className={customClass ? customClass : ""}>
          {productObj.is_wishlist ? <RiHeartFill className="theme-color" /> : <RiHeartLine />}
        </a>
      ) : (
        <li title="Wishlist" onClick={() => handelWishlist(productObj)}>
          <a className={"heart-icon"}>{productObj.is_wishlist ? <RiHeartFill className="theme-color" /> : <RiHeartLine />}</a>
        </li>
      )}
    </>
  );
};

export default AddToWishlist;
