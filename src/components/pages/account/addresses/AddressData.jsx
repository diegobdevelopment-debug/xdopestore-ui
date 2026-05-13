import ConfirmDeleteModal from "@/components/widgets/ConfirmDeleteModal";
import AccountContext from "@/context/accountContext";
import Btn from "@/elements/buttons/Btn";
import request from "@/utils/axiosUtils";
import { AddressAPI } from "@/utils/axiosUtils/API";
import useDelete from "@/utils/hooks/useDelete";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "reactstrap";
import AddressTable from "./AddressTable";

const AddressData = ({ addressState, setAddressState, modal, setModal, setEditAddress }) => {
  const [deleteId, setDeleteId] = useState("");
  const { refetch } = useContext(AccountContext);
  const { data, mutate, isLoading } = useDelete(AddressAPI, false);
  const { t } = useTranslation("common");

  const removeAddress = () => {
    setModal(false);
    mutate(deleteId);
  };

  const handleSetDefault = async (addressId) => {
    if (!addressId) return;
    try {
      const res = await request({ url: `${AddressAPI}/${addressId}/default`, method: "patch" });
      if (res?.ok) {
        setAddressState((prev) =>
          prev.map((a) => ({ ...a, is_default: (a?.id || a?._id) === (res?.data?.id || res?.data?._id || addressId) }))
        );
        refetch && refetch();
      }
    } catch (e) {
      console.error("[AddressData] set default failed", e);
    }
  };

  useEffect(() => {
    if (data?.status) {
      setAddressState((prev) => prev.filter((elem) => elem.id !== deleteId));
      refetch();
      setModal("");
    }
  }, [data]);

  return (
    <Row className="g-4">
      {addressState?.map((address, i) => {
        const id = address?.id || address?._id;
        return (
          <Col xl={4} md={6} key={id || i}>
            <div className="select-box">
              <div className="address-box">
                <AddressTable address={address} />
                <div className="bottom">
                  <Btn
                    color="transparent"
                    className="bottom_btn"
                    onClick={() => {
                      setEditAddress(address);
                      setModal("edit");
                    }}
                  >
                    {t("Edit")}
                  </Btn>
                  {!address?.is_default && (
                    <Btn
                      color="transparent"
                      className="bottom_btn"
                      onClick={() => handleSetDefault(id)}
                    >
                      {t("SetAsDefault") || "Set as Default"}
                    </Btn>
                  )}
                  <Btn
                    color="transparent"
                    className="bottom_btn"
                    onClick={() => {
                      setDeleteId(id);
                      setModal("remove");
                    }}
                  >
                    {t("Remove")}
                  </Btn>
                </div>
              </div>
            </div>
          </Col>
        );
      })}
      <ConfirmDeleteModal modal={modal == "remove"} setModal={setModal} loading={isLoading} confirmFunction={removeAddress} setDeleteId={setDeleteId} />
    </Row>
  );
};

export default AddressData;
