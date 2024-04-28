import { useEffect, useState } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/Layouts/AppLayout';
import Cookies from 'js-cookie';
import {
  useGetUserListQuery,
  useGetPermissionListQuery,
  useGetModuleListQuery
} from '@/service/settingService';
import withAuth from './withAuth';

function HumanResource() {
  const moduleId = 'human-resource';
  const menuGroup = 'dashboard';
  const authToken = Cookies.get('token');
  const [contentHeight, setContentHeight] = useState(0);
  const {
    isLoading: moduleListLoading,
    refetch: refetchModules,
    isError,
    isSuccess
  } = useGetModuleListQuery(
    {},
    {
      enabled: !!authToken
    }
  );

  useEffect(() => {
    const calculateHeight = () => {
      const windowHeight = window.innerHeight;
      setContentHeight(windowHeight);
    };
    calculateHeight();

    // Recalculate height on window resize
    window.addEventListener('resize', calculateHeight);
    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, []);

  return (
    <AppLayout
      isLoading={moduleListLoading}
      moduleId={moduleId}
      menuGroup={moduleId}
    >
      <Head>
        <title>Radiology</title>
      </Head>

      <div
        className="relative overflow-x-hidden"
        style={{ height: `${contentHeight}px` }}
      >
        <div className="p-8 pt-[5rem]">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h3>Radiology!</h3>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default withAuth(HumanResource);
