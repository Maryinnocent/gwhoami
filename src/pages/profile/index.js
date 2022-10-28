import React, { useRef, useState } from "react";
import { useEffect } from "react";
import Tabs from 'react-responsive-tabs';
import { useParams } from "react-router-dom";
import { Spinner } from "../../component/forms";
import { apiPostCall } from "../../helper/API";
import ToastMessage from "../../toast";
import MyLocalStorage from "../../util/mylocalStorage";
import JobPanel from "./job";
import BusinessPanel from "./business";

const ProfileTabs = React.memo(() => {
    const [ui, uiRefresh] = useState(-1);
    const pageData = useRef({ init: false, _id: '' });
    const jobAddedList = useRef([]);
    const businessAddedList = useRef([]);
    const { tabid } = useParams();
    useEffect(() => {
        (async () => {
            let search = [{ _modal: 'ProfileList', _find: { userid: MyLocalStorage.getUserId() }, _mode: 'single', _select: 'general job business' }];
            const res = await apiPostCall('/api/common/common_search', { _list: search });
            if (res.isError) {
                ToastMessage({ type: "error", message: res.Error.response.data.message, timeout: 2000 });
                return;
            } else {
                if (res && res.length === 0) {
                    const newrecord = await apiPostCall('/api/common/common_mutiple_insert', { _list: [{ _modal: 'ProfileList', _condition: 'new', _data: { userid: MyLocalStorage.getUserId(), general: [], job: [], business: [] } }] });
                    pageData.current._id = newrecord.upsertedId;
                } else {
                    pageData.current._id = res._id;
                    jobAddedList.current = res.job || [];
                    businessAddedList.current = res.business || [];
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
                    selectedTabKey={tabid === 'general' ? 0 : tabid === 'job' ? 1 : tabid === 'business' ? 2 : 0}
                    transformWidth={600}
                    tabClassName="bg-red-100"
                    items={[{
                        title: 'General',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () => (
                            <h1>General</h1>
                        )
                    }, {
                        title: 'Job',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () => {
                            return <JobPanel jobAddedList={jobAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Business',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () => {
                            return <BusinessPanel businessAddedList={businessAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }]} />
            </div>
        </div>
    );
});

export default ProfileTabs;
