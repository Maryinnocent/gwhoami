import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import Tabs from 'react-responsive-tabs';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../component/forms';
import { apiPostCall } from '../../helper/API';
import ToastMessage from '../../toast';
import MyLocalStorage from '../../util/mylocalStorage';
import OnlinesavePanel from './onlinesave';
import StudentsavePanel from './studentsave';
import CertifysavePanel from './certifysave';
import MoneymarketPanel from './moneymarket';
import TradingonlinePanel from './tradingonline';
import HealthsavePanel from './healthsave';
import IrasavingPanel from './irasaving';
import InvestmentsavePanel from './investmentsave';
import InsurancesavePanel from './insurancesave';

import { formList } from './formLists';

const SavingTabs = React.memo(() => {
  const [ui, uiRefresh] = useState(-1);
  const pageData = useRef({ init: false, _id: '' });
  const onlinesaveAddedList = useRef([]);
  const studentsaveAddedList = useRef([]);
  const certifysaveAddedList = useRef([]);
  const moneymarketAddedList = useRef([]);
  const tradingonlineAddedList = useRef([]);
  const healthsaveAddedList = useRef([]);
  const irasavingAddedList = useRef([]);
  const investmentsaveAddedList = useRef([]);
  const insurancesaveAddedList = useRef([]);

  const { tabid } = useParams();

  useEffect(() => {
    (async () => {
      let search = [
        {
          _modal: 'SavingList',
          _find: { userid: MyLocalStorage.getUserId() },
          _mode: 'single',
          _select:
            'onlinesave studentsave certifysave moneymarket tradingonline healthsave irasaving investmentsave insurancesave',
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
                  _modal: 'SavingList',
                  _condition: 'new',
                  _data: {
                    userid: MyLocalStorage.getUserId(),
                    onlinesave: [],
                    studentsave: [],
                    certifysave: [],
                    moneymarket: [],
                    tradingonline: [],
                    healthsave: [],
                    irasaving: [],
                    investmentsave: [],
                    insurancesave: [],
                  },
                },
              ],
            }
          );
          pageData.current._id = newrecord.upsertedId;
        } else {
          pageData.current._id = res._id;
          onlinesaveAddedList.current = res.onlinesave || [];
          studentsaveAddedList.current = res.studentsave || [];
          certifysaveAddedList.current = res.certifysave || [];
          moneymarketAddedList.current = res.moneymarket || [];
          tradingonlineAddedList.current = res.tradingonline || [];
          healthsaveAddedList.current = res.healthsave || [];
          irasavingAddedList.current = res.irasaving || [];
          investmentsaveAddedList.current = res.investmentsave || [];
          insurancesaveAddedList.current = res.insurancesave || [];
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
              tabid === 'onlinesave'
                ? 0
                : tabid === 'studentsave'
                ? 1
                : tabid === 'certifysave'
                ? 2
                : tabid === 'moneymarket'
                ? 3
                : tabid === 'tradingonline'
                ? 4
                : tabid === 'healthsaving'
                ? 5
                : tabid === 'irasaving'
                ? 6
                : tabid === 'investmentsave'
                ? 7
                : tabid === 'insurancesave'
                ? 8
                : 0
            }
            transformWidth={600}
            tabClassName="bg-red-100"
            items={[
              {
                title: 'Online-saving',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <OnlinesavePanel
                      onlinesaveAddedList={onlinesaveAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Student-Savings',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <StudentsavePanel
                      studentsaveAddedList={studentsaveAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Certificate-Deposit',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <CertifysavePanel
                      certifysaveAddedList={certifysaveAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Money-Market',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <MoneymarketPanel
                      moneymarketAddedList={moneymarketAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Online-Trading',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <TradingonlinePanel
                      tradingonlineAddedList={tradingonlineAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Health-Savings',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <HealthsavePanel
                      healthsaveAddedList={healthsaveAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'IRA-roth-IRA',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <IrasavingPanel
                      irasavingAddedList={irasavingAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Investment',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <InvestmentsavePanel
                      investmentsaveAddedList={investmentsaveAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Life-Insurance',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <InsurancesavePanel
                      insurancesaveAddedList={insurancesaveAddedList}
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

export default SavingTabs;
