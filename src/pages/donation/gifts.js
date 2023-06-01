import { nanoid } from 'nanoid';
import React, { useRef } from 'react';
import { useContext } from 'react';
import AlertDialog from '../../helper/alertDialog';
import ToastMessage from '../../toast';
import { UserContext } from '../../util/maincontext';
import { formList } from './formLists';
import GiftsForm from './giftsForm';
import MyLocalStorage from '../../util/mylocalStorage';

const GiftsPanel = React.memo(({ giftsAddedList, pageData, ui, uiRefresh }) => {
  const alertRef = useRef();
  const { scrollRef } = useContext(UserContext);
  const addGifts = () => {
    let idx = giftsAddedList.current.findIndex(
      (rec) => typeof rec.saved !== 'undefined'
    );
    if (idx !== -1) {
      ToastMessage({
        type: 'error',
        message: 'Please save Gifts details!',
        timeout: 1000,
      });
      return;
    }
    giftsAddedList.current.push({
      ...formList.gifts,
      id: nanoid(),
    });
    uiRefresh(Date.now());
    setTimeout(() => scrollRef.current.scrollToBottom(), 200);
  };

  return (
    <div className="w-full">
      <AlertDialog ref={alertRef} title={'Confirm to Delete?'} />
      <div className="flex w-full">
        <div className="w-3/4 justify-center">
          <h3 className="text-2xl">
            Gifts of {MyLocalStorage.getLoginInfo().firstName}{' '}
            {MyLocalStorage.getLoginInfo().lastName}
          </h3>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-center hover:bg-dodge-b"
            onClick={addGifts}
          >
            <i className="bx bx-plus mr-1 text-lg"></i> Add Gifts
          </button>
        </div>
      </div>
      {giftsAddedList.current.map((item, idx) => (
        <div className="mt-5" key={item.id}>
          <GiftsForm
            form={item}
            ui={ui}
            uiRefresh={uiRefresh}
            alertRef={alertRef}
            pageData={pageData}
            recordIndex={idx}
            giftsAddedList={giftsAddedList}
          />
        </div>
      ))}
    </div>
  );
});

export default GiftsPanel;
