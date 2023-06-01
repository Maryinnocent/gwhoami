import { nanoid } from 'nanoid';
import React, { useRef } from 'react';
import { useContext } from 'react';
import AlertDialog from '../../helper/alertDialog';
import ToastMessage from '../../toast';
import { UserContext } from '../../util/maincontext';
import { formList } from './formLists';
import AwardsForm from './awardsForm';

const AwardsPanel = React.memo(
  ({ awardsAddedList, pageData, ui, uiRefresh }) => {
    const alertRef = useRef();
    const { scrollRef } = useContext(UserContext);
    const addAwards = () => {
      let idx = awardsAddedList.current.findIndex(
        (rec) => typeof rec.saved !== 'undefined'
      );
      if (idx !== -1) {
        ToastMessage({
          type: 'error',
          message: 'Please save Awards details!',
          timeout: 1000,
        });
        return;
      }
      awardsAddedList.current.push({ ...formList.awards, id: nanoid() });
      uiRefresh(Date.now());
      setTimeout(() => scrollRef.current.scrollToBottom(), 200);
    };

    return (
      <div className="w-full">
        <AlertDialog ref={alertRef} title={'Confirm to Delete?'} />
        <div className="flex justify-end">
          <div className="w-3/4 justify-center">
            <h1>Sports Awards Details</h1>
          </div>
          <button
            className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-center hover:bg-dodge-b"
            onClick={addAwards}
          >
            <i className="bx bx-plus mr-1 text-lg"></i> Add Sports Awards
            Details
          </button>
        </div>
        {awardsAddedList.current.map((item, idx) => (
          <div className="mt-5" key={item.id}>
            <AwardsForm
              form={item}
              ui={ui}
              uiRefresh={uiRefresh}
              alertRef={alertRef}
              pageData={pageData}
              recordIndex={idx}
              awardsAddedList={awardsAddedList}
            />
          </div>
        ))}
      </div>
    );
  }
);

export default AwardsPanel;
