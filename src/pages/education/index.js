import React, { useRef, useState } from "react";
import Tabs from 'react-responsive-tabs';
import { useParams } from "react-router-dom";
import SchoolPanel from "./schools";

const EducationTabs = React.memo(() => {
    const [ui, uiRefresh] = useState(-1);
    const schoolAddedList = useRef([]);
    const {tabid} = useParams();
    return (
        <div className="flex px-6 w-full container justify-center mx-auto pb-5">
            <div className="sm:w-full md:w-full xl:w-3/5 mt-20">
                <Tabs 
                    selectedTabKey={tabid === 'school' ? 0 : tabid === 'college' ? 1 : tabid === 'other' ? 2 : 0}
                    transformWidth={600}
                    tabClassName="bg-red-100"
                items={[{
                    title: 'School',
                    tabClassName: 'customtab',
                    panelClassName: 'custompanel',
                    getContent: ()=>{
                        return <SchoolPanel schoolAddedList={schoolAddedList} ui={ui} uiRefresh={uiRefresh}/>
                    }
                },{
                    title: 'College',
                    tabClassName: 'customtab',
                    panelClassName: 'custompanel',
                    getContent: () =>(
                        <h1>College</h1>
                    )
                },{
                    title: 'Others',
                    tabClassName: 'customtab',
                    panelClassName: 'custompanel',
                    getContent: () =>(
                        <h1>Others</h1>
                    )
                }]}/>
            </div>
        </div>
    );
});

export default EducationTabs;
