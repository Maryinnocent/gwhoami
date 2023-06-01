import { nanoid } from "nanoid";
import React, { useRef } from "react";
import { useContext } from "react";
import AlertDialog from "../../helper/alertDialog";
import ToastMessage from "../../toast";
import { UserContext } from "../../util/maincontext";
import { formList } from "./formLists";
import PolicecaseForm from "./policecaseForm";
import MyLocalStorage from "../../util/mylocalStorage";

const PolicecasePanel = React.memo(({ policecaseAddedList, pageData, ui, uiRefresh }) => {
    const alertRef = useRef();
    const { scrollRef } = useContext(UserContext);
    const addPolicecase = () => {
        let idx = policecaseAddedList.current.findIndex(rec => typeof rec.saved !== 'undefined');
        if (idx !== -1) {
            ToastMessage({ type: 'error', message: 'Please save New born Medical details!', timeout: 1000 });
            return;
        }
        policecaseAddedList.current.push({ ...formList.policecase, id: nanoid() });
        uiRefresh(Date.now());
        setTimeout(() => scrollRef.current.scrollToBottom(), 200);
    }

    return (
        <div className="w-full">
            <AlertDialog ref={alertRef} title={"Confirm to Delete?"} />
             <div className="flex w-full">
                <div className="w-3/4 justify-center">
                    <h3 className="text-2xl">Policecase Details of {MyLocalStorage.getLoginInfo().firstName} {MyLocalStorage.getLoginInfo().lastName}</h3>
                </div>
                <div className="w-1/4 justify-end">
                <button
                    className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-end hover:bg-dodge-b"
                    onClick={addPolicecase}
                ><i className='bx bx-plus mr-1 text-lg'></i> Add Policecase details</button>
                </div>
            </div>
            {policecaseAddedList.current.map((item, idx) => (
                <div className="mt-5" key={item.id}>
                    <PolicecaseForm
                        form={item}
                        ui={ui}
                        uiRefresh={uiRefresh}
                        alertRef={alertRef}
                        pageData={pageData}
                        recordIndex={idx}
                        policecaseAddedList={policecaseAddedList}
                    />
                </div>
            ))}
        </div>
    );
});

export default PolicecasePanel;