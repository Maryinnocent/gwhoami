import { nanoid } from "nanoid";
import React, { useRef } from "react";
import { useContext } from "react";
import AlertDialog from "../../helper/alertDialog";
import ToastMessage from "../../toast";
import { UserContext } from "../../util/maincontext";
import { formList } from "./formLists";
import SexualForm from "./sexualForm";
import MyLocalStorage from "../../util/mylocalStorage";

const SexualPanel = React.memo(({ sexualAddedList, pageData, ui, uiRefresh }) => {
    const alertRef = useRef();
    const { scrollRef } = useContext(UserContext);
    const addSexual = () => {
        let idx = sexualAddedList.current.findIndex(rec => typeof rec.saved !== 'undefined');
        if (idx !== -1) {
            ToastMessage({ type: 'error', message: 'Please save Sexual Crime details!', timeout: 1000 });
            return;
        }
        sexualAddedList.current.push({ ...formList.sexual, id: nanoid() });
        uiRefresh(Date.now());
        setTimeout(() => scrollRef.current.scrollToBottom(), 200);
    }

    return (
        <div className="w-full">
            <AlertDialog ref={alertRef} title={"Confirm to Delete?"} />
             <div className="flex w-full">
                <div className="w-3/4 justify-center">
                <h3 className="text-2xl">Sexual Crime Details Of {MyLocalStorage.getLoginInfo().firstName} {MyLocalStorage.getLoginInfo().lastName}</h3>
                </div>
                <div className="w-1/4 justify-end">
                <button
                    className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-end hover:bg-dodge-b"
                    onClick={addSexual}
                ><i className='bx bx-plus mr-1 text-lg'></i> Add Sexual Crime Details</button>
                </div>
            </div>
            {sexualAddedList.current.map((item, idx) => (
                <div className="mt-5" key={item.id}>
                    <SexualForm
                        form={item}
                        ui={ui}
                        uiRefresh={uiRefresh}
                        alertRef={alertRef}
                        pageData={pageData}
                        recordIndex={idx}
                        sexualAddedList={sexualAddedList}
                    />
                </div>
            ))}
        </div>
    );
});

export default SexualPanel;