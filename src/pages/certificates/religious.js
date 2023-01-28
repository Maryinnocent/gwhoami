import { nanoid } from "nanoid";
import React, { useRef } from "react";
import { useContext } from "react";
import AlertDialog from "../../helper/alertDialog";
import ToastMessage from "../../toast";
import { UserContext } from "../../util/maincontext";
import { formList } from "./formLists";
import ReligiousForm from "./religiousForm";

const ReligiousPanel = React.memo(({ religiousAddedList, pageData, ui, uiRefresh }) => {
    const alertRef = useRef();
    const { scrollRef } = useContext(UserContext);
    const addReligious = () => {
        let idx = religiousAddedList.current.findIndex(rec => typeof rec.saved !== 'undefined');
        if (idx !== -1) {
            ToastMessage({ type: 'error', message: 'Please save religious details!', timeout: 1000 });
            return;
        }
        religiousAddedList.current.push({ ...formList.religious, id: nanoid() });
        uiRefresh(Date.now());
        setTimeout(() => scrollRef.current.scrollToBottom(), 200);
    }

    return (
        <div className="w-full">
            <AlertDialog ref={alertRef} title={"Confirm to Delete?"} />
             <div className="flex w-full">
                <div className="w-3/4 justify-center">
                    <h1>Religious Details</h1>
                </div>
                <div className="w-1/4 justify-end">
                <button
                    className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-end hover:bg-dodge-b"
                    onClick={addReligious}
                ><i className='bx bx-plus mr-1 text-lg'></i> Add Religious Details</button>
                </div>
            </div>
            {religiousAddedList.current.map((item, idx) => (
                <div className="mt-5" key={item.id}>
                    <ReligiousForm
                        form={item}
                        ui={ui}
                        uiRefresh={uiRefresh}
                        alertRef={alertRef}
                        pageData={pageData}
                        recordIndex={idx}
                        religiousAddedList={religiousAddedList}
                    />
                </div>
            ))}
        </div>
    );
});

export default ReligiousPanel;