import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import Tabs from 'react-responsive-tabs';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../component/forms';
import { apiPostCall } from '../../helper/API';
import ToastMessage from '../../toast';
import MyLocalStorage from '../../util/mylocalStorage';
import GeneralPanel from './general';
import SpecificPanel from './specific';
import FamilyinfoPanel from './familyinfo';
import HealthinfoPanel from './healthinfo';
import FutureplanPanel from './futureplan';

import { formList } from './formLists';

const MarriageTabs = React.memo(() => {
  const [ui, uiRefresh] = useState(-1);
  const pageData = useRef({ init: false, _id: '' });
  const generalAddedList = useRef([]);
  const specificAddedList = useRef([]);
  const familyinfoAddedList = useRef([]);
  const healthinfoAddedList = useRef([]);
  const futureplanAddedList = useRef([]);
  

  const { tabid } = useParams();

  useEffect(() => {
    (async () => {
      let search = [
        {
          _modal: 'MarriageList',
          _find: { userid: MyLocalStorage.getUserId() },
          _mode: 'single',
          _select:
            'general Specific familyinfo healthinfo futureplan',
        },
      ];
      const res = await apiPostCall('/api/common/common_search', {
        _list: search,
      });
      if (res.isError) {
        ToastMessage({
          type: 'error',
          message: res.Error.response.data.message,
          timeout: 2000,
        });
        return;
      } else {
        if (res && res.length === 0) {
          const newrecord = await apiPostCall(
            '/api/common/common_mutiple_insert',
            {
              _list: [
                {
                  _modal: 'MarriageList',
                  _condition: 'new',
                  _data: {
                    userid: MyLocalStorage.getUserId(),
                    general: [],
                    Specific: [],
                    familyinfo: [],
                    healthinfo: [],
                    futureplan: [],
                    
                  },
                },
              ],
            }
          );
          pageData.current._id = newrecord.upsertedId;
        } else {
          pageData.current._id = res._id;
          generalAddedList.current = res.general || [];
          specificAddedList.current = res.specific || [];
          familyinfoAddedList.current = res.familyinfo || [];
          healthinfoAddedList.current = res.healthinfo || [];
          futureplanAddedList.current = res.futureplan || [];
          
        }
        pageData.current.init = true;
        uiRefresh(Date.now());
      }
    })();
    return () => null;
  }, []);
  if (!pageData.current.init)
    return (
      <div className="flex w-full h-full justify-center items-center">
        <Spinner size="60" />
      </div>
    );
  else
    return (
      <div className="flex px-6 w-full container justify-center mx-auto pb-5">
        <div className="sm:w-full md:w-full xl:w-3/5 mt-20">
          <Tabs
            selectedTabKey={
              tabid === 'General'
                ? 0
                : tabid === 'Specification'
                ? 1
                : tabid === 'Family-details'
                ? 2
                : tabid === 'Health-Status'
                ? 3
                : tabid === 'Future-Plans'
                ? 4
                 : 0
            }
            transformWidth={600}
            tabClassName="bg-red-100"
            items={[
              {
                title: 'General',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <GeneralPanel
                    generalAddedList={generalAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Specification',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <SpecificPanel
                    specificAddedList={specificAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Family-details',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <FamilyinfoPanel
                    familyinfoAddedList={familyinfoAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Health-Status',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <HealthinfoPanel
                    healthinfoAddedList={healthinfoAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              
                {
                title: 'Future-Plans',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <FutureplanPanel
                      futureplanAddedList={futureplanAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
             
            ]}
          />
        </div>
      </div>
    );
});

export default MarriageTabs;
