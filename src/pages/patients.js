import { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/Layouts/AppLayout';
import Cookies from 'js-cookie';
import {
  useGetUserListQuery,
  useGetPermissionListQuery,
  useGetModuleListQuery,
  useCreateBulkMutation,
  useDeleteApprovalMutation,
  useUpdateBulkMutation
} from '@/service/settingService';
import withAuth from './withAuth';
import SearchItemPage from '@/components/SearchItemPage';
import Table from '@/components/Table';
import Alert from '@/components/Alert';
import Pagination from '@/components/Pagination';
import Button from '@/components/Button';
import ItemPerPage from '@/components/ItemPerPage';
import SearchExport from '@/components/SearchExport';
import Dropdown from '@/components/Dropdown';
import { DropdownExport } from '@/components/DropdownLink';
import SkeletonScreen from '@/components/SkeletonScreen';
import { TableContext } from '@/utils/context';
import { Timeline } from 'flowbite-react';
import {
  useGetPatientApprovalQuery,
  useGetPatientTotalQuery,
  useGetInPatientListQuery,
  useDeleteApprovedPatientMutation,
  useGetOutPatientsListQuery,
  useGetPatientListQuery
} from '@/service/patientService';
import { Flowbite } from 'flowbite-react';

const recentDoctorData = [
  {
    name: 'schin kumar',
    department: 'Allergist/Immunologist',
    mobile: '0982828282',
    status: 'permanent',
    action: ''
  },
  {
    name: 'schin kumar2',
    department: 'Anesthologist',
    mobile: '0982828282',
    status: 'on hold'
  }
];

const recentPatientData = [
  {
    name: 'schin kumar',
    symptoms: 'bleeding in nose',
    mobile: '0982828282',
    address: 'manila ph',
    status: 'permanent'
  }
];

const Patients = () => {
  const moduleId = 'patients';
  const authToken = Cookies.get('token');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [tableRecords, setTableRecords] = useState('recent_doctors');
  const [activeContent, setActiveContent] = useState('yellow');
  const [contentHeight, setContentHeight] = useState(0);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

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
  const [state, setState] = useState({
    isShowedForm: false,
    selectedRow: null
  });

  const [approve, setApprove] = useState({
    selectedRow: null
  });
  const [timeline, setTimeline] = useState({
    isShowedForm: false,
    selectedRow: null
  });
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [updateBulk, { isLoading: updateBulkLoading }] =
    useUpdateBulkMutation();
  useEffect(() => {
    let spinnerTimer;
    if (btnSpinner) {
      spinnerTimer = setTimeout(() => {
        setBtnSpinner(false);
      }, 500);
    }

    return () => {
      if (spinnerTimer) {
        clearTimeout(spinnerTimer);
      }
    };
  }, [btnSpinner]);

  const {
    data: patientApprovalMaster,
    isLoading: patientApprovalLoading,
    isError: patientApprovalError,
    isSuccess: patientApprovalSuccess,
    refetch: patientApprovalRefetch
  } = useGetPatientApprovalQuery({
    items: itemsPerPage,
    page: currentPage
  });

  const {
    data: patientList,
    isLoading: patientListLoading,
    refetch: refetchInPatientData,
    isError: userErr,
    isSuccess: patientSuccess
  } = useGetPatientListQuery(
    {
      items: itemsPerPage,
      page: currentPage,
      keywords: searchQuery
    },
    {
      enabled: !!searchQuery && !!itemsPerPage
    }
  );

  const {
    data: outPatientList,
    isLoading: outPatientListLoading,
    refetch: refetchOutPatientData,
    isSuccess: outPatientSuccess
  } = useGetOutPatientsListQuery(
    {
      slug: 'out-patient',
      items: itemsPerPage,
      page: currentPage,
      keywords: searchQuery
    },
    {
      enabled: !!searchQuery && !!itemsPerPage
    }
  );

  const [deleteData] = useDeleteApprovedPatientMutation();
  const { data: totalPatient, refetch: totalRefetch } =
    useGetPatientTotalQuery();
  const patientApprovalList = patientApprovalMaster?.data ?? [];
  const InPatientPagination = patientApprovalMaster?.pagination ?? [];
  const patientColumn = patientApprovalMaster?.columns ?? [];
  const approveData = approve?.selectedRow ?? [];
  const patientListData = patientList?.data ?? [];
  const inPatientListPagination = patientList?.pagination ?? [];
  const listColumn = patientList?.columns ?? [];
  const outPatients = outPatientList?.data ?? [];
  const outPatientListPagination = outPatientList?.pagination ?? [];
  const outPatientListColumns = outPatientList?.columns ?? [];
  console.log(outPatientListPagination);
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

  const handleNewPage = (newPage) => {
    setCurrentPage(newPage);
    // setRefetchData(true)
    // setItemsPerPage(prev => prev + 1)
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value);
  };

  const handleExportToPDF = () => {};

  const handleRecordSelection = (e) => {
    setTableRecords(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectedRecordChange = (e) => {
    setTableRecords(e);
  };

  const renderContent = () => {};

  const handleAlertClose = () => {
    setAlertType('');
    setAlertMessage([]);
  };

  const sandali = [
    { date: 'Feb 12', content: 'Test Test' },
    { date: 'Feb 12', content: 'Test Test' },
    { date: 'Feb 12', content: 'Test Test' },
    { date: 'Feb 12', content: 'Test Test' },
    { date: 'Feb 12', content: 'Test Test' },
    { date: 'Feb 12', content: 'Test Test' },
    { date: 'Feb 12', content: 'Test Test' }
  ];
  const handleOnClick = (data) => {
    switch (data.type) {
      case 'backBtn':
        setTimeline((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        break;

      case 'approveBtn':
        setBtnSpinner(true);
        updateBulk({
          actionType: 'updateIsApprove',
          id: data.value.patient_info_id
        })
          .then(() => {
            deleteData({ id: data.value.id });
            setAlertMessage('Approved');
            setAlertType('success');
            patientApprovalRefetch();
            totalRefetch();
          })
          .catch((error) => {
            setAlertMessage('Unsuccessful');
            setAlertType('error');
          })
          .finally(() => {
            setBtnSpinner(false);
          });
        refetchOutPatientData();
        refetchInPatientData();

        break;

      case 'submitRadiology':
        updateBulk({
          actionType: 'updateRadiology',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        radiologyRefetch();
        break;

      case 'rowClicked':
        setTimeline((prev) => ({
          ...prev,
          isShowedForm: true,
          selectedRow: data.value
        }));
        break;

      default:
        break;
    }
  };

  const patientHistory = timeline?.selectedRow?.patient_history ?? [];
  console.log(patientHistory);
  const renderContentBySlug = (table) => {
    switch (table) {
      case 'recent_doctors':
        return (
          <TableContext.Provider
            value={{
              tableData: outPatients,
              tableHeader: outPatientListColumns,
              onClick: (tblBody) => {
                handleOnClick({ type: 'rowClicked', value: tblBody.value });
              },
              isLoading: outPatientListLoading
            }}
          >
            <Table />
          </TableContext.Provider>
        );
      // <Table />
      // </TableContext.Provider>
      // return (
      // <Table
      //     slug={moduleId}
      //     title="User List"
      //     tableData={recentDoctorData}
      //     tableHeader={Object.keys(recentDoctorData[0])}
      //     // isLoading={userListLoading}
      // />
      // )
      //     )

      case 'recent_patients':
        return (
          <TableContext.Provider
            value={{
              tableData: outPatients,
              tableHeader: outPatientListColumns,
              onClick: (tblBody) => {
                handleOnClick({ type: 'rowClicked', value: tblBody.value });
              },
              isLoading: outPatientListLoading
            }}
          >
            <Table />
          </TableContext.Provider>
          // <Table
          //     slug={moduleId}
          //     title="User List"
          //     tableData={recentPatientData}
          //     tableHeader={Object.keys(recentPatientData[0])}
          //     // isLoading={userListLoading}
          // />
        );

      default:
        return null;
    }
  };

  return (
    <AppLayout
      isLoading={moduleListLoading}
      moduleId={moduleId}
      menuGroup={moduleId}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Patients
        </h2>
      }
    >
      <Head>
        <title>Patients</title>
      </Head>

      <div className="container mx-auto">
        <div
          className="relative overflow-x-hidden"
          style={{ height: `${contentHeight}px` }}
        >
          {moduleListLoading ? (
            <SkeletonScreen loadingType="mainPatientModule" />
          ) : (
            <>
              <div
                className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} p-8 pt-[5rem] absolute inset-0`}
                style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
              >
                <div className="flex gap-4">
                  {/* Box 1: Total doctors with approval required */}
                  <div
                    onClick={() => setActiveContent('green')}
                    className="border p-6 rounded shadow-md bg-red-500 text-white cursor-pointer w-full"
                  >
                    <svg
                      className="h-16 w-16 mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                      />
                    </svg>
                    <h2 className="text-xl font-semibold mb-2">
                      Total Doctors
                    </h2>
                    <p className="text-white">Approval Required: 2</p>
                  </div>

                  {/* Box 2: Total patients with want to admin */}
                  <div
                    onClick={() => setActiveContent('black')}
                    className="border p-6 rounded shadow-md bg-yellow-500 text-white cursor-pointer w-full"
                  >
                    <svg
                      className="h-16 w-16 mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                    </svg>
                    <h2 className="text-xl font-semibold mb-2">
                      Total Patients
                    </h2>
                    <p>Want to Admit: {totalPatient}</p>
                  </div>

                  {/* Box 3: Total appointments with approved appointments */}
                  <div className="border p-6 rounded shadow-md bg-blue-500 text-white cursor-pointer w-full">
                    <svg
                      className="h-16 w-16 mb-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z" />
                      <path
                        clipRule="evenodd"
                        fillRule="evenodd"
                        d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                      />
                    </svg>
                    <h2 className="text-xl font-semibold mb-2">
                      Total Appointments
                    </h2>
                    <p>Approved Appointments: [Number]</p>
                  </div>
                </div>

                <div className="flex justify-between py-1">
                  <select
                    className="border border-gray-300 rounded px-4 py-1 mr-4 focus:outline-none text-sm"
                    onChange={handleRecordSelection}
                  >
                    <option value="recent_doctors">Recent Doctors </option>
                    <option value="recent_patients">Recent Patients</option>
                  </select>
                  {console.log(tableRecords)}
                  <SearchExport>
                    <div className="flex items-center">
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          // onChange={e => setSearchQuery(e.target.value)}
                          onChange={(e) => handleSearch(e)}
                          className="border border-gray-300 w-full px-2 py-1 rounded focus:outline-none text-sm flex-grow pl-10"
                          placeholder="Search..."
                        />
                        <svg
                          fill="none"
                          stroke="currentColor"
                          className="mx-2 h-4 w-4 text-gray-600 absolute top-1/2 transform -translate-y-1/2 left-1"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                          />
                        </svg>
                      </div>

                      <Dropdown
                        align="right"
                        width="48"
                        trigger={
                          <button
                            className="border border-gray-300 bg-white rounded px-2 py-1 ml-1 focus:outline-none"
                            aria-labelledby="Export"
                          >
                            <svg
                              fill="none"
                              stroke="currentColor"
                              className="h-5 w-4"
                              strokeWidth={1.5}
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                              />
                            </svg>
                          </button>
                        }
                      >
                        <DropdownExport>Export as PDF</DropdownExport>
                        <DropdownExport>Export as JSON</DropdownExport>
                      </Dropdown>
                    </div>
                  </SearchExport>
                </div>

                <div className="bg-white overflow-hidden border border-gray-300 rounded">
                  {!timeline?.isShowedForm ? (
                    renderContentBySlug(tableRecords)
                  ) : (
                    <>
                      <div className="px-24 py-10 w-full">
                        <div className="grid gap-1 ml-9">
                          <h1 className="text-4xl text-gray-600">{`${timeline?.selectedRow?.user_data_info?.first_name} ${timeline?.selectedRow?.user_data_info?.last_name}`}</h1>
                          <div className="flex">
                            <h1 className="text-lg">
                              {timeline?.selectedRow?.patient_id} |{' '}
                              {
                                timeline?.selectedRow?.user_data_info
                                  ?.birth_date
                              }{' '}
                              | {timeline?.selectedRow?.patient_hrn}
                            </h1>
                          </div>
                        </div>
                        <hr className="w-full mt-6 mb-3" />
                        <div className="px-10 py-5 overflow-auto max-h-56 w-full">
                          {/* <Timeline>
                                                        <Timeline.Item >
                                                            <Timeline.Point className="bg-blue-500"/>
                                                            <Timeline.Content>
                                                            <Timeline.Time className="bg-green-500 text-white py-1 px-3 rounded-lg ml-2">{timeline?.selectedRow?.updated_at}</Timeline.Time>
                                                            <Timeline.Title className="ml-2 text-gray-500 mt-1">{timeline?.selectedRow?.patient_history?.data?.message}</Timeline.Title>
                                                            </Timeline.Content>
                                                        </Timeline.Item>
                                                    </Timeline> */}

                          <ol className="relative border-l border-gray-300">
                            {patientHistory.map((history) => {
                              return (
                                <li key={history.id} className="mb-10 ml-4">
                                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 border border-white"></div>
                                  <time className="bg-green-500 text-white py-1 px-3 rounded-lg ml-2">
                                    {timeline?.selectedRow?.updated_at}
                                  </time>
                                  <h3 className="py-1 px-3 text-lg font-semibold text-gray-900 dark:text-white mt-2">
                                    {history.data.message}
                                  </h3>
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                        <div className="flex justify-center items-center gap-2 w-full">
                          <button
                            onClick={() => handleOnClick({ type: 'backBtn' })}
                            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                          >
                            &larr; Back
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {!timeline?.isShowedForm && (
                  <div className="flex flex-wrap py-2">
                    <div className="flex items-center justify-center flex-grow">
                      <Pagination
                        currentPage={
                          tableRecords === 'recent_doctors'
                            ? outPatientListPagination.current_page
                            : outPatientListPagination.current_page
                        }
                        totalPages={
                          tableRecords === 'recent_doctors'
                            ? outPatientListPagination.total_pages
                            : outPatientListPagination.total_pages
                        }
                        // onPageChange={newPage => setCurrentPage(newPage)}
                        onPageChange={(newPage) => handleNewPage(newPage)}
                      />
                    </div>

                    <ItemPerPage className="flex flex-grow">
                      <div className="flex items-center justify-end">
                        <span className="mr-2 mx-2 text-gray-700">
                          Per Page:
                        </span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => handleItemsPerPageChange(e)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="20">20</option>
                        </select>
                      </div>
                    </ItemPerPage>
                  </div>
                )}
              </div>
              <div
                className={`transition-transform duration-500 ease-in-out ${activeContent === 'green' ? 'translate-y-0' : 'translate-x-full'} p-8 pt-[5rem] absolute inset-0`}
                style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
              >
                <Button
                  paddingY="2"
                  btnIcon="close"
                  onClick={() => setActiveContent('yellow')}
                >
                  Close
                </Button>
              </div>
              <div
                className={`transition-transform duration-500 ease-in-out ${activeContent === 'black' ? 'translate-y-0' : 'translate-x-full'} absolute inset-0 p-8 pt-[5rem]`}
                style={{ height: `100vh`, overflowY: 'auto' }}
              >
                <Button
                  paddingY="2"
                  btnIcon="close"
                  onClick={() => setActiveContent('yellow')}
                >
                  Close
                </Button>
                <div className="mt-10 z-0 relative">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Admitting Clerk
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Admitting Physician
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient Name
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type of Approval
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patientApprovalList.length === 0 ? (
                        <>
                          <td
                            colSpan={patientColumn.length + 1}
                            className="px-6 py-2 text-center"
                          >
                            No records found.
                          </td>
                        </>
                      ) : (
                        patientApprovalList.map((tblBody) => (
                          <tr
                            key={tblBody.id}
                            className="hover:bg-gray-200 cursor-pointer"
                          >
                            <td className="px-6 py-2 whitespace-nowrap text-sm">
                              {tblBody.clerk_data_info?.name}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm">
                              {tblBody.admitting_physician}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm">{`${tblBody.user_data_info?.first_name}, ${tblBody.user_data_info?.middle_name}, ${tblBody.user_data_info?.last_name} `}</td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm">
                              {tblBody.type_approval}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm">
                              {tblBody.is_approved}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm">
                              <Button
                                bgColor={btnSpinner ? 'disable' : 'emerald'}
                                btnIcon={btnSpinner ? 'disable' : 'submit'}
                                btnLoading={btnSpinner}
                                onClick={() =>
                                  handleOnClick({
                                    type: 'approveBtn',
                                    value: tblBody
                                  })
                                }
                              >
                                {btnSpinner ? '' : 'Approve'}
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap py-2">
                  <div className="flex items-center justify-center flex-grow">
                    <Pagination
                      currentPage={InPatientPagination.current_page}
                      totalPages={InPatientPagination.current_page}
                      // onPageChange={newPage => setCurrentPage(newPage)}
                      onPageChange={(newPage) => handleNewPage(newPage)}
                    />
                  </div>

                  <ItemPerPage className="flex flex-grow">
                    <div className="flex items-center justify-end">
                      <span className="mr-2 mx-2 text-gray-700">Per Page:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(e)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                      </select>
                    </div>
                  </ItemPerPage>
                </div>
              </div>
              <div
                className={`transition-transform duration-500 ease-in-out ${activeContent === 'blue' ? 'translate-y-0' : 'translate-x-full'} p-8 pt-[5rem] absolute inset-0`}
                style={{ height: `100vh`, overflowY: 'auto' }}
              >
                <Button
                  paddingY="2"
                  btnIcon="close"
                  onClick={() => handleSubmitButton()}
                >
                  Close
                </Button>
              </div>
            </>
          )}
          {alertMessage && (
            <Alert
              alertType={alertType}
              isOpen={alertType !== ''}
              onClose={handleAlertClose}
              message={alertMessage}
              display="absolute mt-2"
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default withAuth(Patients);
