import CustomModal from "@/components/widgets/CustomModal";
import SimpleInputField from "@/components/widgets/inputFields/SimpleInputField";
import { placeHolderImage } from "@/components/widgets/Placeholder";
import SettingContext from "@/context/settingContext";
import ThemeOptionContext from "@/context/themeOptionsContext";
import Btn from "@/elements/buttons/Btn";
import useCreate from "@/utils/hooks/useCreate";
import { QuestionAnswerAPI } from "@/utils/axiosUtils/API";
import { Form, Formik } from "formik";
import Cookies from "js-cookie";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiCloseLine } from "react-icons/ri";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const QuestionAnswerModal = ({ modal, setModal, productState, update, refetch }) => {
  const { t } = useTranslation("common");
  const [message, setShowBoxMessage] = useState();
  const { convertCurrency } = useContext(SettingContext);
  const { setOpenAuthModal } = useContext(ThemeOptionContext);
  const isAuth = Cookies.get("uat");
  const isAdding = update?.editData === "Add";
  const toggle = () => {
    setModal((prev) => prev !== prev);
  };

  const { mutate: createQnA, isPending: createLoader } = useCreate(
    QuestionAnswerAPI,
    false,
    false,
    "Question Posted Successfully",
    (resData) => {
      if (resData?.status === 200 || resData?.status === 201) {
        refetch && refetch();
        setModal(false);
      } else if (resData?.data?.message) {
        setShowBoxMessage(resData?.data?.message);
      }
    },
    false,
    undefined,
    undefined,
    setShowBoxMessage
  );

  useEffect(() => {
    if (message == "Unauthenticated" && !isAuth) {
      setOpenAuthModal(true);
      setModal(false);
    }
    return () => setShowBoxMessage();
  }, [message, isAuth]);

  return (
    <CustomModal modal={modal ? true : false} setModal={setModal} classes={{ modalClass: "theme-modal-2 question-answer-modal", modalHeaderClass: "p-0", customChildren: true }}>
      <ModalHeader className="border-color" toggle={toggle}>
        {t("Askaquestions")}
        <Btn className="btn-close" onClick={() => setModal(false)}>
          <RiCloseLine />
        </Btn>
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={{
            question: update?.editData && update?.editData !== "Add" ? update?.editData?.question : "",
            product_id: productState?.product?.id,
          }}
          onSubmit={(values) => {
            if (!isAuth) {
              setOpenAuthModal(true);
              setModal(false);
              return;
            }
            const payload = { question: values.question, product_id: values.product_id };
            if (isAdding) {
              createQnA(payload);
            } else if (update?.updateQnA) {
              update.updateQnA(payload);
            } else {
              setModal(false);
            }
          }}
        >
          {() => (
            <Form>
              <div className="product-review-form">
                <div className="product-wrapper">
                  <div className="product-image">{productState?.product.product_thumbnail && <Image src={productState?.product.product_thumbnail ? productState?.product.product_thumbnail.original_url : placeHolderImage} className="img-fluid" height={80} width={80} alt={productState?.product?.name} />}</div>
                  <div className="product-content">
                    <h5 className="name">{productState?.product?.name}</h5>
                    <div className="product-review-rating">
                      <div className="product-rating">
                        <h6 className="price-number">{convertCurrency(productState?.product?.sale_price)}</h6>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="review-box form-box">
                  <SimpleInputField nameList={[{ name: "question", type: "textarea", placeholder: t("EnterYourQuestions"), rows: "3", toplabel: "YourQuestions", require: "true", colprops: { xs: 12 } }]} />
                </div>
              </div>
              <ModalFooter className="p-0">
                <Btn title="Cancel" type="button" className="btn btn-outline" onClick={() => setModal(false)} />
                <Btn title="Submit" className="btn-solid" type="submit" loading={createLoader || update?.updateLoader} />
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalBody>
    </CustomModal>
  );
};

export default QuestionAnswerModal;
