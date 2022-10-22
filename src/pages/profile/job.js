import { nanoid } from "nanoid";
import React, { useRef } from "react";
import { useContext } from "react";
import AlertDialog from "../../helper/alertDialog";
import ToastMessage from "../../toast";
import { UserContext } from "../../util/maincontext";
import { formList } from "./formLists";
import JobForm from "./jobForm";

const JobPanel = React.memo(({ jobAddedList, pageData, ui, uiRefresh }) => {
    const alertRef = useRef();
    const { scrollRef } = useContext(UserContext);
    const addJob = () => {
        let idx = jobAddedList.current.findIndex(rec => typeof rec.saved !== 'undefined');
        if (idx !== -1) {
            ToastMessage({ type: 'error', message: 'Please save job details!', timeout: 1000 });
            return;
        }
        jobAddedList.current.push({ ...formList.job, id: nanoid() });
        uiRefresh(Date.now());
        setTimeout(() => scrollRef.current.scrollToBottom(), 200);
    }

    return (
        <div className="w-full">
            <AlertDialog ref={alertRef} title={"Confirm to Delete?"} />
            <div className="flex justify-end">
                <button
                    className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-center hover:bg-dodge-b"
                    onClick={addJob}
                ><i className='bx bx-plus mr-1 text-lg'></i> Add Job</button>
            </div>
            {jobAddedList.current.map((item, idx) => (
                <div className="mt-5" key={item.id}>
                    <JobForm
                        form={item}
                        ui={ui}
                        uiRefresh={uiRefresh}
                        alertRef={alertRef}
                        pageData={pageData}
                        recordIndex={idx}
                        jobAddedList={jobAddedList}
                    />
                </div>
            ))}
        </div>
    );
});

export default JobPanel;