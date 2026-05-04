"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const OrderPendingPage = () => {
  const { t } = useTranslation("common");
  return (
    <section className="section-b-space">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center py-5">
            <div style={{ fontSize: 64 }}>⏳</div>
            <h2 className="mt-3">{t("payment_pending") || "Pago pendiente"}</h2>
            <p>{t("payment_pending_msg") || "Tu pago está siendo procesado. Te notificaremos cuando se confirme."}</p>
            <div className="mt-4 d-flex gap-3 justify-content-center">
              <Link href="/account/order" className="btn btn-solid">
                {t("My_Orders") || "Mis pedidos"}
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

export default OrderPendingPage;
