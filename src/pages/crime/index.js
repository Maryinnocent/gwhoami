import React, { useRef, useState } from "react";
import { useEffect } from "react";
import Tabs from 'react-responsive-tabs';
import { useParams } from "react-router-dom";
import { Spinner } from "../../component/forms";
import { apiPostCall } from "../../helper/API";
import ToastMessage from "../../toast";
import MyLocalStorage from "../../util/mylocalStorage";
import DrivingPanel from "./driving";
import PolicecasePanel from "./policecase";
import ChurchPanel from "./church";
import SchoolcollegePanel from "./schoolcollege";
import SportsPanel from "./sports";
import FinancePanel from "./finance";
import SexualPanel from "./sexual";

import { formList } from "./formLists";

const CrimeTabs = React.memo(() => {
    const [ui, uiRefresh] = useState(-1);
    const pageData = useRef({ init: false, _id: '' });
    const drivingAddedList = useRef([]);
    const policecaseAddedList = useRef([]);
    const churchAddedList = useRef([]);
    const schoolcollegeAddedList = useRef([]);
    const sportsAddedList = useRef([]);
    const financeAddedList = useRef([]);
    const sexualAddedList = useRef([]);
    
    const { tabid } = useParams();
    
    useEffect(() => {
        (async () => {
            let search = [{ _modal: 'CrimeList', _find: { userid: MyLocalStorage.getUserId() }, _mode: 'single', _select: 'driving policecase church schoolcollege sports finance sexual' }];
            const res = await apiPostCall('/api/common/common_search', { _list: search });
            if (res.isError) {
                ToastMessage({ type: "error", message: res.Error.response.data.message, timeout: 2000 });
                return;
            } else {
                if (res && res.length === 0) {
                    const newrecord = await apiPostCall('/api/common/common_mutiple_insert', { _list: [{ _modal: 'CrimeList', _condition: 'new', _data: { userid: MyLocalStorage.getUserId(), driving: [], policecase: [], church: [], schoolcollege: [], sports: [], finance: [], sexual: [] } }] });
                    pageData.current._id = newrecord.upsertedId;
                } else {
                    pageData.current._id = res._id;
                    drivingAddedList.current = res.driving || [];
                    policecaseAddedList.current = res.policecase || [];
                    churchAddedList.current = res.church || [];
                    schoolcollegeAddedList.current = res.schoolcollege || [];
                    sportsAddedList.current = res.sports || [];
                    financeAddedList.current = res.finance || [];
                    sexualAddedList.current = res.sexual || [];
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
                    selectedTabKey={tabid === 'driving' ? 0 : tabid === 'policecase' ? 1 : tabid === 'church' ? 2 : tabid === 'schoolcollege' ? 3 : tabid === 'sports' ? 4 : tabid === 'finance' ? 5 : tabid === 'sexual' ? 6 : 0}
                    transformWidth={600}
                    tabClassName="bg-red-100"
                    items={[{
                        title: 'Driving',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <DrivingPanel drivingAddedList={drivingAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Policecase',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <PolicecasePanel policecaseAddedList={policecaseAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Church',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <ChurchPanel churchAddedList={churchAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Schoolcollege',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <SchoolcollegePanel schoolcollegeAddedList={schoolcollegeAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Sports',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <SportsPanel sportsAddedList={sportsAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />

                        }
                    }, {
                        title: 'Finance',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <FinancePanel financeAddedList={financeAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />

                        }
                    }, {
                        title: 'Sexual',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <SexualPanel sexualAddedList={sexualAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />

                        }

                    }]} />
            </div>
        </div>
    );
});

export default CrimeTabs;
