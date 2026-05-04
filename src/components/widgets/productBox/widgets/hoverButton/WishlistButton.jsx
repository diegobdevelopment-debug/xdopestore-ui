import WishlistContext from "@/context/wishlistContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import Btn from "@/elements/buttons/Btn";
import { audioFile, Href } from "@/utils/constants";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";

const WishlistButton = ({ productstate, customClass, hideAction, customAnchor }) => {
  const [productWishlist, setProductWishlist] = useState(productstate?.is_wishlist);
  const [addToWishlistAudio] = useState(() => (typeof window !== "undefined" ? new Audio(audioFile) : null));
  const { setOpenAuthModal } = useContext(ThemeOptionContext);
  const { addToWishlist, removeWishlist } = useContext(WishlistContext);

  useEffect(() => {
    setProductWishlist(productstate?.is_wishlist);
  }, [productstate?.is_wishlist]);

  const handelWishlist = () => {
    if (Cookies.get("uat")) {
      addToWishlistAudio?.play();
      if (productWishlist) {
        removeWishlist(productstate.id, productstate.wish_list_id ?? productstate.id);
      } else {
        addToWishlist(productstate);
      }
      setProductWishlist((prev) => !prev);
    } else {
      setOpenAuthModal(true);
    }
  };

  return (
    <>
      {customClass ? (
        <Btn className={customClass ? customClass : ""} onClick={handelWishlist}>
          {productWishlist ? <RiHeartFill className="theme-color" /> : <RiHeartLine />}
        </Btn>
      ) : customAnchor ? (
        <a href={Href} title="Add to Wishlist" className={`wishlist-icon ${productWishlist ? "theme-color" : ""}`} onClick={handelWishlist}>
          <i className={`ri-heart-${productWishlist ? "fill" : "line"}`}></i>
        </a>
      ) : (
        !hideAction?.includes("wishlist") && (
          <div title="Wishlist" onClick={handelWishlist} className="wishlist-icon">
            <a className={"heart-icon"}>{productWishlist ? <RiHeartFill className="theme-color" /> : <RiHeartLine />}</a>
          </div>
        )
      )}
    </>
  );
};

export default WishlistButton;
