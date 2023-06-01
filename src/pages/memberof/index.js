import React, { useRef, useState } from "react";
import { useEffect } from "react";
import Tabs from 'react-responsive-tabs';
import { useParams } from "react-router-dom";
import { Spinner } from "../../component/forms";
import { apiPostCall } from "../../helper/API";
import ToastMessage from "../../toast";
import MyLocalStorage from "../../util/mylocalStorage";
import PublicPanel from "./public";
import PrivatePanel from "./private";
import VolunteerPanel from "./volunteer";
import SportsPanel from "./sports";
import MediaPanel from "./media";
import SocialPanel from "./social";
import SecurityPanel from "./security";
import GamingPanel from "./gaming";
import ResearchPanel from "./research";
import FinancePanel from "./finance";
import CommunityPanel from "./community";
import ConstructionPanel from "./construction";

import { formList } from "./formLists";

const MemberofTabs = React.memo(() => {
    const [ui, uiRefresh] = useState(-1);
    const pageData = useRef({ init: false, _id: '' });
    const publicAddedList = useRef([]);
    const privateAddedList = useRef([]);
    const volunteerAddedList = useRef([]);
    const sportsAddedList = useRef([]);
    const mediaAddedList = useRef([]);
    const socialAddedList = useRef([]);
    const securityAddedList = useRef([]);
    const gamingAddedList = useRef([]);
    const researchAddedList = useRef([]);     
    const financeAddedList = useRef([]);
    const communityAddedList = useRef([]);
    const constructionAddedList = useRef([]);
    
    const { tabid } = useParams();
    
    useEffect(() => {
        (async () => {
            let search = [{ _modal: 'MemberofList', _find: { userid: MyLocalStorage.getUserId() }, _mode: 'single', _select: 'public private volunteer sports media social security gaming research finance community construction' }];
            const res = await apiPostCall('/api/common/common_search', { _list: search });
            if (res.isError) {
                ToastMessage({ type: "error", message: res.Error.response.data.message, timeout: 2000 });
                return;
            } else {
                if (res && res.length === 0) {
                    const newrecord = await apiPostCall('/api/common/common_mutiple_insert', { _list: [{ _modal: 'MemberofList', _condition: 'new', _data: { userid: MyLocalStorage.getUserId(), public: [], private: [], volunteer: [], sports: [], media: [], social: [], security: [], gaming: [], research: [], finance: [], community: [], construction: [] } }] });
                    pageData.current._id = newrecord.upsertedId;
                } else {
                    pageData.current._id = res._id;
                    publicAddedList.current = res.public || [];
                    privateAddedList.current = res.private || [];
                    volunteerAddedList.current = res.volunteer || [];
                    sportsAddedList.current = res.sports || [];
                    mediaAddedList.current = res.media || [];
                    socialAddedList.current = res.social || [];
                    securityAddedList.current = res.security || [];
                    gamingAddedList.current = res.gaming || [];
                    researchAddedList.current = res.research || [];                   
                    financeAddedList.current = res.finance || [];
                    communityAddedList.current = res.community || [];
                    constructionAddedList.current = res.construction || [];
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
                    selectedTabKey={tabid === 'public' ? 0 : tabid === 'private' ? 1 : tabid === 'volunteer' ? 2 : tabid === 'sports' ? 3 : tabid === 'media' ? 4 : tabid === 'social' ? 5 : tabid === 'security' ? 6 : tabid === 'gaming' ? 7 : tabid === 'research' ? 8 : tabid === 'finance' ? 9 : tabid === 'community' ? 10 : tabid === 'construction' ? 11 : 0}
                    transformWidth={600}
                    tabClassName="bg-red-100"
                    items={[{
                        title: 'Public',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <PublicPanel publicAddedList={publicAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Private',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <PrivatePanel privateAddedList={privateAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Volunteer',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <VolunteerPanel volunteerAddedList={volunteerAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
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
                        title: 'Media',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <MediaPanel mediaAddedList={mediaAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
                        }
                    }, {
                        title: 'Social',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <SocialPanel socialAddedList={socialAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />

                        }
                    }, {
                        title: 'Security',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <SecurityPanel securityAddedList={securityAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />

                        }
                    }, {
                        title: 'Gaming',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <GamingPanel gamingAddedList={gamingAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />

                        }
                    }, {
                        title: 'Research',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <ResearchPanel researchAddedList={researchAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />
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
                        title: 'Community',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <CommunityPanel communityAddedList={communityAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />

                        }
                   
                    }, {
                        title: 'Construction',
                        tabClassName: 'customtab',
                        panelClassName: 'custompanel',
                        getContent: () =>
                        {
                            return <ConstructionPanel constructionAddedList={constructionAddedList} pageData={pageData} ui={ui} uiRefresh={uiRefresh} />

                        }

                    
                    }]} />
            </div>
        </div>
    );
});

export default MemberofTabs;
