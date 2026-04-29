import { useTranslation } from "react-i18next";
import { Breadcrumb } from "reactstrap";
import Link from "next/link";

const Breadcrumbs = ({ subNavigation, subTitle, title }) => {
  const { t } = useTranslation("common");
  return (
    <div className="breadcrumb-section">
      <div className="container">
        <h2>{t(title?.replaceAll("-", " "))}</h2>
        <nav className="theme-breadcrumb">
          <Breadcrumb>
            <div className="breadcrumb-item">
              <Link href="/"> {t("Home")} </Link>
            </div>
            {subNavigation?.map((result, i) => {
              const isLast = i === subNavigation.length - 1;
              return (
                <div key={i} className={`breadcrumb-item${isLast ? " active" : ""}`}>
                  {result?.link && !isLast ? (
                    <Link href={result.link}>{t(result?.name?.replaceAll("-", " "))}</Link>
                  ) : (
                    <span>{t(result?.name?.replaceAll("-", " "))}</span>
                  )}
                </div>
              );
            })}
          </Breadcrumb>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;
