import WishlistContext from "@/context/wishlistContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import Btn from "@/elements/buttons/Btn";
import { audioFile, Href } from "@/utils/constants";
import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";

const WishlistButton = ({ productstate, customClass, hideAction, customAnchor }) => {
  const [addToWishlistAudio] = useState(() => (typeof window !== "undefined" ? new Audio(audioFile) : null));
  const { setOpenAuthModal } = useContext(ThemeOptionContext);
  const { addToWishlist, removeWishlist, wishlistIds } = useContext(WishlistContext);

  const productId = String(productstate?.id || productstate?._id || "");
  const isWishlisted = !!wishlistIds?.[productId];

  const handelWishlist = () => {
    if (Cookies.get("uat")) {
      addToWishlistAudio?.play();
      if (isWishlisted) {
        removeWishlist(productId, wishlistIds[productId]);
      } else {
        addToWishlist(productstate);
      }
    } else {
      setOpenAuthModal(true);
    }
  };

  return (
    <>
      {customClass ? (
        <Btn className={customClass ? customClass : ""} onClick={handelWishlist}>
          {isWishlisted ? <RiHeartFill className="theme-color" /> : <RiHeartLine />}
        </Btn>
      ) : customAnchor ? (
        <a href={Href} title="Add to Wishlist" className={`wishlist-icon ${isWishlisted ? "theme-color" : ""}`} onClick={handelWishlist}>
          <i className={`ri-heart-${isWishlisted ? "fill" : "line"}`}></i>
        </a>
      ) : (
        !hideAction?.includes("wishlist") && (
          <div title="Wishlist" onClick={handelWishlist} className="wishlist-icon">
            <a className={"heart-icon"}>{isWishlisted ? <RiHeartFill className="theme-color" /> : <RiHeartLine />}</a>
          </div>
        )
      )}
    </>
  );
};

export default WishlistButton;
