import { useEffect } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/Layouts/AppLayout';
import withAuth from './withAuth';

function BloodBank() {
  const moduleId = 'blood-banks';
  const menuGroup = 'dashboard';

  return (
    <AppLayout
      moduleId={moduleId}
      menuGroup={menuGroup}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Blood Bank
        </h2>
      }
    >
      <Head>
        <title>Laravel - Blood Bank</title>
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

export default withAuth(BloodBank);
