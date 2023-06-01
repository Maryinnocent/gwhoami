import { nanoid } from 'nanoid';
import React, { useRef } from 'react';
import { useContext } from 'react';
import AlertDialog from '../../helper/alertDialog';
import ToastMessage from '../../toast';
import { UserContext } from '../../util/maincontext';
import { formList } from './formLists';
import FamilyForm from './familyForm.js';
import MyLocalStorage from '../../util/mylocalStorage';

const FamilyPanel = React.memo(
  ({ familyAddedList, pageData, ui, uiRefresh }) => {
    const alertRef = useRef();
    const { scrollRef } = useContext(UserContext);
    const addFamily = () => {
      let idx = familyAddedList.current.findIndex(
        (rec) => typeof rec.saved !== 'undefined'
      );
      if (idx !== -1) {
        ToastMessage({
          type: 'error',
          message: 'Please save family details!',
          timeout: 1000,
        });
        return;
      }
      familyAddedList.current.push({ ...formList.family, id: nanoid() });
      uiRefresh(Date.now());
      setTimeout(() => scrollRef.current.scrollToBottom(), 200);
    };

    return (
      <div className="w-full">
        <AlertDialog ref={alertRef} title={'Confirm to Delete?'} />
        <div className="flex w-full">
          <div className="w-3/4 justify-center">
            <h3 className="text-2xl">
              family Details Of {MyLocalStorage.getLoginInfo().firstName}{' '}
              {MyLocalStorage.getLoginInfo().lastName}
            </h3>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-center hover:bg-dodge-b"
              onClick={addFamily}
            >
              <i className="bx bx-plus mr-1 text-lg"></i> Add family
            </button>
          </div>
        </div>
        {familyAddedList.current.map((item, idx) => (
          <div className="mt-5" key={item.id}>
            <FamilyForm
              form={item}
              ui={ui}
              uiRefresh={uiRefresh}
              alertRef={alertRef}
              pageData={pageData}
              recordIndex={idx}
              familyAddedList={familyAddedList}
            />
          </div>
        ))}
      </div>
    );
  }
);

export default FamilyPanel;
