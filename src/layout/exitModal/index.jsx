"use client";
import ThemeOptionContext from "@/context/themeOptionsContext";
import { ImagePath, storageURL } from "@/utils/constants";
import Cookies from "js-cookie";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { Button, Modal, ModalBody } from "reactstrap";

const ExitModal = () => {
  const [showModal, setShowModal] = useState(false);
  const { themeOption } = useContext(ThemeOptionContext);

  useEffect(() => {
    const handleMouseOut = (event) => {
      if (event.clientY <= 0) {
        const newsletterOpen = document.querySelector(".auth-modal.show");
        if (!newsletterOpen) {
          openModal();
          window.removeEventListener("mouseout", handleMouseOut);
        }
      }
    };

    const modalShown = Cookies.get("exit");

    if (!modalShown) {
      window.addEventListener("mouseout", handleMouseOut);
    }

    return () => {
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  const openModal = () => {
    setShowModal(true);
    Cookies.set("exit", "true");
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Modal isOpen={showModal} toggle={() => setShowModal(false)} centered className="exit-modal auth-modal modal-md theme-modal-2 fade show">
      <div className="modal-dialog modal-dialog-centered open">
        <ModalBody>
          <div className="d-flex">
            <div className="right-content w-lg-50 w-100">
              <div className="auth-title">
                <h2>{themeOption?.popup?.exit?.title}</h2>
                <h4>{themeOption?.popup?.exit?.sub_title}</h4>
                <h5>{themeOption?.popup?.exit?.description}</h5>
              </div>
            </div>
            {themeOption?.popup?.exit?.image_url && (
              <div className="left-img w-lg-50 d-lg-block d-none" style={{ position: "relative" }}>
                <Image src={storageURL + themeOption.popup.exit.image_url} alt="exit" fill style={{ objectFit: "cover" }} />
              </div>
            )}
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};

export default ExitModal;
