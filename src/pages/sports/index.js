import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import Tabs from 'react-responsive-tabs';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../component/forms';
import { apiPostCall } from '../../helper/API';
import ToastMessage from '../../toast';
import MyLocalStorage from '../../util/mylocalStorage';
import LeaguePanel from './league';
import DomesticPanel from './domestic';
import InternationalPanel from './international';
import AwardsPanel from './awards';
import RankPanel from './rank';

const PropertiesTabs = React.memo(() => {
  const [ui, uiRefresh] = useState(-1);
  const pageData = useRef({ init: false, _id: '' });
  const leagueAddedList = useRef([]);
  const domesticAddedList = useRef([]);
  const internationalAddedList = useRef([]);
  const awardsAddedList = useRef([]);
  const rankAddedList = useRef([]);
  const { tabid } = useParams();
  useEffect(() => {
    (async () => {
      let search = [
        {
          _modal: 'SportList',
          _find: { userid: MyLocalStorage.getUserId() },
          _mode: 'single',
          _select: 'league domestic international awards rank',
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
                  _modal: 'SportList',
                  _condition: 'new',
                  _data: {
                    userid: MyLocalStorage.getUserId(),
                    league: [],
                    domestic: [],
                    International: [],
                    awards: [],
                    rank: [],
                  },
                },
              ],
            }
          );
          pageData.current._id = newrecord.upsertedId;
        } else {
          pageData.current._id = res._id;
          leagueAddedList.current = res.league || [];
          domesticAddedList.current = res.domestic || [];
          internationalAddedList.current = res.international || [];
          awardsAddedList.current = res.awards || [];
          rankAddedList.current = res.rank || [];
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
              tabid === 'league'
                ? 0
                : tabid === 'domestic'
                ? 1
                : tabid === 'international'
                ? 2
                : tabid === 'awards'
                ? 3
                : tabid === 'rank'
                ? 4
                : 0
            }
            transformWidth={600}
            tabClassName="bg-red-100"
            items={[
              {
                title: 'League',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <LeaguePanel
                      leagueAddedList={leagueAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Domestic',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <DomesticPanel
                      domesticAddedList={domesticAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'International',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <InternationalPanel
                      internationalAddedList={internationalAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Awards',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <AwardsPanel
                      awardsAddedList={awardsAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Rank',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <RankPanel
                      rankAddedList={rankAddedList}
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

export default PropertiesTabs;
