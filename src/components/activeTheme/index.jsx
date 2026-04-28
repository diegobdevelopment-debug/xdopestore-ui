'use client'
import Fashion1 from '../themes/fashion/fashion1'

const ActiveTheme = () => {
  const { data, isLoading } = useFetchQuery([ThemeAPI], () => request({ url: ThemeAPI }), { enabled: true, refetchOnWindowFocus: false, select: (res) => res?.data.data });
  const search = useSearchParams();
  const themeBySlug = search.get("theme");
  const activeTheme = data?.find((elem) => elem.status === 1);
  const { isLoading: themeLoading } = useContext(ThemeOptionContext);
console.log(activeTheme, "ACTIVE THEME")
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

  if (themeLoading || isLoading) return <Loader />;
  return themeBySlug ? checkActive[themeBySlug] : checkActive[activeTheme?.slug] ?? <Loader />;
};

export default ActiveTheme;
