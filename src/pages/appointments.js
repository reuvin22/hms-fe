import { useEffect } from 'react';

import Head from 'next/head';
import AppLayout from '@/components/Layouts/AppLayout';
import Transaction from '@/components/Transaction';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import withAuth from './withAuth';

function Appointment() {
  const moduleId = 'appointments';
  const menuGroup = 'dashboard';

  const appointmentData = [
    {
      patient_id: 'P-23-001',
      patient_name: 'John Smith',
      visit_type: 'OPD',
      appointment_type: 'Online Appointment',
      birth_date: 'October 24 1990',
      age: 30
    }
  ];

  return (
    <AppLayout
      moduleId={moduleId}
      menuGroup={menuGroup}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Appointments
        </h2>
      }
    >
      <Head>
        <title>Laravel - Appointments</title>
      </Head>

      <div className="p-8">
        <div className="px-2 mb-4">
          <span class="text-xl font-medium uppercase text-[#90949a]">
            Patient Details
          </span>
        </div>

        <Table data={appointmentData} />

        <div className="mt-8">
          <Pagination />
        </div>
      </div>

      <hr />

      <div className="px-8 mt-7">
        <Transaction />
      </div>
    </AppLayout>
  );
}

export default withAuth(Appointment);
