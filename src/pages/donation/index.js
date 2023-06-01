import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import Tabs from 'react-responsive-tabs';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../component/forms';
import { apiPostCall } from '../../helper/API';
import ToastMessage from '../../toast';
import MyLocalStorage from '../../util/mylocalStorage';
import GeneralPanel from './general';
import CashdonationPanel from './cashdonation';
import ValuableassetPanel from './valuableasset';
import KidseducationPanel from './kidseducation';
import KinddonationPanel from './kinddonation';
import GlobalwarmingPanel from './globalwarming';
import ConstructionPanel from './construction';
import StocksPanel from './stocks';
import GiftsPanel from './gifts';
import OrgansPanel from './organs';
import OtherPanel from './other';

import { formList } from './formLists';

const DonationTabs = React.memo(() => {
  const [ui, uiRefresh] = useState(-1);
  const pageData = useRef({ init: false, _id: '' });
  const generalAddedList = useRef([]);
  const cashdonationAddedList = useRef([]);
  const valuableassetAddedList = useRef([]);
  const kidseducationAddedList = useRef([]);
  const kinddonationAddedList = useRef([]);
  const globalwarmingAddedList = useRef([]);
  const constructionAddedList = useRef([]);
  const stocksAddedList = useRef([]);
  const giftsAddedList = useRef([]);
  const organsAddedList = useRef([]);
  const otherAddedList = useRef([]);

  const { tabid } = useParams();

  useEffect(() => {
    (async () => {
      let search = [
        {
          _modal: 'DonationList',
          _find: { userid: MyLocalStorage.getUserId() },
          _mode: 'single',
          _select:
            'general cashdonation valuableasset kidseducation kinddonation globalwarming construction stocks gifts organs donation',
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
                  _modal: 'DonationList',
                  _condition: 'new',
                  _data: {
                    userid: MyLocalStorage.getUserId(),
                    general: [],
                    cashdonation: [],
                    valuableasset: [],
                    kidseducation: [],
                    kinddonation: [],
                    globalwarming: [],
                    construction: [],
                    stocks: [],
                    gifts: [],
                    organs: [],
                    other: [],
                  },
                },
              ],
            }
          );
          pageData.current._id = newrecord.upsertedId;
        } else {
          pageData.current._id = res._id;
          generalAddedList.current = res.general || [];
          cashdonationAddedList.current = res.cashdonation || [];
          valuableassetAddedList.current = res.valuableasset || [];
          kidseducationAddedList.current = res.kidseducation || [];
          kinddonationAddedList.current = res.kinddonation || [];
          globalwarmingAddedList.current = res.globalwarming || [];
          constructionAddedList.current = res.construction || [];
          stocksAddedList.current = res.stocks || [];
          giftsAddedList.current = res.gifts || [];
          organsAddedList.current = res.organs || [];
          otherAddedList.current = res.other || [];
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
              tabid === 'general'
                ? 0
                : tabid === 'cashdonation'
                ? 1
                : tabid === 'valuableasset'
                ? 2
                : tabid === 'kidseducation'
                ? 3
                : tabid === 'kinddonation'
                ? 4
                : tabid === 'globalwarming'
                ? 5
                : tabid === 'construction'
                ? 6
                : tabid === 'stocks'
                ? 7
                : tabid === 'gifts'
                ? 8
                : tabid === 'organs'
                ? 9
                : tabid === 'other'
                ? 10
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
                title: 'Cash-Donation',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <CashdonationPanel
                      cashdonationAddedList={cashdonationAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Valuable-Assets',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <ValuableassetPanel
                      valuableassetAddedList={valuableassetAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Kids-Education',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <KidseducationPanel
                      kidseducationAddedList={kidseducationAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'In-Kind-Donation',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <KinddonationPanel
                      kinddonationAddedList={kinddonationAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Global-Warming',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <GlobalwarmingPanel
                      globalwarmingAddedList={globalwarmingAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Construction',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <ConstructionPanel
                      constructionAddedList={constructionAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Donate-Stocks',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <StocksPanel
                      stocksAddedList={stocksAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Planned-Gifts',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <GiftsPanel
                      giftsAddedList={giftsAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Human-Organs',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <OrgansPanel
                      organsAddedList={organsAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Other',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <OtherPanel
                      otherAddedList={otherAddedList}
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

export default DonationTabs;
