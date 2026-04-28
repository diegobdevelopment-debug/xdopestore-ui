import ProductIdsContext from "@/context/productIdsContext";
import { Href, getMediaSrc } from "@/utils/constants";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";

// Resolve image src: prefer image_url (local storage), then original_url (absolute), then placeholder
const resolveImg = (imgUrl, placeholder) => {
  if (imgUrl?.image_url) return storageURL + imgUrl.image_url;
  if (imgUrl?.original_url) return imgUrl.original_url;
  return placeholder;
};

const ImageLink = ({ classes = {}, imgUrl, placeholder, link, height, width, homeBanner = true, bgImg = false }) => {
  const [bgImage, setBgImage] = useState(bgImg);
  const { filteredProduct } = useContext(ProductIdsContext);
  const redirectToProduct = (productId) => {
    const product = filteredProduct.find((elem) => elem?.id == productId);
    return product?.slug ? `product/${product.slug}` : null;
  };

  const productRoute = imgUrl?.redirect_link?.link_type === "product" ? redirectToProduct(imgUrl?.redirect_link?.link) : null;

  return (
    <>
      {imgUrl?.redirect_link?.link_type === "external_url" ? (
        <Link className="h-100" href={imgUrl?.redirect_link?.link || "/"} target="_blank">
          {bgImage ? <div className={`bg-size ${classes}`} style={{ backgroundImage: "url(" + (getMediaSrc(imgUrl?.image_url, placeholder)) + ")" }}></div> : <Image src={getMediaSrc(imgUrl?.image_url, placeholder)} className="bg-img w-100 img-fluid" alt="banner" height={height} width={width} unoptimized style={{ objectFit: "cover", width: "100%", height: "100%" }} />}
        </Link>
      ) : imgUrl?.redirect_link?.link_type === "collection" && !homeBanner ? (
        <Link className="h-100" href={imgUrl?.redirect_link?.link || Href} target="_blank">
          {bgImage ? <div className={`bg-size ${classes}`} style={{ backgroundImage: "url(" + (getMediaSrc(imgUrl?.image_url, placeholder)) + ")" }}></div> : <Image src={getMediaSrc(imgUrl?.image_url, placeholder)} className="bg-img w-100 img-fluid" alt="banner" height={height} width={width} unoptimized style={{ objectFit: "cover", width: "100%", height: "100%" }} />}
        </Link>
      ) : imgUrl?.redirect_link?.link_type === "collection" && homeBanner ? (
        <Link className="h-100" href={imgUrl?.redirect_link?.link ? `/category/${imgUrl?.redirect_link?.link}` : Href}>
          {bgImage ? <div className={`bg-size ${classes}`} style={{ backgroundImage: "url(" + (getMediaSrc(imgUrl?.image_url, placeholder)) + ")" }}></div> : <Image src={getMediaSrc(imgUrl?.image_url, placeholder)} className="bg-img w-100 img-fluid" alt="banner" height={height} width={width} unoptimized style={{ objectFit: "cover", width: "100%", height: "100%" }} />}
        </Link>
      ) : imgUrl?.redirect_link?.link_type === "product" && productRoute ? (
        <Link className="h-100" href={`/${productRoute}`}>
          {bgImage ? <div className={`bg-size ${classes}`} style={{ backgroundImage: `url(${getMediaSrc(imgUrl?.image_url, placeholder)}` }}></div> : <Image src={getMediaSrc(imgUrl?.image_url, placeholder)} className="bg-img w-100 img-fluid" alt="banner" height={height} width={width} unoptimized style={{ objectFit: "cover", width: "100%", height: "100%" }} />}
        </Link>
      ) : bgImage ? (
        <div className={`bg-size ${classes}`} style={{ backgroundImage: `url(${getMediaSrc(imgUrl?.image_url, placeholder)}` }}></div>
      ) : (
        (imgUrl?.image_url || placeholder) && <Image src={getMediaSrc(imgUrl?.image_url, placeholder)} className="bg-img w-100 img-fluid" alt="banner" height={height} width={width} unoptimized style={{ objectFit: "cover", width: "100%", height: "100%" }} />
      )}
    </>
  );
};

export default ImageLink;
