import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import AppLayout from '@/components/Layouts/AppLayout';
import Cookies from 'js-cookie';
import Table from '@/components/Table';
import Alert from '@/components/Alert';
import Pagination from '@/components/Pagination';
import ItemPerPage from '@/components/ItemPerPage';
import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import SearchExport from '@/components/SearchExport';
import {
  useGetUserListQuery,
  useGetPermissionListQuery,
  useGetModuleListQuery
} from '@/service/settingService';
import {
  useGetImgResultListQuery,
  useGetPersonalInformationListQuery
} from '@/service/patientService';
import SkeletonScreen from '@/components/SkeletonScreen';
import { FormContext, TableContext } from '@/utils/context';
import withAuth from './withAuth';

function Imaging() {
  const moduleId = 'imaging';
  const menuGroup = 'dashboard';
  const formRef = useRef(null);
  const authToken = Cookies.get('token');
  const [contentHeight, setContentHeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContent, setActiveContent] = useState('yellow');
  const [isOptionDisabled, setIsOptionDisabled] = useState(true);
  const [isOptionEditDisabled, setIsOptionEditDisabled] = useState(true);
  const [contentType, setContentType] = useState('');
  const [btnSpinner, setBtnSpinner] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [data, setData] = useState(null);

  console.log(profileData);

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

  const patientId = ['QSO4322I', 'JG87QW5A', 'K4Y7S9I8', 'Z9X3D1H5'];

  const {
    data: imgResultList,
    isLoading: userListLoading,
    isError: userErr,
    error,
    isSuccess: userSuccess
  } = useGetImgResultListQuery(
    {
      slug: 'imaging-result-list',
      items: itemsPerPage,
      page: currentPage
    },
    {
      enabled: !!searchQuery
    }
  );

  const imgResultData = imgResultList?.data ?? [];
  console.log(imgResultList);
  const pagination = imgResultList?.pagination ?? [];
  const header = imgResultList?.columns ?? [];

  const { data: personalInfoList } = useGetPersonalInformationListQuery();

  console.log(personalInfoList);

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

  const handleAlertClose = () => {
    setAlertType('');
    setAlertMessage([]);
  };

  const handleOnclick = (type, data) => {
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
        setProfileData(data.value);
        setData(data.value);
        setActiveContent('green');
        setContentType('editUser');
        break;

      case 'clickedRows':
        setProfileData(data.value);
        setActiveContent('green');
        setContentType('viewUser');
        break;

      default:
        break;
    }
  };

  console.log(data);

  const renderContent = () =>
    moduleListLoading ? (
      <SkeletonScreen loadingType="table" />
    ) : (
      <div>
        <div
          className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`}
          style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
        >
          <div className="font-medium text-xl mb-2 text-gray-600">
            Radiology
          </div>
          <div className="flex justify-between py-1">
            <div className="flex space-x-1">
              <Button
                bgColor="disable"
                btnIcon=""
                onClick={() => {
                  setActiveContent('green');
                  setContentType('addPatient');
                }}
                btnLoading={true}
              >
                Add Patient
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
                  onClick={() => handleOnclick('editUserBtn')}
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
                tableData: imgResultData,
                tableHeader: header,
                onChecked: () => {},
                onClick: (data) => handleOnclick('editUserBtn', data),
                onEdit: () => {}
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
          className={`transition-transform duration-500 ease-in-out ${activeContent === 'green' ? 'translate-y-0' : 'translate-x-full'} absolute inset-0 p-8 pt-[5rem]`}
          style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
        >
          {contentType === 'editUser' && (
            <div className="grid">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600 font-medium text-[2.5rem]">{`${personalInfoList?.find((info) => info.personal_id === profileData.patient_id)?.first_name} ${personalInfoList?.find((info) => info.personal_id === profileData.patient_id)?.last_name}`}</p>
                <div>
                  <Button
                    paddingY="1"
                    btnIcon="close"
                    onClick={() => handleOnclick('closeDrawer')}
                  >
                    Close
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="border border-gray-300 rounded h-[500px] px-12 py-10">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Test Name:
                    </label>
                    <input
                      type="text"
                      name="test_name"
                      className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                      value={data?.test_name}
                      onChange={(selectedOption) => {
                        setData({
                          ...data,
                          test_name: selectedOption.target.value
                        });
                      }}
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      Comparison:
                    </label>
                    <input
                      type="text"
                      name="comparison"
                      className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                      value={data?.comparison}
                      onChange={(selectedOption) => {
                        setData({
                          ...data,
                          comparison: selectedOption.target.value
                        });
                      }}
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      Indication:
                    </label>
                    <input
                      type="text"
                      name="indication"
                      className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                      value={data?.indication}
                      onChange={(selectedOption) => {
                        setData({
                          ...data,
                          indication: selectedOption.target.value
                        });
                      }}
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      Findings:
                    </label>
                    <input
                      type="text"
                      name="findings"
                      className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                      value={data?.findings}
                      onChange={(selectedOption) => {
                        setData({
                          ...data,
                          findings: selectedOption.target.value
                        });
                      }}
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      Impressions:
                    </label>
                    <input
                      type="text"
                      name="impressions"
                      className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                      value={data?.impressions}
                      onChange={(selectedOption) => {
                        setData({
                          ...data,
                          impressions: selectedOption.target.value
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleOnclick('updatePatientImgResult', data)
                      }
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                  </div>
                </div>

                <div className="border-dashed border-2 border-gray-300 flex items-center justify-center rounded h-[500px]">
                  <p className="font-semibold text-gray-600">
                    DRAG IMAGE OR UPLOAD
                  </p>
                </div>
              </div>
              {/* <UserProfile data={profileDetails?.user[0]} type="view" /> */}
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
        <title>Radiology</title>
      </Head>

      <div className="container mx-auto">
        <div
          className="relative overflow-x-hidden"
          style={{ height: `${contentHeight}px` }}
        >
          {alertMessage && (
            <Alert
              alertType={alertType}
              isOpen={alertType !== ''}
              onClose={handleAlertClose}
              message={alertMessage}
            />
          )}

          {renderContent()}
        </div>
      </div>
    </AppLayout>
  );
}

export default withAuth(Imaging);
