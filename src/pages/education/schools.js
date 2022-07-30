import React, { } from "react";
import { formList } from "./formLists";
import SchoolForm from "./schoolForm";



const SchoolPanel = React.memo(({schoolAddedList, ui, uiRefresh}) => {
    
    const addSchool = () => {
        schoolAddedList.current.push({...formList.school});
        uiRefresh(Date.now());
    }
    
    return (
        <div className="w-full">
            <div className="flex justify-end">
                <button 
                    className="bg-dodge-d px-3 py-1.5 text-white text-sm shadow-md flex items-center hover:bg-dodge-b"
                    onClick={addSchool}
                ><i className='bx bx-plus mr-1 text-lg'></i> Add School</button>
            </div>
            {schoolAddedList.current.map((item, idx)=>(
            <div className="mt-5" key={item.id}>
                <SchoolForm form={item} ui={ui} uiRefresh={uiRefresh}/>
            </div>
            ))}
        </div>
    );
});

export default SchoolPanel;