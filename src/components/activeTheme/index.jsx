"use client";
import request from "@/utils/axiosUtils";
import { ThemeAPI } from "@/utils/axiosUtils/API";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import { useSearchParams } from "next/navigation";
import Bag from "../themes/bag";
import BeautyHomePage from "../themes/beauty";
import Christmas from "../themes/christmas";
import DigitalDownload from "../themes/digitalDownload";
import Fashion1 from "../themes/fashion/fashion1";
import FlowerHomePage from "../themes/flower";
import FullPage from "../themes/fullPage";
import Game from "../themes/game";
import Gradient from "../themes/gradient";
import Medical from "../themes/medical";
import SingleProduct from "../themes/singleProduct";
import Surfboard from "../themes/surfBoard";
import ToolsHomePage from "../themes/tools";
import VideoSlider from "../themes/videoSlider";
import Watch from "../themes/watch";
import { useContext } from "react";
import ThemeOptionContext from "@/context/themeOptionsContext";
import Loader from "@/layout/loader";

const ActiveTheme = () => {
  const { data, isLoading } = useFetchQuery([ThemeAPI], () => request({ url: ThemeAPI }), { enabled: true, refetchOnWindowFocus: false, select: (res) => res?.data.data });
  const search = useSearchParams();
  const themeBySlug = search.get("theme");
  const activeTheme = data?.find((elem) => elem.status === 1);
  const { isLoading: themeLoading } = useContext(ThemeOptionContext);

  const checkActive = {
    fashion_one: <Fashion1 />,
    game: <Game />,
    flower: <FlowerHomePage />,
    gradient: <Gradient />,
    christmas: <Christmas />,
    full_page: <FullPage />,
    tools: <ToolsHomePage />,
    bag: <Bag />,
    watch: <Watch />,
    beauty: <BeautyHomePage />,
    video_slider: <VideoSlider />,
    surfboard: <Surfboard />,
    medical: <Medical />,
    single_product: <SingleProduct />,
    digital_download: <DigitalDownload />,
  };

  if (themeLoading) return <Loader />;
  return themeBySlug ? checkActive[themeBySlug] : checkActive[activeTheme?.slug];
};

export default ActiveTheme;
