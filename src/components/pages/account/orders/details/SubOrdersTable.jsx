import Link from "next/link";
import { Card, CardBody, Col, Row, Table } from "reactstrap";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { dateFormat } from "@/utils/customFunctions/DateFormat";
import SettingContext from "@/context/settingContext";
import { RiEyeLine } from "react-icons/ri";

const SubOrdersTable = ({ data }) => {
  const { convertCurrency } = useContext(SettingContext);
  const { t } = useTranslation("common");
  return (
    <Card className="dashboard-table">
      <CardBody>
        <div className="wallet-table">
          <div className="tracking-wrapper table-responsive">
            <Table className="product-table order-table">
              <thead>
                <tr>
                  <th scope="col">{t("order_number")}</th>
                  <th scope="col">{t("order_date")}</th>
                  <th scope="col">{t("total_amount")}</th>
                  <th scope="col">{t("Status")}</th>
                  <th scope="col">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((subOrder, i) => (
                  <tr key={i}>
                    <td>
                      <h6>#{subOrder?.order_number}</h6>
                    </td>
                    <td>{dateFormat(subOrder?.created_at)}</td>
                    <td>{convertCurrency(subOrder?.amount)} </td>
                    <td>
                      <div className={`status-${subOrder.order_status.slug}`}>
                        <span>{subOrder.order_status.name}</span>
                      </div>
                    </td>
                    <td>
                      <Link href={`/account/order/details/${subOrder.order_number}`}>
                        <RiEyeLine />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default SubOrdersTable;
