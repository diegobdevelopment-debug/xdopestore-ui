import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Breadcrumb, Container } from "reactstrap";

const Breadcrumbs = ({ subNavigation, title }) => {
  const { t } = useTranslation("common");
  return (
    <div className="breadcrumb-section">
      <Container>
        <h2>{t(title?.replaceAll("-", " "))}</h2>
        <nav className="theme-breadcrumb">
          <Breadcrumb>
            <div className="breadcrumb-item">
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
          </Breadcrumb>
        </nav>
      </Container>
    </div>
  );
};

export default Breadcrumbs;
