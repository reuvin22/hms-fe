import { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/Layouts/AppLayout';
import Cookies from 'js-cookie';
import {
  useGetUserListQuery,
  useGetPermissionListQuery,
  useGetModuleListQuery
} from '@/service/settingService';

import {
  useGetErPatientListQuery,
  useGetPhysicianListQuery,
  useGetActiveBedListQuery
} from '@/service/patientService';

import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import SearchExport from '@/components/SearchExport';
import Table from '@/components/Table';
import { FormContext, TableContext } from '@/utils/context';
import SkeletonScreen from '@/components/SkeletonScreen';
import Pagination from '@/components/Pagination';
import ItemPerPage from '@/components/ItemPerPage';
import { generateErForms } from '@/utils/forms';
import Form from '@/components/Form';
import withAuth from './withAuth';

const erdata = [
  {
    user_id: 'QSO-123979',
    time_in: '1440',
    patient_name: 'John Doe',
    age: 27,
    gender: 'Male',
    chief_complain: 'Cough',
    patient_number: 'HRN-1283020',
    bed: 2
  }
];

const erForm = [];

function EmergencyRoom() {
  const formRef = useRef(null);
  const menuGroup = 'dashboard';
  const moduleId = 'emergency-room';
  const authToken = Cookies.get('token');
  const [contentHeight, setContentHeight] = useState(0);
  const [pageTitle, setPageTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContent, setActiveContent] = useState('yellow');
  const [isOptionDisabled, setIsOptionDisabled] = useState(true);
  const [isOptionEditDisabled, setIsOptionEditDisabled] = useState(true);
  const [contentType, setContentType] = useState('');
  const [profileData, setProfileData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [checkIds, setCheckIds] = useState(0);
  const [erForms, setErForms] = useState([]);
  const [btnSpinner, setBtnSpinner] = useState(false);

  const {
    isLoading: moduleListLoading,
    refetch: refetchModules,
    isError,
    isSuccess
  } = useGetModuleListQuery();

  const {
    data: patientList,
    isLoading: patientListLoading,
    refetch: refetchPatientData
  } = useGetErPatientListQuery(
    {
      slug: 'emergency-room',
      items: itemsPerPage,
      page: currentPage,
      keywords: searchQuery
    },
    {
      enabled: !!searchQuery && !!itemsPerPage
    }
  );

  const { data: physicianList } = useGetPhysicianListQuery();

  const { data: activeBedList } = useGetActiveBedListQuery();

  const { patientData, pagination, header } = useMemo(() => {
    const data = patientList?.data ?? [];
    const paginationInfo = patientList?.pagination ?? [];
    const headers = patientList?.columns ?? [];

    return {
      patientData: data,
      pagination: paginationInfo,
      header: headers
    };
  }, [patientList]);

  console.log(header);

  const formatTitlePages = (str) =>
    str
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

  useEffect(() => {
    if (moduleId) {
      setPageTitle(formatTitlePages(moduleId));
    }

    if (physicianList && activeBedList) {
      const ipd = generateErForms(physicianList, activeBedList);
      setErForms(ipd);
    }

    let spinnerTimer;
    if (btnSpinner) {
      spinnerTimer = setTimeout(() => {
        setBtnSpinner(false);
      }, 500);
    }

    const calculateHeight = () => {
      const windowHeight = window.innerHeight;
      setContentHeight(windowHeight);
    };
    calculateHeight();

    // Recalculate height on window resize
    window.addEventListener('resize', calculateHeight);
    return () => {
      if (spinnerTimer) {
        clearTimeout(spinnerTimer);
      }
      window.removeEventListener('resize', calculateHeight);
    };
  }, [btnSpinner, physicianList, activeBedList]);

  const handleOnChecked = (data) => {
    setIsOptionEditDisabled(data.length > 1);
    setIsOptionDisabled(data.length === 0);
  };

  const handleOnChange = (type, e) => {
    switch (type) {
      case 'itemsPerPage':
        setItemsPerPage(e.target.value);
        break;

      case 'search':
        setSearchQuery(e.target.value);

      default:
        break;
    }
  };

  const handleOnEdit = (data) => {
    setCheckIds(data);
  };

  const handleCheckPatient = (data) => {
    if (data.checked) {
      setProfileData(data.data);
    } else {
      setProfileData([]);
    }
  };

  const handleRefetch = () => {
    setItemsPerPage((prev) => prev + 1);
  };

  const handleOnClick = (type, data) => {
    switch (type) {
      case 'addRowBtn':
        formRef.current.handleAddRow();
        break;

      case 'addUserBtn':
        formRef.current.handleSubmit('createUser');
        break;

      case 'closeDrawer':
        setActiveContent('yellow');
        // setProfileData([])
        break;

      case 'editUserBtn':
        setProfileData(data);
        setActiveContent('green');
        setContentType('editUser');
        break;

      case 'clickedRows':
        setProfileData(data);
        setActiveContent('green');
        setContentType('viewUser');
        break;

      default:
        break;
    }
  };

  const renderContent = () =>
    moduleListLoading ? (
      <SkeletonScreen loadingType="table" />
    ) : (
      <div>
        <div
          className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 pr-[6rem] pl-[6rem] pt-[5rem]`}
          style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
        >
          <div className="font-medium text-xl mb-2 text-gray-600">
            Emergency Room
          </div>
          <div className="flex justify-between py-1">
            <div className="flex space-x-1">
              <Button
                bgColor=""
                btnIcon="user"
                onClick={() => {
                  setActiveContent('green');
                  setContentType('addEr');
                }}
              >
                Add
              </Button>

              <Dropdown
                align="left"
                width="48"
                trigger={
                  <button
                    onClick=""
                    className={`${
                      isOptionDisabled
                        ? 'bg-gray-300'
                        : 'bg-indigo-500 hover:bg-indigo-600'
                    } flex items-center text-white text-sm px-2 gap-2 rounded focus:outline-none`}
                    disabled={isOptionDisabled}
                  >
                    <svg
                      dataSlot="icon"
                      fill="none"
                      className="h-4 w-4"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      />
                    </svg>
                    Options
                  </button>
                }
              >
                <button
                  onClick={() => handleOnClick('editUserBtn')}
                  className={`${isOptionEditDisabled ? 'cursor-not-allowed' : 'cursor-pointer'} w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out`}
                  disabled={isOptionEditDisabled}
                >
                  Edit
                </button>
                <button className="w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
                  Delete
                </button>
              </Dropdown>
            </div>

            <SearchExport>
              <div className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    // onChange={e => setSearchQuery(e.target.value)}
                    onChange={(e) => handleOnChange('search', e)}
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
                      className="border h-8 border-gray-300 bg-white rounded px-2 py-1 ml-1 focus:outline-none"
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
                  <button
                    className="cursor-not-allowed w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
                    disabled
                  >
                    Export as PDF
                  </button>
                  <button
                    className="cursor-not-allowed w-full text-left block px-4 py-1 font-medium text-xs leading-5 text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
                    disabled
                  >
                    Export as PDF
                  </button>
                </Dropdown>
              </div>
            </SearchExport>
          </div>

          <div className="border border-gray-300 rounded">
            <TableContext.Provider
              value={{
                tableData: patientData,
                tableHeader: header,
                onChecked: handleOnChecked,
                onClick: handleOnClick,
                onEdit: handleOnEdit,
                onCheckPatient: handleCheckPatient
                // onChecked: (data) => handleOnChecked(data),
                // onClick: (data) => handleOnClick('clickedRows', data),
                // onEdit: (id) => setCheckIds(id)
              }}
            >
              <Table />
            </TableContext.Provider>
          </div>

          <div className="flex flex-wrap py-1">
            <div className="flex items-center justify-center flex-grow">
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.total_pages}
                // onPageChange={newPage => setCurrentPage(newPage)}
                onPageChange={(newPage) =>
                  handleOnChange({ type: 'newPage', value: newPage })
                }
              />
            </div>

            <ItemPerPage className="flex flex-grow">
              <div className="flex items-center justify-end">
                <span className="mr-2 mx-2 text-gray-500 uppercase font-medium text-xs">
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
        </div>
        <div
          className={`transition-transform duration-500 ease-in-out ${activeContent === 'green' ? 'translate-y-0' : 'translate-x-full'} absolute inset-0 pr-[6rem] pl-[6rem] pt-[5rem]`}
          style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
        >
          {contentType === 'addEr' && (
            <>
              <div className="font-bold text-lg mb-2 uppercase text-gray-600 pt-10 px-4">
                Add Patient
              </div>
              <div className="flex justify-between py-2 px-4">
                <Button
                  paddingY="1"
                  btnIcon="close"
                  // onClick={() => setActiveContent("yellow")}
                  onClick={() => handleOnClick('closeDrawer')}
                >
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button
                    bgColor="indigo"
                    btnIcon="add"
                    onClick={() => formRef.current.handleAddRow()}
                  >
                    Add Row
                  </Button>

                  <Button
                    bgColor={btnSpinner ? 'disable' : 'emerald'}
                    btnIcon={btnSpinner ? 'disable' : 'submit'}
                    btnLoading={btnSpinner}
                    onClick={() => handleSubmitButton(slug)}
                  >
                    {btnSpinner ? '' : 'Submit'}
                  </Button>
                </div>
              </div>

              <FormContext.Provider
                value={{
                  ref: formRef,
                  initialFields: erForms,
                  enableAddRow: true,
                  onSuccess: handleRefetch,
                  onLoading: (data) => setBtnSpinner(data),
                  onSetAlertType: (data) => setAlertType(data),
                  onCloseSlider: () => setActiveContent('yellow'),
                  onAlert: (data) => {
                    setAlertMessage(data.msg);
                    setAlertType(data.type);
                  }
                }}
              >
                <Form />
              </FormContext.Provider>
            </>
          )}

          {contentType === 'viewUser' && (
            <div>
              <Button
                paddingY="1"
                btnIcon="close"
                onClick={() => handleOnClick('closeDrawer')}
              >
                Close
              </Button>

              {/* <UserProfile 
                                data={profileDetails?.user[0]}
                                type="view"
                            /> */}
            </div>
          )}
        </div>
      </div>
    );

  return (
    <AppLayout
      isLoading={moduleListLoading}
      moduleId={moduleId}
      menuGroup={menuGroup}
    >
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <div
        className="relative overflow-x-hidden"
        style={{ height: `${contentHeight}px` }}
      >
        {renderContent()}
      </div>
    </AppLayout>
  );
}

export default withAuth(EmergencyRoom);
