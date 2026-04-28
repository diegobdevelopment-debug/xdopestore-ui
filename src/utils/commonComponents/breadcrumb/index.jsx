<<<<<<< HEAD
=======
import Link from "next/link";
>>>>>>> 073ecc6aa46337a1439684b407e3b9c79bd93edc
import { useTranslation } from "react-i18next";
import { Breadcrumb } from "reactstrap";
import Link from "next/link";

<<<<<<< HEAD
const Breadcrumbs = ({ subNavigation, subTitle, title }) => {
=======
const Breadcrumbs = ({ subNavigation, title }) => {
>>>>>>> 073ecc6aa46337a1439684b407e3b9c79bd93edc
  const { t } = useTranslation("common");
  return (
    <div className="breadcrumb-section">
      <div className="container">
        <h2>{t(title?.replaceAll("-", " "))}</h2>
        <nav className="theme-breadcrumb">
          <Breadcrumb>
            <div className="breadcrumb-item">
<<<<<<< HEAD
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
=======
              <Link href="/">{t("Home")}</Link>
            </div>
            {subNavigation?.map((result, i) => (
              <div key={i} className="breadcrumb-item active">
                {result?.path ? (
                  <Link href={result.path}>{t(result.name?.replaceAll("-", " "))}</Link>
                ) : (
                  <span>{t(result.name?.replaceAll("-", " "))}</span>
                )}
              </div>
            ))}
>>>>>>> 073ecc6aa46337a1439684b407e3b9c79bd93edc
          </Breadcrumb>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;
