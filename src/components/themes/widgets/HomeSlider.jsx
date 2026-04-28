"use client";
import { homeBannerSettings } from "@/data/sliderSetting/SliderSetting";
import { ImagePath, storageURL } from "@/utils/constants";
import Link from "next/link";
import Slider from "react-slick";

const resolveUrl = (banner) => {
  if (banner?.image_url) return storageURL + banner.image_url;
  if (banner?.original_url) return banner.original_url;
  return `${ImagePath}/banner.png`;
};

const colClass = (pos) => {
  switch (pos) {
    case "right": return "col-lg-7 col-sm-10 col-12 ms-auto text-end";
    case "center": return "col-lg-7 col-sm-10 col-12 mx-auto text-center";
    default: return "col-lg-7 col-sm-10 col-12";
  }
};

const SliderSlide = ({ banner, height, width }) => {
  const src = resolveUrl(banner);
  const href = banner?.redirect_link?.link
    ? banner.redirect_link.link_type === "collection"
      ? `/category/${banner.redirect_link.link}`
      : banner.redirect_link.link
    : "/collections";

  return (
    <div
      className="home d-flex align-items-center"
      style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="container">
        <div className="row">
          <div className={colClass(banner?.text_position)}>
            <div className="slider-contain">
              <div>
                {banner?.subtitle && <h4>{banner.subtitle}</h4>}
                {banner?.title && <h1>{banner.title}</h1>}
                <Link href={href} className="btn btn-solid hover-solid btn-md">
                  {banner?.button_text || "Shop Now"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeSlider = ({ bannerData, height, width, sliderClass }) => {
  const banners = bannerData?.banners ?? [];

  if (banners.length > 1) {
    return (
      <Slider {...homeBannerSettings} className={sliderClass || ""}>
        {banners.map((banner, i) => (
          <SliderSlide key={i} banner={banner} height={height} width={width} />
        ))}
      </Slider>
    );
  }

  const single = banners[0] ?? bannerData;
  return <SliderSlide banner={single} height={height} width={width} />;
};

export default HomeSlider;
