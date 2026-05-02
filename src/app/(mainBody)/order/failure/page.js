"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const OrderFailurePage = () => {
  const { t } = useTranslation("common");
  return (
    <section className="section-b-space">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center py-5">
            <div style={{ fontSize: 64 }}>✗</div>
            <h2 className="mt-3">{t("payment_failed") || "Pago fallido"}</h2>
            <p>{t("payment_failed_msg") || "No pudimos procesar tu pago. Por favor intenta de nuevo."}</p>
            <div className="mt-4 d-flex gap-3 justify-content-center">
              <Link href="/checkout" className="btn btn-solid">
                {t("try_again") || "Intentar de nuevo"}
              </Link>
              <Link href="/" className="btn btn-outline">
                {t("continue_shopping") || "Seguir comprando"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderFailurePage;
