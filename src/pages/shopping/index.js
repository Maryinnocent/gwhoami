import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import Tabs from 'react-responsive-tabs';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../component/forms';
import { apiPostCall } from '../../helper/API';
import ToastMessage from '../../toast';
import MyLocalStorage from '../../util/mylocalStorage';
import ProductPanel from './product';

import { formList } from './formLists';
import Product from '../../component/Product';
import ProductForm from './productForm';
import ProductScreen from './ProductScreen';

const ProductTabs = React.memo(() =>
{
  const { Id } = useParams();
  const [ui, uiRefresh] = useState(-1);
  const pageData = useRef({ init: false, _id: '' });
  const productAddedList = useRef([]);
  const paymenttoAddedList = useRef([]);

  const { tabid } = useParams();

  useEffect(() =>
  {
    (async () =>
    {
      let search = [
        {
          _modal: 'ProductList',
          _find: { userid: MyLocalStorage.getUserId() },
          _mode: 'single',
          _select: 'product paymentto',
        },
      ];
      const res = await apiPostCall('/api/common/common_search', {
        _list: search,
      });
      if (res.isError)
      {
        ToastMessage({
          type: 'error',
          message: res.Error.response.data.message,
          timeout: 2000,
        });
        return;
      } else
      {
        if (res && res.length === 0)
        {
          const newrecord = await apiPostCall(
            '/api/common/common_mutiple_insert',
            {
              _list: [
                {
                  _modal: 'ProductList',
                  _condition: 'new',
                  _data: {
                    userid: MyLocalStorage.getUserId(),
                    product: [],
                    paymentto: [],
                  },
                },
              ],
            }
          );
          pageData.current._id = newrecord.upsertedId;
        } else
        {
          pageData.current._id = res._id;
          productAddedList.current = res.product || [];
          paymenttoAddedList.current = res.paymentto || [];
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
              tabid === 'product' ? 0 : tabid === 'paymentto' ? 1 : 0
            }
            transformWidth={600}
            tabClassName="bg-red-100"
            items={[
              {
                title: 'Product',
                tabClassName: 'customtab',
                panelClassName: 'custompanel',
                getContent: () =>
                {
                  return (
                    <ProductPanel
                      productAddedList={productAddedList}
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

export default ProductTabs;