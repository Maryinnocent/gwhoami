import React, { useRef, useState } from "react";
import { useEffect } from "react";
import Tabs from 'react-responsive-tabs';
import { useParams } from "react-router-dom";
import { Spinner } from "../../component/forms";
import { apiPostCall } from "../../helper/API";
import ToastMessage from "../../toast";
import MyLocalStorage from "../../util/mylocalStorage";
import GeneralPanel from "./general";
import HousePanel from "./house";
import HouseitemsPanel from "./houseitems";
import VehiclesPanel from "./vehicles";

const PropertiesTabs = React.memo(() => {
    const [ui, uiRefresh] = useState(-1);
    const pageData = useRef({ init: false, _id: '' });
    const generalAddedList = useRef([]);
    const houseAddedList = useRef([]);
    const houseitemsAddedList = useRef([]);
    const vehiclesAddedList = useRef([]);
    const { tabid } = useParams();
    useEffect(() => {
        (async () => {
            let search = [{ _modal: 'PropertyList', _find: { userid: MyLocalStorage.getUserId() }, _mode: 'single', _select: 'general house houseitems vehicles' }];
            const res = await apiPostCall('/api/common/common_search', { _list: search });
            if (res.isError) {
                ToastMessage({ type: "error", message: res.Error.response.data.message, timeout: 2000 });
                return;
            } else {
                if (res && res.length === 0) {
                    const newrecord = await apiPostCall('/api/common/common_mutiple_insert', { _list: [{ _modal: 'PropertyList', _condition: 'new', _data: { userid: MyLocalStorage.getUserId(), general: [], house: [], houseitems: [], vehicles: [] } }] });
                    pageData.current._id = newrecord.upsertedId;
                } else {
                    pageData.current._id = res._id;
                    generalAddedList.current = res.general || [];
                    houseAddedList.current = res.house || [];
                    houseitemsAddedList.current = res.houseitems || [];
                    vehiclesAddedList.current = res.vehicles || [];
                    
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
                    selectedTabKey={tabid === 'general' ? 0 : tabid === 'house' ? 1 : tabid === 'houseitems' ? 2 : tabid === 'vehicles' ? 3 : 0} 
                    transformWidth={600}
                    tabClassName="bg-red-100"
                    items={[{
                        title: 'General',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () => {
                            return <GeneralPanel generalAddedList={generalAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'House',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () => {
                            return <HousePanel  houseAddedList={houseAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'House-hold-Items',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () => {
                            return <HouseitemsPanel houseitemsAddedList={houseitemsAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Vehicles',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () => {
                            return <VehiclesPanel vehiclesAddedList={vehiclesAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }]} />
            </div>
        </div>
    );
});

export default PropertiesTabs;
