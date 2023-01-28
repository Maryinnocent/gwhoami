import { nanoid } from "nanoid";
import React, { useRef } from "react";
import { useContext } from "react";
import AlertDialog from "../../helper/alertDialog";
import ToastMessage from "../../toast";
import { UserContext } from "../../util/maincontext";
import { formList } from "./formLists";
import AssetsForm from "./assetsForm";
import MyLocalStorage from "../../util/mylocalStorage";

const AssetsPanel = React.memo(({ assetsAddedList, pageData, ui, uiRefresh }) => {
    const alertRef = useRef();
    const { scrollRef } = useContext(UserContext);
    const addAssets = () => {
        let idx = assetsAddedList.current.findIndex(rec => typeof rec.saved !== 'undefined');
        if (idx !== -1) {
            ToastMessage({ type: 'error', message: 'Please save Assets details!', timeout: 1000 });
            return;
        }
        assetsAddedList.current.push({ ...formList.assets, id: nanoid() });
        uiRefresh(Date.now());
        setTimeout(() => scrollRef.current.scrollToBottom(), 200);
    }

    return (
        <div className="w-full">
            <AlertDialog ref={alertRef} title={"Confirm to Delete?"} />
            <div className="flex w-full">
                <div className="w-3/4 justify-center">
             <h3 className="text-2xl">Assets Details Of {MyLocalStorage.getLoginInfo().firstName} {MyLocalStorage.getLoginInfo().lastName}</h3>
                </div>
                <button
                    className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-center hover:bg-dodge-b"
                    onClick={addAssets}         
                ><i className='bx bx-plus mr-1 text-lg'></i> Add Assets Details</button>
            </div>
            {assetsAddedList.current.map((item, idx) => (
                <div className="mt-5" key={item.id}>
                    <AssetsForm
                        form={item}
                        ui={ui}
                        uiRefresh={uiRefresh}
                        alertRef={alertRef}
                        pageData={pageData}
                        recordIndex={idx}
                        assetsAddedList={assetsAddedList}
                    />
                </div>
            ))}
        </div>
    );
});

export default AssetsPanel;