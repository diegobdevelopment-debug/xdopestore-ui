import React, { useEffect } from 'react';
import { Row } from 'reactstrap';
import { RiAddLine, RiMapPinLine } from 'react-icons/ri';
import { useTranslation } from "react-i18next";
import CheckoutCard from './common/CheckoutCard';
import AddAddressForm from './common/AddAddressForm';
import ShowAddress from './ShowAddress';
import CustomModal from '@/components/widgets/CustomModal';

const DeliveryAddress = ({ type, title, address, modal, mutate, isLoading, setModal, setFieldValue, values }) => {
  const { t } = useTranslation('common');

  // Pre-select the user's default address (the API sorts is_default first, so it's
  // typically address[0], but we explicitly look for is_default to be safe).
  useEffect(() => {
    if (!address?.length) return;
    const currentSelection = values?.[`${type}_address_id`];
    if (currentSelection) return; // user already picked something — respect it
    const preferred = address.find((a) => a?.is_default) || address[0];
    if (preferred?.id || preferred?._id) {
      setFieldValue(`${type}_address_id`, preferred.id || preferred._id);
    }
  }, [address, type]);

  return (
    <>
      <CheckoutCard icon={<RiMapPinLine />}>
        <div className='checkout-title'>
          <h4>
            {t(title)} {t('Address')}
          </h4>
          <a className='d-flex align-items-center fw-bold' onClick={() => setModal(type)}>
            <RiAddLine className='me-1'></RiAddLine>
            {t('AddNew')}
          </a>
        </div>
        <div className='checkout-detail'>
          {
            <>
              {address?.length > 0 ? (
                <Row className='g-4'>
                  {address?.map((item, i) => (
                    <ShowAddress item={item} key={item?.id || item?._id || i} type={type} index={i} />
                  ))}
                </Row>
              ) : (
                <div className='empty-box'>
                  <h2>{t('NoaddressFound')}</h2>
                </div>
              )}
            </>
          }
          <CustomModal modal={modal == type ? true : false} setModal={setModal} classes={{ modalClass: 'theme-modal-2 address-modal address-modal-2', title: "AddAddress", }}>
            <div className='right-sidebar-box'>
              <AddAddressForm mutate={mutate} isLoading={isLoading} setModal={setModal} type={type} />
            </div>
          </CustomModal>
        </div>
      </CheckoutCard>
    </>
  );
};

export default DeliveryAddress;
