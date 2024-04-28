import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import {
  useGetUserListQuery,
  useGetPermissionListQuery,
  useGetModuleListQuery,
  useGetDesignationListQuery
} from '@/service/settingService';

import {
  useGetUserDetailsQuery,
  useGetUserByIdQuery,
  useGetGrantModuleQuery,
  useGetUserById
} from '@/service/authService';

import AppLayout from '@/components/Layouts/AppLayout';
import Table from '@/components/Table';
import Form from '@/components/Form';
import Card from '@/components/Card';
import Alert from '@/components/Alert';
import Pagination from '@/components/Pagination';
import SearchItemPage from '@/components/SearchItemPage';
import Modal from '@/components/Modal';
import ProfileInformation from '@/components/ProfileInformation';
import Button from '@/components/Button';
import ItemPerPage from '@/components/ItemPerPage';
import Dropdown from '@/components/Dropdown';
import SearchExport from '@/components/SearchExport';
import SkeletonScreen from '@/components/SkeletonScreen';
import { DropdownExport } from '@/components/DropdownLink';
import UserProfile from '@/components/UserProfile';
import { userRegistration } from '@/utils/forms';
import { FormContext, TableContext } from '@/utils/context';
import withAuth from './withAuth';

function Setting() {
  const moduleId = 'settings';
  const menuGroup = 'settings';
  const formRef = useRef(null);
  const [modalId, setModalId] = useState('');
  const [tableHeader, setTableHeader] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [activeContent, setActiveContent] = useState('yellow');
  const [refetchData, setRefetchData] = useState(false);
  const [reInitFields, setReIinitFields] = useState(true);
  const [btnSpinner, setBtnSpinner] = useState(true);
  const [isOptionDisabled, setIsOptionDisabled] = useState(true);
  const [isOptionEditDisabled, setIsOptionEditDisabled] = useState(true);
  const [highlightedRows, setHighlightedRows] = useState(new Set());
  const [contentType, setContentType] = useState('');
  const [profileData, setProfileData] = useState({});
  const [checkIds, setCheckIds] = useState(0);
  const [pageTitle, setPageTitle] = useState('');

  const [contentHeight, setContentHeight] = useState(0);

  // const {
  //     data: permission,
  //     isLoading: permissionListLoading,
  //     isError: permissionErr
  // } = useGetPermissionListQuery()

  const { data: designationList } = useGetDesignationListQuery();
  // console.log(designationList)
  const { data: moduleList, isLoading: moduleListLoading } =
    useGetModuleListQuery();
  const {
    data: userList,
    isLoading: userListLoading,
    isError: userErr,
    error,
    isSuccess: userSuccess
  } = useGetUserListQuery(
    {
      items: itemsPerPage,
      page: currentPage,
      keywords: searchQuery
    },
    {
      enabled: !!searchQuery
    }
  );

  const { data: profileDetails } = useGetUserByIdQuery(
    {
      user_id: profileData?.user_id || checkIds
    },
    {
      enabled: !!profileData?.user_id
    }
  );

  const { data: moduleMaster, refetch: refetchModules } =
    useGetGrantModuleQuery(
      {
        user_id: checkIds
      },
      {
        enabled: !!checkIds
      }
    );

  const initModule = moduleMaster?.module.reduce((acc, module) => {
    acc[module.module_id] = module.isToggled;
    return acc;
  }, {});

  // console.log(initModule)

  const {
    data: userDetails,
    isError: dataError,
    refetch: refetchUserDetails
  } = useGetUserDetailsQuery();

  const userData = userList?.data ?? [];
  const pagination = userList?.pagination ?? [];
  // const permissionData = permission?.permission ?? []
  const moduleData = moduleList?.moduleList ?? [];
  // const userInfo = userDetails?.data[0] ?? []
  const header = userList?.columns ?? [];
  const hiddenUserIds = ['IMO-9999999999', 'QSO-2402082YXW'];
  const filteredUserData = userData.filter(
    (user) => !hiddenUserIds.includes(user.user_id)
  );

  const isRowNew = (createdAt) => {
    const rowDate = new Date(createdAt);
    const now = new Date();
    return (now - rowDate) / 1000 <= 5;
  };

  const formatTitlePages = (str) =>
    str
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

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

  useEffect(() => {
    // const newRows = new Set()

    // userData.forEach((row, index) => {
    //     if(isRowNew(row.created_at)) {
    //         newRows.add(index)
    //     }
    // })

    // setHighlightedRows(newRows)

    // console.log(highlightedRows)

    // const highlightTimeout = setTimeout(() => {
    //     setHighlightedRows(new Set())
    // }, 2000) //clear the highlights after .5milliseconds

    if (userSuccess && Array.isArray(userData) && userData.length > 0) {
      const headers = Object.keys(userData[0]);
      setTableHeader(headers);
    }

    let spinnerTimer;
    if (btnSpinner) {
      spinnerTimer = setTimeout(() => {
        setBtnSpinner(false);
      }, 1000);
    }

    if (moduleId) {
      setPageTitle(formatTitlePages(moduleId));
    }

    return () => {
      if (spinnerTimer) {
        clearTimeout(spinnerTimer);
      }
      // clearTimeout(highlightTimeout)
    };
  }, [userSuccess, btnSpinner, moduleId]);

  const handleNewPage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleExportToPDF = () => {};

  const handleRefetch = () => {
    setItemsPerPage((prev) => prev + 1);
  };

  const handleOnChecked = (data) => {
    setIsOptionEditDisabled(data.length > 1);
    setIsOptionDisabled(data.length === 0);
  };

  const handleOnchange = (type, e) => {
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

  const handleOnclose = (type) => {
    switch (type) {
      case 'closeAlert':
        setAlertType('');
        setAlertMessage([]);
        break;

      case 'closeModal':
        setIsModalOpen(false);
        break;

      default:
        break;
    }
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

  const renderContent = () => (
    <>
      <div
        className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 pr-[6rem] pl-[6rem] pt-[5rem]`}
        style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
      >
        <div className="flex justify-between py-1">
          <div className="flex space-x-1">
            <Button
              bgColor=""
              btnIcon="user"
              onClick={() => {
                setActiveContent('green');
                setContentType('addUser');
              }}
            >
              New User
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
                  onChange={(e) => handleOnchange('search', e)}
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
                <DropdownExport>Export as PDF</DropdownExport>
                <DropdownExport>Export as JSON</DropdownExport>
              </Dropdown>
            </div>
          </SearchExport>
        </div>

        <div className="border border-gray-300 rounded">
          <TableContext.Provider
            value={{
              tableData: filteredUserData,
              tableHeader: header,
              onChecked: (data) => handleOnChecked(data),
              onClick: (data) => handleOnclick('clickedRows', data),
              onEdit: (id) => setCheckIds(id)
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
              onPageChange={(newPage) => handleNewPage(newPage)}
            />
          </div>

          <ItemPerPage className="flex flex-grow">
            <div className="flex items-center justify-end">
              <span className="mr-2 mx-2 text-gray-700 text-sm">Per Page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleOnchange('itemsPerPage', e)}
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
        {contentType === 'addUser' && (
          <div>
            <div className="flex justify-between py-2 px-4">
              <Button
                paddingY="1"
                btnIcon="close"
                // onClick={() => setActiveContent("yellow")}
                onClick={() => handleOnclick('closeDrawer')}
              >
                Close
              </Button>

              <div className="flex gap-2">
                <Button
                  bgColor="indigo"
                  btnIcon="add"
                  onClick={() => handleOnclick('addRowBtn')}
                >
                  Add Row
                </Button>

                <Button
                  bgColor={btnSpinner ? 'disable' : 'emerald'}
                  btnIcon={btnSpinner ? 'disable' : 'submit'}
                  btnLoading={btnSpinner}
                  onClick={() => handleOnclick('addUserBtn')}
                >
                  {btnSpinner ? '' : 'Submit'}
                </Button>
              </div>
            </div>

            <FormContext.Provider
              value={{
                title: 'Add User',
                state: {
                  userDetails
                },
                ref: formRef,
                initialFields: userRegistration(designationList),
                enableAutoSave: false,
                enableAddRow: true,
                onSuccess: handleRefetch,
                onCloseSlider: () => setActiveContent('yellow'),
                onLoading: (data) => setBtnSpinner(data),
                onSetAlertType: (data) => setAlertType(data),
                onSetAlertMessage: (data) => setAlertMessage(data)
              }}
            >
              <Form />
            </FormContext.Provider>
          </div>
        )}

        {contentType === 'editUser' && (
          <div>
            <Button
              paddingY="1"
              btnIcon="close"
              onClick={() => handleOnclick('closeDrawer')}
            >
              Close
            </Button>

            <UserProfile
              data={profileDetails?.user[0]}
              type="edit"
              module={moduleMaster}
              permission={initModule}
              onRefetch={refetchModules}
            />
          </div>
        )}

        {contentType === 'viewUser' && (
          <div>
            <Button
              paddingY="1"
              btnIcon="close"
              onClick={() => handleOnclick('closeDrawer')}
            >
              Close
            </Button>

            <UserProfile data={profileDetails?.user[0]} type="view" />
          </div>
        )}
      </div>
    </>
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
        {alertMessage && (
          <Alert
            alertType={alertType}
            isOpen={alertType !== ''}
            onClose={() => handleOnclose('closeAlert')}
            message={alertMessage}
          />
        )}

        <Modal
          // title={title}
          openId={modalId}
          slug={moduleId}
          isOpen={isModalOpen}
          initialFields={userRegistration}
          addUserBtn
          onClose={() => handleOnclose('closeModal')}
          onSuccess={handleRefetch}
          onSetAlertType={(data) => setAlertType(data)}
          onSetAlertMessage={(data) => setAlertMessage(data)}
          // permission={permission}
          // selectedRowId={selectedRows}
        />
        {['x', 'superadmin'].includes(userDetails?.roles) && renderContent()}

        {['admin', 'user', 'nurse', 'doctor'].includes(userDetails?.roles) && (
          <ProfileInformation information={userDetails} />
        )}
      </div>
    </AppLayout>
  );
}

export default withAuth(Setting);
