import React, { useRef, useState } from "react";
import { useEffect } from "react";
import Tabs from 'react-responsive-tabs';
import { useParams } from "react-router-dom";
import { Spinner } from "../../component/forms";
import { apiPostCall } from "../../helper/API";
import ToastMessage from "../../toast";
import MyLocalStorage from "../../util/mylocalStorage";
import { formList } from "./formLists";
import SchoolPanel from "./schools";
import CollegePanel from "./colleges";

const EducationTabs = React.memo(() => {
    const [ui, uiRefresh] = useState(-1);
    const pageData = useRef({ init: false, _id: '' });
    const schoolAddedList = useRef([]);
    const collegeAddedList = useRef([]);
    const schoolMenus = useRef([]);
    const collegeMenus = useRef([]);
    const { tabid } = useParams();
    useEffect(() => {
        (async () => {
            let search = [{ _modal: 'EductionList', _find: { userid: MyLocalStorage.getUserId() }, _mode: 'single', _select: 'schools colleges others' }];
            const res = await apiPostCall('/api/common/common_search', { _list: search });
            if (res.isError) {
                ToastMessage({ type: "error", message: res.Error.response.data.message, timeout: 2000 });
                return;
            } else {
                if (res && res.length === 0) {
                    const newrecord = await apiPostCall('/api/common/common_mutiple_insert', { _list: [{ _modal: 'EductionList', _condition: 'new', _data: { userid: MyLocalStorage.getUserId(), schools: [], colleges: [], others: [] } }] });
                    pageData.current._id = newrecord.upsertedId;
                    schoolMenus.current = [...formList.schoolMenu];
                } else {
                    pageData.current._id = res._id;
                    schoolAddedList.current = res.schools || [];
                    collegeAddedList.current = res.colleges || [];
                    let sm = [...formList.schoolMenu];
                    schoolAddedList.current.map(s => s.classes.map(c => c.standard)).map(arr => arr.forEach(itm => {
                        sm.splice(sm.indexOf(itm), 1);
                    }));
                    schoolMenus.current = [...sm];
                    let cm = [...formList.collegeMenu];
                    collegeAddedList.current.map(s => s.majors.map(c => c.major)).map(arr => arr.forEach(itm => {
                        cm.splice(cm.indexOf(itm), 1);
                    }));
                    collegeMenus.current = [...cm];
                }
                pageData.current.init = true;
                uiRefresh(Date.now());
            }
        })();
        return () => null;
    }, []);
    if (!pageData.current.init) return <div className="flex w-full h-full justify-center items-center"><Spinner size="60" /></div>
    else return (
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
                        getContent: () => {
                            return <SchoolPanel schoolAddedList={schoolAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} schoolMenus={schoolMenus} />
                        }
                    }, {
                        title: 'College',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () => {
                            return <CollegePanel collegeAddedList={collegeAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} collegeMenus={collegeMenus} />
                        }
                    }, {
                        title: 'Others',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () => (
                            <h1>Others</h1>
                        )
                    }]} />
            </div>
        </div>
    );
});

export default EducationTabs;
