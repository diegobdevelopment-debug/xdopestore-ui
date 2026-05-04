import request from "@/utils/axiosUtils";
import { WishlistAPI } from "@/utils/axiosUtils/API";
import useCreate from "@/utils/hooks/useCreate";
import useDelete from "@/utils/hooks/useDelete";
import useFetchQuery from "@/utils/hooks/useFetchQuery";;
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import WishlistContext from ".";
import ThemeOptionContext from "../themeOptionsContext";

const WishlistProvider = (props) => {
  const isCookie = Cookies.get("uat");
  const [wishlistProducts, setWishlistProducts] = useState([]);
  // { [productId]: wishlistItemId } — drives the filled/empty heart icon
  const [wishlistIds, setWishlistIds] = useState({});
  const { setOpenAuthModal } = useContext(ThemeOptionContext);

  const { data: WishlistApiData, isLoading: WishlistAPILoading, refetch } = useFetchQuery([WishlistAPI], () => request({ url: WishlistAPI }), { enabled: false, refetchOnWindowFocus: false, select: (res) => res?.data });

  const { mutate, isLoading } = useCreate(WishlistAPI, false, false, "Added to Wishlist List");
  const { mutate: deleteWishlist } = useDelete(WishlistAPI, false, false, "Product Deleted from Wishlist");

  useEffect(() => {
    if (isCookie) refetch();
  }, [isCookie]);

  useEffect(() => {
    if (isCookie && WishlistApiData) {
      const items = WishlistApiData.data || [];
      setWishlistProducts(items);
      // item._id = product's _id; item.id = wishlist record id (overwritten in API transform)
      const map = {};
      items.forEach((item) => {
        const productId = String(item._id);
        map[productId] = item.id;
      });
      setWishlistIds(map);
    }
  }, [WishlistAPILoading, isCookie, WishlistApiData]);

  const addToWishlist = (productObj) => {
    if (Cookies.get("uat")) {
      const productId = String(productObj.id || productObj._id);
      // Optimistic update — we don't have the wishlist id yet, use productId as placeholder
      setWishlistIds((prev) => ({ ...prev, [productId]: productId }));
      mutate({ product_id: productObj.id }, {
        onSuccess: () => refetch(),
        onError: () => setWishlistIds((prev) => { const next = { ...prev }; delete next[productId]; return next; }),
      });
    } else {
      setOpenAuthModal(true);
    }
  };

  const removeWishlist = (id, wishId) => {
    if (isCookie && wishId) {
      const wishlistId = typeof wishId == "object" ? wishId.id : wishId;
      const productId = String(id);
      // Optimistic update
      setWishlistProducts((prev) => prev.filter((p) => p.id !== wishlistId));
      setWishlistIds((prev) => { const next = { ...prev }; delete next[productId]; return next; });
      deleteWishlist(wishlistId, { onSuccess: () => refetch() });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        ...props,
        wishlistProducts,
        WishlistAPILoading,
        setWishlistProducts,
        removeWishlist,
        refetch,
        isLoading,
        addToWishlist,
        wishlistIds,
      }}
    >
      {props.children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
