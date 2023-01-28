import React, { useRef, useState } from "react";
import { useEffect } from "react";
import Tabs from 'react-responsive-tabs';
import { useParams } from "react-router-dom";
import { Spinner } from "../../component/forms";
import { apiPostCall } from "../../helper/API";
import ToastMessage from "../../toast";
import MyLocalStorage from "../../util/mylocalStorage";
import RegularPanel from "./regular";
import ImmunePanel from "./immune";
import AllergiesPanel from "./allergies";
import HealthinfoPanel from "./healthinfo";
import SurgeryPanel from "./surgery";
import MedicationPanel from "./medication";
import { formList } from "./formLists";

const MedicalTabs = React.memo(() =>
{
    const [ui, uiRefresh] = useState(-1);
    const pageData = useRef({ init: false, _id: '' });
    const regularAddedList = useRef([]);
    const immuneAddedList = useRef([]);
    const allergiAddedList = useRef([]);
    const healthinfoAddedList = useRef([]);
    const surgeryAddedList = useRef([]);
    const medicationAddedList = useRef([]);
    const regularMenus = useRef([]);

    const { tabid } = useParams();
    useEffect(() =>
    {
        (async () =>
        {
            let search = [{ _modal: 'MedicalList', _find: { userid: MyLocalStorage.getUserId() }, _mode: 'single', _select: 'regular immune allergi healthinfo surgery medication' }];
            const res = await apiPostCall('/api/common/common_search', { _list: search });
            if (res.isError)
            {
                ToastMessage({ type: "error", message: res.Error.response.data.message, timeout: 2000 });
                return;
            } else
            {
                if (res && res.length === 0)
                {
                    const newrecord = await apiPostCall('/api/common/common_mutiple_insert', { _list: [{ _modal: 'MedicalList', _condition: 'new', _data: { userid: MyLocalStorage.getUserId(), regular: [], immune: [], allergi: [], healthinfo: [], surgery: [], medication: [] } }] });
                    pageData.current._id = newrecord.upsertedId;
                } else
                {
                    pageData.current._id = res._id;
                    regularAddedList.current = res.regular || [];
                    immuneAddedList.current = res.immune || [];
                    allergiAddedList.current = res.allergi || [];
                    healthinfoAddedList.current = res.healthinfo || [];
                    surgeryAddedList.current = res.surgery || [];
                    medicationAddedList.current = res.medication || [];

                    let cm = [...formList.regularMenu];
                    regularAddedList.current.map(s => s.bloods.map(c => c.blood)).map(arr => arr.forEach(itm =>
                    {
                        cm.splice(cm.indexOf(itm), 1);
                    }));
                    regularMenus.current = [...cm];


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
                    selectedTabKey={tabid === 'regular' ? 0 : tabid === 'immune' ? 1 : tabid === 'allergi' ? 2 : tabid === 'healthinfo' ? 3 : tabid === 'surgery' ? 4 : tabid === 'medication' ? 5 : 0}
                    transformWidth={600}
                    tabClassName="bg-red-100"
                    items={[{
                        title: 'Regular',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <RegularPanel regularAddedList={regularAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} regularMenus={regularMenus} />
                        }
                    }, {
                        title: 'Immunization',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <ImmunePanel immuneAddedList={immuneAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Allergies',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            console.log('test');
                            return <AllergiesPanel allergiAddedList={allergiAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />

                        }
                    }, {
                        title: 'Health-Info',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <HealthinfoPanel healthinfoAddedList={healthinfoAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />

                        }
                    }, {
                        title: 'Surgery',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <SurgeryPanel surgeryAddedList={surgeryAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />

                        }
                    }, {
                        title: 'Medication',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <MedicationPanel medicationAddedList={medicationAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }]} />
            </div>
        </div>
    );
});

export default MedicalTabs;
