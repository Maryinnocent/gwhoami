import { nanoid } from 'nanoid';
import React, { useRef } from 'react';
import { useContext } from 'react';
import AlertDialog from '../../helper/alertDialog';
import ToastMessage from '../../toast';
import { UserContext } from '../../util/maincontext';
import { formList } from './formLists';
import LeagueForm from './leagueForm';

const LeaguePanel = React.memo(
  ({ leagueAddedList, pageData, ui, uiRefresh }) => {
    const alertRef = useRef();
    const { scrollRef } = useContext(UserContext);
    const addLeague = () => {
      let idx = leagueAddedList.current.findIndex(
        (rec) => typeof rec.saved !== 'undefined'
      );
      if (idx !== -1) {
        ToastMessage({
          type: 'error',
          message: 'Please save League details!',
          timeout: 1000,
        });
        return;
      }
      leagueAddedList.current.push({ ...formList.league, id: nanoid() });
      uiRefresh(Date.now());
      setTimeout(() => scrollRef.current.scrollToBottom(), 200);
    };

    return (
      <div className="w-full">
        <AlertDialog ref={alertRef} title={'Confirm to Delete?'} />
        <div className="flex justify-end">
          <div className="w-3/4 justify-center">
            <h1>league Details</h1>
          </div>
          <button
            className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-center hover:bg-dodge-b"
            onClick={addLeague}
          >
            <i className="bx bx-plus mr-1 text-lg"></i> Add League Details
          </button>
        </div>
        {leagueAddedList.current.map((item, idx) => (
          <div className="mt-5" key={item.id}>
            <LeagueForm
              form={item}
              ui={ui}
              uiRefresh={uiRefresh}
              alertRef={alertRef}
              pageData={pageData}
              recordIndex={idx}
              leagueAddedList={leagueAddedList}
            />
          </div>
        ))}
      </div>
    );
  }
);

export default LeaguePanel;
