import Btn from "@/elements/buttons/Btn";
import { useTranslation } from "react-i18next";
import { RiDeleteBinLine } from "react-icons/ri";
import CustomModal from "./CustomModal";

const ConfirmDeleteModal = ({ modal, setModal, loading, confirmFunction, setDeleteId }) => {
  const { t } = useTranslation();
  return (
    <>
      <CustomModal modal={modal} setModal={setModal} classes={{ modalClass: "theme-modal-2 delete-modal", modalHeaderClass: "p-0" }}>
        <div className="icon-box">
          <RiDeleteBinLine />
        </div>
        <h5 className="modal-title">{t("DeleteItem")}</h5>
        <p>{t("DeleteItemDescription")}</p>
        <div className="button-box">
          <Btn
            className="btn-md btn-outline fw-bold"
            color="transparent"
            onClick={() => {
              setDeleteId && setDeleteId();
              setModal("");
            }}
          >
            {t("No")}
          </Btn>
          <Btn className="btn-solid" loading={Number(loading)} onClick={confirmFunction}>
            {t("Yes")}
          </Btn>
        </div>
      </CustomModal>
    </>
  );
};

export default ConfirmDeleteModal;
