import NoDataFound from "@/components/widgets/NoDataFound";
import TitleBox from "@/components/widgets/title";
import { SocialMediaSlider } from "@/data/sliderSetting/SliderSetting";
import { storageURL } from "@/utils/constants";
import React from "react";
import { RiInstagramLine } from "react-icons/ri";
import Slider from "react-slick";

const MIN_SLIDES = 14;

const HomeSocialMedia = ({ media, title, classes, sliderClass, type, sliderOptions }) => {
  const socialSliderSettings = sliderOptions ? sliderOptions : SocialMediaSlider;
  const activeBanners = media?.banners?.filter((b) => b.status !== false) ?? [];

  const slides = activeBanners.length > 0 && activeBanners.length < MIN_SLIDES
    ? Array.from({ length: Math.ceil(MIN_SLIDES / activeBanners.length) }, () => activeBanners).flat()
    : activeBanners;

  return (
    <>
      <div className={classes ? classes : "container-fluid p-0"}>
        {type && <TitleBox title={media} type={type} />}
        <div className="slide-7 instagram-slider no-arrow">
          <Slider {...socialSliderSettings} className={sliderClass ? sliderClass : ""}>
            {slides.map((banner, index) => (
              <div className="h-100" key={index}>
                <a href={banner.redirect_link?.link} tabIndex="0" target="_blank">
                  <div className="instagram-box bg-size h-100" style={{ backgroundImage: `url(${banner.image_url ? storageURL + banner.image_url : banner.original_url})` }}>
                    <img src={banner.image_url ? storageURL + banner.image_url : banner.original_url} className="bg-img d-none" alt="img" />
                    <div className="overlay">
                      <RiInstagramLine />
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </Slider>
        </div>

        {!activeBanners.length && <NoDataFound className="no-data-added" text="NoMediaFound" />}
      </div>
    </>
  );
};

export default HomeSocialMedia;
