import ThemeOptionContext from "@/context/themeOptionsContext";
import { useContext } from "react";

const GridBox = ({ grid, setGrid }) => {
  const { setVariant } = useContext(ThemeOptionContext);

  return (
    <div className="collection-grid-view">
      <ul>
        <li className={`${grid == 2 ? "active" : ""}`} onClick={() => setGrid(2)}>
          <i className="ri-layout-2-line" />
        </li>
        <li className={`${grid == 3 ? "active" : ""}`} onClick={() => setGrid(3)}>
          <i className="ri-layout-3-line" />
        </li>
        <li className={`${grid == 4 ? "active" : ""}`} onClick={() => setGrid(4)}>
          <i className="ri-layout-4-line" />
        </li>
        <li className={`${grid == "list" ? "active" : ""}`} onClick={() => { setGrid("list"); setVariant('product_box_eleven'); }}>
          <i className="ri-list-unordered" />
        </li>
      </ul>
    </div>
  );
};

export default GridBox;
