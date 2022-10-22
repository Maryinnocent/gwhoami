import { nanoid } from "nanoid";
import React, { useRef } from "react";
import { useContext } from "react";
import AlertDialog from "../../helper/alertDialog";
import ToastMessage from "../../toast";
import { UserContext } from "../../util/maincontext";
import { formList } from "./formLists";
import BusinessForm from "./businessForm";

const BusinessPanel = React.memo(({ businessAddedList, pageData, ui, uiRefresh }) => {
    const alertRef = useRef();
    const { scrollRef } = useContext(UserContext);
    const addBusiness = () => {
        let idx = businessAddedList.current.findIndex(rec => typeof rec.saved !== 'undefined');
        if (idx !== -1) {
            ToastMessage({ type: 'error', message: 'Please save business details!', timeout: 1000 });
            return;
        }
        businessAddedList.current.push({ ...formList.business, id: nanoid() });
        uiRefresh(Date.now());
        setTimeout(() => scrollRef.current.scrollToBottom(), 200);
    }

    return (
        <div className="w-full">
            <AlertDialog ref={alertRef} title={"Confirm to Delete?"} />
            <div className="flex justify-end">
                <button
                    className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-center hover:bg-dodge-b"
                    onClick={addBusiness}
                ><i className='bx bx-plus mr-1 text-lg'></i> Add Business</button>
            </div>
            {businessAddedList.current.map((item, idx) => (
                <div className="mt-5" key={item.id}>
                    <BusinessForm
                        form={item}
                        ui={ui}
                        uiRefresh={uiRefresh}
                        alertRef={alertRef}
                        pageData={pageData}
                        recordIndex={idx}
                        businessAddedList={businessAddedList}
                    />
                </div>
            ))}
        </div>
    );
});

export default BusinessPanel;