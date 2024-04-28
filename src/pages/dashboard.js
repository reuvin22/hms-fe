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

function Dashboard() {
  const moduleId = 'dashboard';
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

  // const data = useGetModuleListQuery({},{
  //     enabled: !!authToken
  // })

  // useEffect(() => {
  //     if(isError && refetchAttempts < MAX_REFETCH_ATTEMPTS) {
  //         setRefetchAttempts(prevAttempts => prevAttempts + 1)
  //         refetchModules()
  //     }
  // }, [authToken, refetchModules, refetchAttempts])

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
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Dashboard
        </h2>
      }
    >
      <Head>
        <title>Laravel - Dashboard</title>
      </Head>

      <div
        className="relative overflow-x-hidden"
        style={{ height: `${contentHeight}px` }}
      >
        <div className="p-8 pt-[5rem]">
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

export default withAuth(Dashboard);
