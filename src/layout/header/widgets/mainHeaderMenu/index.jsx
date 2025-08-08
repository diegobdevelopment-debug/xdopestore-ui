import request from "@/utils/axiosUtils";
import useFetchQuery from "@/utils/hooks/useFetchQuery";
import { useEffect, useState } from "react";
import MenuList from "./MenuList";

const MainHeaderMenu = () => {
  const [isOpen, setIsOpen] = useState([]);
  const {
    data: headerMenu,
    refetch,
    isLoading,
    fetchStatus,
  } = useFetchQuery(["menu"], () => request({ url: "/menu" }), {
    select: (res) => {
      // Extract the menu items from the API response
      const originalData = res.data.data;
      // Optionally add or update properties on the remaining items. Not well understood
      const modifiedData = originalData.map((item) => ({
        ...item,
        class: "0",
      }));

      // Return filtered and modified list of menu items
      return modifiedData;
    },
    refetchOnWindowFocus: true,
    enabled: false,
  });

  useEffect(() => {
    isLoading && refetch();
  }, [isLoading]);

  return (
    <>
      {isLoading ? (
        <ul className="skeleton-menu navbar-nav">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      ) : (
        <ul className="navbar-nav">
          {headerMenu?.map((menu, i) => (
            <MenuList menu={menu} key={i} customClass={`${!menu?.path ? "dropdown" : ""} nav-item `} level={0} isOpen={isOpen} setIsOpen={setIsOpen} />
          ))}
        </ul>
      )}
    </>
  );
};

export default MainHeaderMenu;
