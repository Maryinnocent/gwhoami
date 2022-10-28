import { nanoid } from "nanoid";
import React, { useRef } from "react";
import { useContext } from "react";
import AlertDialog from "../../helper/alertDialog";
import ToastMessage from "../../toast";
import { UserContext } from "../../util/maincontext";
import { formList } from "./formLists";
import CollegeForm from "./collegeForm";

const CollegePanel = React.memo(({ collegeAddedList, pageData, ui, uiRefresh, collegeMenus }) => {
    const alertRef = useRef();
    const { scrollRef } = useContext(UserContext);
    const addCollege = () => {
        let idx = collegeAddedList.current.findIndex(rec => typeof rec.saved !== 'undefined');
        if (idx !== -1) {
            ToastMessage({ type: 'error', message: 'Please save the college!', timeout: 1000 });
            return;
        }
        collegeAddedList.current.push({ ...formList.college, id: nanoid() });
        uiRefresh(Date.now());
        setTimeout(() => scrollRef.current.scrollToBottom(), 200);
    }

    return (
        <div className="w-full">
            <AlertDialog ref={alertRef} title={"Confirm to Delete?"} />
            <div className="flex justify-end">
                <button
                    className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-center hover:bg-dodge-b"
                    onClick={addCollege}
                ><i className='bx bx-plus mr-1 text-lg'></i> Add College</button>
            </div>
            {collegeAddedList.current.map((item, idx) => (
                <div className="mt-5" key={item.id}>
                    <CollegeForm
                        form={item}
                        ui={ui}
                        uiRefresh={uiRefresh}
                        collegeMenus={collegeMenus}
                        alertRef={alertRef}
                        pageData={pageData}
                        recordIndex={idx}
                        collegeAddedList={collegeAddedList}
                    />
                </div>
            ))}
        </div>
    );
});

export default CollegePanel;