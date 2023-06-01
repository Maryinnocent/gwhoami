import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import Tabs from 'react-responsive-tabs';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../component/forms';
import { apiPostCall } from '../../helper/API';
import ToastMessage from '../../toast';
import MyLocalStorage from '../../util/mylocalStorage';
import GeneralPanel from './general';
import IncomePanel from './income';
import FamilyPanel from './family';
import OincomePanel from './oincome';
import EducationPanel from './education';
import RetirementPanel from './retirement';
import OdeductionsPanel from './odeductions';
import OwnhomePanel from './ownhome';
import SelfemployPanel from './selfemploy';
import TaxpayPanel from './taxpay';
import DonationPanel from './donation';

import { formList } from './formLists';

const TaxTabs = React.memo(() => {
  const [ui, uiRefresh] = useState(-1);
  const pageData = useRef({ init: false, _id: '' });
  const generalAddedList = useRef([]);
  const incomeAddedList = useRef([]);
  const familyAddedList = useRef([]);
  const oincomeAddedList = useRef([]);
  const educationAddedList = useRef([]);
  const retirementAddedList = useRef([]);
  const odeductionsAddedList = useRef([]);
  const homeAddedList = useRef([]);
  const selfemployAddedList = useRef([]);
  const taxpayAddedList = useRef([]);
  const donationAddedList = useRef([]);

  const { tabid } = useParams();

  useEffect(() => {
    (async () => {
      let search = [
        {
          _modal: 'TaxList',
          _find: { userid: MyLocalStorage.getUserId() },
          _mode: 'single',
          _select:
            'general income family oincome education retirement odeductions home selfemploy taxpay donation',
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
                  _modal: 'TaxList',
                  _condition: 'new',
                  _data: {
                    userid: MyLocalStorage.getUserId(),
                    general: [],
                    income: [],
                    family: [],
                    oincome: [],
                    education: [],
                    retirement: [],
                    odeductions: [],
                    home: [],
                    selfemploy: [],
                    taxpay: [],
                    donation: [],
                  },
                },
              ],
            }
          );
          pageData.current._id = newrecord.upsertedId;
        } else {
          pageData.current._id = res._id;
          generalAddedList.current = res.general || [];
          incomeAddedList.current = res.income || [];
          familyAddedList.current = res.family || [];
          oincomeAddedList.current = res.oincome || [];
          educationAddedList.current = res.education || [];
          retirementAddedList.current = res.retirement || [];
          odeductionsAddedList.current = res.odeductions || [];
          homeAddedList.current = res.home || [];
          selfemployAddedList.current = res.selfemploy || [];
          taxpayAddedList.current = res.taxpay || [];
          donationAddedList.current = res.donation || [];
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
                : tabid === 'income'
                ? 1
                : tabid === 'family'
                ? 2
                : tabid === 'Other-Income'
                ? 3
                : tabid === 'education'
                ? 4
                : tabid === 'retirement'
                ? 5
                : tabid === 'Other-Deduction'
                ? 6
                : tabid === 'Own-Home'
                ? 7
                : tabid === 'Self-Employed'
                ? 8
                : tabid === 'TaxPayments'
                ? 9
                : tabid === 'donation'
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
                title: 'Income',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <IncomePanel
                      incomeAddedList={incomeAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Family',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <FamilyPanel
                      familyAddedList={familyAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Other-Income',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <OincomePanel
                      oincomeAddedList={oincomeAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Education',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <EducationPanel
                      educationAddedList={educationAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Retirement',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <RetirementPanel
                      retirementAddedList={retirementAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Other-Deductions',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <OdeductionsPanel
                      odeductionsAddedList={odeductionsAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Own-Home',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <OwnhomePanel
                      homeAddedList={homeAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Selfemploy',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <SelfemployPanel
                      selfemployAddedList={selfemployAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Taxpay',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <TaxpayPanel
                      taxpayAddedList={taxpayAddedList}
                      pageData={pageData}
                      ui={ui}
                      uiRefresh={uiRefresh}
                    />
                  );
                },
              },
              {
                title: 'Donation',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () => {
                  return (
                    <DonationPanel
                      donationAddedList={donationAddedList}
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

export default TaxTabs;
