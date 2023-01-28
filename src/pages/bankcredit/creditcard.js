import { nanoid } from "nanoid";
import React, { useRef } from "react";
import { useContext } from "react";
import AlertDialog from "../../helper/alertDialog";
import ToastMessage from "../../toast";
import { UserContext } from "../../util/maincontext";
import { formList } from "./formLists";
import CreditcardForm from "./creditcardForm";

const CreditcardPanel = React.memo(({ creditcardAddedList, pageData, ui, uiRefresh }) => {
    const alertRef = useRef();
    const { scrollRef } = useContext(UserContext);
    const addCreditcard = () => {
        let idx = creditcardAddedList.current.findIndex(rec => typeof rec.saved !== 'undefined');
        if (idx !== -1) {
            ToastMessage({ type: 'error', message: 'Please save Credit Card details!', timeout: 1000 });
            return;
        }
        creditcardAddedList.current.push({ ...formList.creditcard, id: nanoid() });
        uiRefresh(Date.now());
        setTimeout(() => scrollRef.current.scrollToBottom(), 200);
    }

    return (
        <div className="w-full">
            <AlertDialog ref={alertRef} title={"Confirm to Delete?"} />
             <div className="flex justify-end">
             <div className="w-3/4 justify-center">
                    <h1>Bank Credit Card Details</h1>
                </div>
                <button
                    className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-center hover:bg-dodge-b"
                    onClick={addCreditcard}         
                ><i className='bx bx-plus mr-1 text-lg'></i> Add Bank Credit Card Details</button>
            </div>
            {creditcardAddedList.current.map((item, idx) => (
                <div className="mt-5" key={item.id}>
                    <CreditcardForm
                        form={item}
                        ui={ui}
                        uiRefresh={uiRefresh}
                        alertRef={alertRef}
                        pageData={pageData}
                        recordIndex={idx}
                        creditcardAddedList={creditcardAddedList}
                    />
                </div>
            ))}
        </div>
    );
});

export default CreditcardPanel;