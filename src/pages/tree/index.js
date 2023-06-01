import React, { useRef, useState } from "react";
import { useEffect } from "react";
import Tabs from 'react-responsive-tabs';
import { useParams } from "react-router-dom";
import { Spinner } from "../../component/forms";
import { apiPostCall } from "../../helper/API";
import ToastMessage from "../../toast";
import MyLocalStorage from "../../util/mylocalStorage";
import GparentsPanel from "./gparents";
import ParentsPanel from "./parents";
import OtherPanel from "./other";
import SpousePanel from "./spouse";
import ChildPanel from "./child";

//import { formList } from "./formLists";

const TreeTabs = React.memo(() => {
    const [ui, uiRefresh] = useState(-1);
    const pageData = useRef({ init: false, _id: '' });
    const gparentsAddedList = useRef([]);
    const parentsAddedList = useRef([]);
    const otherAddedList = useRef([]);
    const spouseAddedList = useRef([]);
    const childAddedList = useRef([]);
    
    const { tabid } = useParams();
    
    useEffect(() => {
        (async () => {
            let search = [{ _modal: 'TreeList', _find: { userid: MyLocalStorage.getUserId() }, _mode: 'single', _select: 'gparents parents other spouse child' }];
            const res = await apiPostCall('/api/common/common_search', { _list: search });
            if (res.isError) {
                ToastMessage({ type: "error", message: res.Error.response.data.message, timeout: 2000 });
                return;
            } else {
                if (res && res.length === 0) {
                    const newrecord = await apiPostCall('/api/common/common_mutiple_insert', { _list: [{ _modal: 'TreeList', _condition: 'new', _data: { userid: MyLocalStorage.getUserId(), gparents: [], parents: [], other: [], spouse: [], child: [] } }] });
                    pageData.current._id = newrecord.upsertedId;
                } else {
                    pageData.current._id = res._id;
                    gparentsAddedList.current = res.gparents || [];
                    parentsAddedList.current = res.parents || [];
                    otherAddedList.current = res.other || [];
                    spouseAddedList.current = res.spouse || [];
                    childAddedList.current = res.child || [];
                                   
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
                    selectedTabKey={tabid === 'gparents' ? 0 : tabid === 'parents' ? 1 : tabid === 'other' ? 2 : tabid === 'spouse' ? 3 : tabid === 'child' ? 4 : 0}
                    transformWidth={600}
                    tabClassName="bg-red-100"
                    items={[{
                        title: 'Grand_Parents',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <GparentsPanel gparentsAddedList={gparentsAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Parents',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <ParentsPanel parentsAddedList={parentsAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                     } , {
                        title: 'Other',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <OtherPanel otherAddedList={otherAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Spouse',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <SpousePanel spouseAddedList={spouseAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Child',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <ChildPanel childAddedList={childAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }]} />
            </div>
        </div>
    );
});

export default TreeTabs;
