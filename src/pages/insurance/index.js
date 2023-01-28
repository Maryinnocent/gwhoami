import React, { useRef, useState } from "react";
import { useEffect } from "react";
import Tabs from 'react-responsive-tabs';
import { useParams } from "react-router-dom";
import { Spinner } from "../../component/forms";
import { apiPostCall } from "../../helper/API";
import ToastMessage from "../../toast";
import MyLocalStorage from "../../util/mylocalStorage";
import HinsurancePanel from "./health";
import ResultPanel from "./result";
import MonthlypayPanel from "./monthlypay";
import PropertypayPanel from "./propertypay";
import VehiclespayPanel from "./vehiclespay";


const InsuranceTabs = React.memo(() => {
    const [ui, uiRefresh] = useState(-1);
    const pageData = useRef({ init: false, _id: '' });
    const hinsuranceAddedList = useRef([]);
    const resultAddedList = useRef([]);
    const  monthlypayAddedList = useRef([]);
    const  propertyAddedList = useRef([]);
    const vehiclesAddedList = useRef([]);

    const { tabid } = useParams();
    useEffect(() => {
        (async () => {
            let search = [{ _modal: 'InsuranceList', _find: { userid: MyLocalStorage.getUserId() }, _mode: 'single', _select: 'hinsurance monthlypay propertypay vehiclespay result' }];
            const res = await apiPostCall('/api/common/common_search', { _list: search });
            if (res.isError) {
                ToastMessage({ type: "error", message: res.Error.response.data.message, timeout: 2000 });
                return;
            } else {
                if (res && res.length === 0) {
                    const newrecord = await apiPostCall('/api/common/common_mutiple_insert', { _list: [{ _modal: 'InsuranceList', _condition: 'new', _data: { userid: MyLocalStorage.getUserId(), hinsurance: [], monthlypay: [], propertypay: [], vehiclespay: [], result: [], } }] });
                    pageData.current._id = newrecord.upsertedId;
                } else {
                    pageData.current._id = res._id;
                    hinsuranceAddedList.current = res.hinsurance || [];
                    monthlypayAddedList.current = res.monthlypay || [];
                    propertyAddedList.current = res.propertypay || [];
                    vehiclesAddedList.current = res.vehiclespay || [];
                    resultAddedList.current = res.result || [];
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
                    selectedTabKey={tabid === 'hinsurance' ? 0 : tabid === 'monthlypay' ? 1 : tabid === 'propertypay' ? 2 : tabid === 'vehiclespay' ? 3 : tabid === 'result' ? 4 : 0} 
                    transformWidth={600}
                    tabClassName="bg-red-100"
                    items={[{
                        title: 'Health-Insurance',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () => {
                            return <HinsurancePanel hinsuranceAddedList={hinsuranceAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    },{
                        title: 'Monthly',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () => {
                            return <MonthlypayPanel monthlypayAddedList={monthlypayAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Properties',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () => {
                            return <PropertypayPanel propertyAddedList={propertyAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Vehicles',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () => {
                            return <VehiclespayPanel vehiclesAddedList={vehiclesAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Result',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () => {
                            return <ResultPanel resultAddedList={resultAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }]} />
            </div>
        </div>
    );
});

export default InsuranceTabs;
