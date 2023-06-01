import { nanoid } from 'nanoid';
import React, { useRef } from 'react';
import { useContext } from 'react';
import AlertDialog from '../../helper/alertDialog';
import ToastMessage from '../../toast';
import { UserContext } from '../../util/maincontext';
import { formList } from './formLists';
import StocksForm from './stocksForm';
import MyLocalStorage from '../../util/mylocalStorage';

const StocksPanel = React.memo(
  ({ stocksAddedList, pageData, ui, uiRefresh }) => {
    const alertRef = useRef();
    const { scrollRef } = useContext(UserContext);
    const addStocks = () => {
      let idx = stocksAddedList.current.findIndex(
        (rec) => typeof rec.saved !== 'undefined'
      );
      if (idx !== -1) {
        ToastMessage({
          type: 'error',
          message: 'Please save stocks details!',
          timeout: 1000,
        });
        return;
      }
      stocksAddedList.current.push({ ...formList.stocks, id: nanoid() });
      uiRefresh(Date.now());
      setTimeout(() => scrollRef.current.scrollToBottom(), 200);
    };

    return (
      <div className="w-full">
        <AlertDialog ref={alertRef} title={'Confirm to Delete?'} />
        <div className="flex w-full">
          <div className="w-3/4 justify-center">
            <h3 className="text-2xl">
              Stocks of {MyLocalStorage.getLoginInfo().firstName}{' '}
              {MyLocalStorage.getLoginInfo().lastName}
            </h3>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-center hover:bg-dodge-b"
              onClick={addStocks}
            >
              <i className="bx bx-plus mr-1 text-lg"></i> Add Stocks
            </button>
          </div>
        </div>
        {stocksAddedList.current.map((item, idx) => (
          <div className="mt-5" key={item.id}>
            <StocksForm
              form={item}
              ui={ui}
              uiRefresh={uiRefresh}
              alertRef={alertRef}
              pageData={pageData}
              recordIndex={idx}
              stocksAddedList={stocksAddedList}
            />
          </div>
        ))}
      </div>
    );
  }
);

export default StocksPanel;
