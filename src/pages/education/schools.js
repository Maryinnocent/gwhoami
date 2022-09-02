import { nanoid } from "nanoid";
import React, { useRef } from "react";
import { useContext } from "react";
import AlertDialog from "../../helper/alertDialog";
import ToastMessage from "../../toast";
import { UserContext } from "../../util/maincontext";
import { formList } from "./formLists";
import SchoolForm from "./schoolForm";

const SchoolPanel = React.memo(({schoolAddedList, pageData, ui, uiRefresh, schoolMenus}) => {
    const alertRef = useRef();
    const {scrollRef} = useContext(UserContext);
    const addSchool = () => {
        let idx = schoolAddedList.current.findIndex(rec=>typeof rec.saved !== 'undefined');
        if (idx !== -1) {
            ToastMessage({type: 'error', message: 'Please save the school!', timeout: 1000});
            return;
        }
        schoolAddedList.current.push({...formList.school, id: nanoid()});
        uiRefresh(Date.now());
        setTimeout(()=>scrollRef.current.scrollToBottom(), 200);
    }
    
    return (
        <div className="w-full">
            <AlertDialog ref={alertRef} title={"Confirm to Delete?"}/>
            <div className="flex justify-end">
                <button 
                    className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-center hover:bg-dodge-b"
                    onClick={addSchool}
                ><i className='bx bx-plus mr-1 text-lg'></i> Add School</button>
            </div>
            {schoolAddedList.current.map((item, idx)=>(
            <div className="mt-5" key={item.id}>
                <SchoolForm 
                    form={item} 
                    ui={ui} 
                    uiRefresh={uiRefresh} 
                    schoolMenus={schoolMenus} 
                    alertRef={alertRef} 
                    pageData={pageData} 
                    recordIndex={idx}
                    schoolAddedList={schoolAddedList}
                />
            </div>
            ))}
        </div>
    );
});

export default SchoolPanel;