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

const SliderSlide = ({ banner, height, width }) => {
  const src = resolveUrl(banner);
  const hasText = banner?.title || banner?.subtitle;
  const href = banner?.redirect_link?.link
    ? banner.redirect_link.link_type === "collection"
      ? `/category/${banner.redirect_link.link}`
      : banner.redirect_link.link
    : "/collections";

  return (
<<<<<<< HEAD
    <>
      <div className="position-relative">
        {bannerData?.banners?.length > 1 ? (
          <Slider {...homeBannerSettings} className={sliderClass ? sliderClass : ""}>
            {bannerData?.banners?.map((banner, index) => {
              if (videoType.includes(banner && banner?.image_url && banner?.image_url?.substring(banner?.image_url?.lastIndexOf(".") + 1))) {
                return (
                  <div key={index} className="home" id="block" style={{ width: "100%", position: "relative" }} data-vide-bg="../assets/video/video.mp4" data-vide-options="position: 0% 50%">
                    <div style={{ position: "absolute", zIndex: -1, inset: "0px", overflow: "hidden", backgroundSize: "cover", backgroundColor: "transparent", backgroundRepeat: "no-repeat", backgroundPosition: "0% 50%", backgroundImage: "none" }}>
                      <video autoPlay loop muted style={{ margin: "auto", position: "absolute", zIndex: "-1", top: "50%", left: " 0%", transform: "translate(0%, -50%)", visibility: "visible", opacity: "1", width: "1907px", height: "auto" }}>
                        <source src={storageURL + banner?.image_url} type="video/mp4" />
                      </video>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="home">
                    <ImageLink imgUrl={banner} placeholder={`${ImagePath}/banner.png`} link={banner} height={height} width={width} homeBanner={true} />
                  </div>
                );
              }
            })}
          </Slider>
        ) : videoType.includes((bannerData?.banners?.[0] || bannerData) && (bannerData?.banners?.[0]?.image_url || bannerData?.image_url) && (bannerData?.banners?.[0]?.image_url?.substring(bannerData?.banners?.[0]?.image_url?.lastIndexOf(".") + 1) || bannerData?.image_url?.substring(bannerData?.image_url?.lastIndexOf(".") + 1))) ? (
          <div className="home" id="block" data-vide-bg="../assets/video/video.mp4" data-vide-options="position: 0% 50%">
            <div style={{ position: "absolute", zIndex: -1, inset: "0px", overflow: "hidden", backgroundSize: "cover", backgroundColor: "transparent", backgroundRepeat: "no-repeat", backgroundPosition: "0% 50%", backgroundImage: "none" }}>
              <video autoPlay loop muted style={{ margin: "auto", position: "absolute", zIndex: "-1", top: "50%", left: " 0%", transform: "translate(0%, -50%)", visibility: "visible", opacity: "1", width: "1907px", height: "auto" }}>
                <source src={storageURL + bannerData?.banners?.[0]?.image_url || bannerData?.image_url} type="video/mp4" />
              </video>
            </div>
          </div>
        ) : (
          <div className="home">
            <ImageLink imgUrl={bannerData?.banners?.[0] || bannerData} placeholder={`${ImagePath}/banner.png`} height={height} width={width} />
          </div>
        )}
        <div className="home-skeleton">
          <div className="skeleton-content">
            <div className="container">
              <div className="row">
                <div className="col-lg-7 col-sm-8 col-11">
                  <p className="card-text placeholder-glow row g-lg-4 g-sm-3 g-2">
                    <span className="col-7">
                      <span className="placeholder"></span>
                    </span>
                    <span className="col-9">
                      <span className="placeholder"></span>
                    </span>
                    <span className="col-6">
                      <span className="placeholder"></span>
                    </span>
                  </p>
                </div>
=======
    <div
      className="home"
      style={{ backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-7 col-sm-10 col-12">
            <div className="slider-contain">
              <div>
                {banner?.subtitle && <h4>{banner.subtitle}</h4>}
                {banner?.title && <h1>{banner.title}</h1>}
                <Link href={href} className="btn btn-solid hover-solid btn-md">
                  {banner?.button_text || "Shop Now"}
                </Link>
>>>>>>> 073ecc6aa46337a1439684b407e3b9c79bd93edc
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
