import { nanoid } from "nanoid";
import React, { useRef } from "react";
import { useContext } from "react";
import AlertDialog from "../../helper/alertDialog";
import ToastMessage from "../../toast";
import { UserContext } from "../../util/maincontext";
import { formList } from "./formLists";
import SchoolcollegeForm from "./schoolcollegeForm";
import MyLocalStorage from "../../util/mylocalStorage";

const SchoolcollegePanel = React.memo(({ schoolcollegeAddedList, pageData, ui, uiRefresh }) => {
    const alertRef = useRef();
    const { scrollRef } = useContext(UserContext);
    const addSchoolcollege = () => {
        let idx = schoolcollegeAddedList.current.findIndex(rec => typeof rec.saved !== 'undefined');
        if (idx !== -1) {
            ToastMessage({ type: 'error', message: 'Please save Schoolcollege details!', timeout: 1000 });
            return;
        }
        schoolcollegeAddedList.current.push({ ...formList.schoolcollege, id: nanoid() });
        uiRefresh(Date.now());
        setTimeout(() => scrollRef.current.scrollToBottom(), 200);
    }

    return (
        <div className="w-full">
            <AlertDialog ref={alertRef} title={"Confirm to Delete?"} />
             <div className="flex w-full">
                <div className="w-3/4 justify-center">
                    <h3 className="text-2xl">Education Crime Details of {MyLocalStorage.getLoginInfo().firstName} {MyLocalStorage.getLoginInfo().lastName}</h3>
                </div>
                <div className="w-1/4 justify-end">
                <button
                    className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-end hover:bg-dodge-b"
                    onClick={addSchoolcollege}
                ><i className='bx bx-plus mr-1 text-lg'></i> Add Education crimes</button>
              </div> 
            </div>
            {schoolcollegeAddedList.current.map((item, idx) => (
                <div className="mt-5" key={item.id}>
                    <SchoolcollegeForm
                        form={item}
                        ui={ui}
                        uiRefresh={uiRefresh}
                        alertRef={alertRef}
                        pageData={pageData}
                        recordIndex={idx}
                        schoolcollegeAddedList={schoolcollegeAddedList}
                    />
                </div>
            ))}
        </div>
    );
});

export default SchoolcollegePanel;