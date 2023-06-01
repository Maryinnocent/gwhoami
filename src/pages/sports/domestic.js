import { nanoid } from 'nanoid';
import React, { useRef } from 'react';
import { useContext } from 'react';
import AlertDialog from '../../helper/alertDialog';
import ToastMessage from '../../toast';
import { UserContext } from '../../util/maincontext';
import { formList } from './formLists';
import DomesticForm from './domesticForm';

const DomesticPanel = React.memo(
  ({ domesticAddedList, pageData, ui, uiRefresh }) => {
    const alertRef = useRef();
    const { scrollRef } = useContext(UserContext);
    const addDomestic = () => {
      let idx = domesticAddedList.current.findIndex(
        (rec) => typeof rec.saved !== 'undefined'
      );
      if (idx !== -1) {
        ToastMessage({
          type: 'error',
          message: 'Please save Domestic details!',
          timeout: 1000,
        });
        return;
      }
      domesticAddedList.current.push({ ...formList.domestic, id: nanoid() });
      uiRefresh(Date.now());
      setTimeout(() => scrollRef.current.scrollToBottom(), 200);
    };

    return (
      <div className="w-full">
        <AlertDialog ref={alertRef} title={'Confirm to Delete?'} />
        <div className="flex w-full">
          <div className="w-3/4 justify-center">
            <h1>Domestic Details</h1>
          </div>
          <div className="w-1/4 justify-end">
            <button
              className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-end hover:bg-dodge-b"
              onClick={addDomestic}
            >
              <i className="bx bx-plus mr-1 text-lg"></i> Add Domestic Details
            </button>
          </div>
        </div>
        {domesticAddedList.current.map((item, idx) => (
          <div className="mt-5" key={item.id}>
            <DomesticForm
              form={item}
              ui={ui}
              uiRefresh={uiRefresh}
              alertRef={alertRef}
              pageData={pageData}
              recordIndex={idx}
              domesticAddedList={domesticAddedList}
            />
          </div>
        ))}
      </div>
    );
  }
);

export default DomesticPanel;
