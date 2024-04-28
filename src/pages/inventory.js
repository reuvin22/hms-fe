import { useEffect } from 'react';
import Head from 'next/head';

import AppLayout from '@/components/Layouts/AppLayout';
import Cookies from 'js-cookie';
import {
  useGetUserListQuery,
  useGetPermissionListQuery,
  useGetModuleListQuery
} from '@/service/settingService';
import withAuth from './withAuth';

function Inventory() {
  const moduleId = 'inventory';
  const authToken = Cookies.get('token');
  const {
    isLoading: moduleListLoading,
    refetch: refetchModules,
    isError
  } = useGetModuleListQuery(
    {},
    {
      enabled: !!authToken
    }
  );

  return (
    <AppLayout
      isLoading={moduleListLoading}
      moduleId={moduleId}
      menuGroup={moduleId}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Inventory
        </h2>
      }
    >
      <Head>
        <title>Laravel - Inventory</title>
      </Head>

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h3>Youre logged in!</h3>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default withAuth(Inventory);
