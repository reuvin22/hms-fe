import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import Head from 'next/head';
import AppLayout from '@/components/Layouts/AppLayout';
import Table from '@/components/Table';
import Form from '@/components/Form';
import Pagination from '@/components/Pagination';
import SearchItemPage from '@/components/SearchItemPage';
import Alert from '@/components/Alert';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import SearchExport from '@/components/SearchExport';
import { BigCalendarContext, FormContext } from '@/utils/context';
import { generateEyeCenterForms } from '@/utils/forms';
import {
  useGetUserListQuery,
  useGetPermissionListQuery,
  useGetModuleListQuery
} from '@/service/settingService';
import { useUpdateBulkMutation } from '@/service/patientService';
import { useGetEyeCenterAppointmentListQuery } from '@/service/settingService';
import SkeletonScreen from '@/components/SkeletonScreen';
import BigCalendar from '@/components/BigCalendar';
import withAuth from './withAuth';
// Hello
// New hello
const styleDropdown = ({ isDisabled = false }) => ({
  control: (provided) => ({
    ...provided,
    // border: '1px solid gray',
    margin: 0,
    padding: 0,
    boxShadow: 'none',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    backgroundColor: isDisabled ? 'rgb(229 231 235)' : 'rgb(243 244 246)',
    '&:hover': {
      borderColor: 'gray',
      border: '1px solid gray'
    },
    '&:focus': {
      border: 'none'
    }
  }),
  input: (provided) => ({
    ...provided,
    inputOutline: 'none'
  })
});

const options = [
  { value: 'red', label: 'Red' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'lime', label: 'Lime' },
  { value: 'green', label: 'Green' },
  { value: 'teal', label: 'Teal' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'blue', label: 'Blue' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'violet', label: 'Violet' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' }
];

function EyeCenter() {
  const moduleId = 'eye-center';
  const menuGroup = 'dashboard';

  const formRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContent, setActiveContent] = useState('yellow');
  const [isOptionDisabled, setIsOptionDisabled] = useState(true);
  const [isOptionEditDisabled, setIsOptionEditDisabled] = useState(true);
  const [contentType, setContentType] = useState('');
  const [contentHeight, setContentHeight] = useState(0);
  const [btnSpinner, setBtnSpinner] = useState(true);
  const [data, setData] = useState(null);
  // const [totalPages, setTotalPages] = useState(0)
  console.log(data);
  const { isLoading: moduleListLoading } = useGetModuleListQuery();
  const { data: calendarList, refetch: refetchCalendarList } =
    useGetEyeCenterAppointmentListQuery();
  const [updateBulk] = useUpdateBulkMutation();

  const formatTitlePages = (str) =>
    str
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

  useEffect(() => {
    if (moduleId) {
      setPageTitle(formatTitlePages(moduleId));
    }

    console.log('Hello World');

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

    // if (userSuccess && Array.isArray(userData) && userData.length > 0) {
    //   const headers = Object.keys(userData[0]);
    //   setTableHeader(headers);
    // }

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
  }, [btnSpinner, moduleId]);

  const handleSearch = (q) => {
    setSearchQuery(q);
  };

  const handleNewPage = (newPage) => {
    setCurrentPage(newPage);
    // setRefetchData(true)
    // setItemsPerPage(prev => prev + 1)
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (item) => {
    setItemsPerPage(item);
  };

  const handleExportToPDF = () => {};

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRefetch = () => {
    refetchCalendarList();
  };

  const handleAlertClose = () => {
    setAlertType('');
    setAlertMessage([]);
  };

  const handleMedCategory = () => {};

  const handleOnChange = (type, e) => {
    switch (type) {
      case 'itemsPerPage':
        // setItemsPerPage(e.target.value)
        break;

      case 'search':
        setSearchQuery(e.target.value);

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
        formRef.current.handleSubmit('createEyeCenterAppointment');
        break;

      case 'updateEyeCenter':
        updateBulk({
          actionType: 'updateEyeCenterAppointment',
          data: data,
          id: data.id
        });
        refetchCalendarList();
        setContentType('');
        break;

      case 'closeDrawer':
        setActiveContent('yellow');
        // setProfileData([])
        break;

      case 'editUserBtn':
        // setProfileData(data);
        // setActiveContent('green');
        setContentType('editUser');
        setData(data);
        console.log(data);
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
          className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`}
          style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
        >
          <div className="font-medium text-xl mb-2 text-gray-600">
            Eye Center
          </div>
          <div className="flex justify-between py-1">
            <div className="flex space-x-1">
              <Button
                bgColor=""
                btnIcon=""
                onClick={() => {
                  setActiveContent('green');
                  setContentType('addAppointment');
                }}
              >
                New Appointment
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
            <BigCalendarContext.Provider
              value={{
                calendarData: calendarList,
                onClick: (type, data) => handleOnclick(type, data),
                onEdit: (data) => handleOnEdit(data)
              }}
            >
              {contentType === '' && <BigCalendar />}

              {contentType === 'editUser' && (
                <div className="px-56 py-10">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Patient Name:
                    </label>
                    <input
                      type="text"
                      name="patient_name"
                      className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                      value={data?.patient_name}
                      onChange={(selectedOption) => {
                        setData({
                          ...data,
                          patient_name: selectedOption.target.value
                        });
                      }}
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      Doctors Agenda:
                    </label>
                    <input
                      type="text"
                      name="doctors_agenda"
                      className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                      value={data?.doctors_agenda}
                      onChange={(selectedOption) => {
                        setData({
                          ...data,
                          doctors_agenda: selectedOption.target.value
                        });
                      }}
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      Appointment Date:
                    </label>
                    <input
                      type="datetime-local"
                      name="appointment_date"
                      className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                      value={data?.appointment_date}
                      onChange={(selectedOption) => {
                        setData({
                          ...data,
                          appointment_date: selectedOption.target.value
                        });
                      }}
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      Appointment Color:
                    </label>
                    <Select
                      options={options.map((option) => ({
                        value: option.value,
                        label: option.label
                      }))}
                      onChange={(selectedOption) => {
                        setData({
                          ...data,
                          appointment_color: selectedOption.value
                        });
                      }}
                      isSearchable
                      isClearable
                      placeholder="Select Color"
                      classNamePrefix="react-select"
                      styles={styleDropdown({ isDisabled: false })}
                      value={
                        options.find(
                          (option) => option.value === data?.appointment_color
                        ) || null
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setContentType('')}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                      &larr; Back
                    </button>
                    <button
                      onClick={() => handleOnclick('updateEyeCenter', data)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    >
                      Update
                    </button>
                  </div>
                </div>
              )}
            </BigCalendarContext.Provider>

            {/* <TableContext.Provider
              value={{
                tableData: null,
                tableHeader: null,
                onChecked: () => {},
                onClick: () => {},
                onEdit: () => {}
              }}
            >
              <Table />
            </TableContext.Provider> */}
          </div>
        </div>
        <div
          className={`transition-transform duration-500 ease-in-out ${activeContent === 'green' ? 'translate-y-0' : 'translate-x-full'} absolute inset-0 p-8 pt-[5rem]`}
          style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
        >
          {contentType === 'addAppointment' && (
            <div>
              <div className="flex justify-between py-2 px-4">
                <Button
                  paddingY="1"
                  btnIcon="close"
                  // onClick={() => setActiveContent("yellow")}
                  onClick={() => {
                    handleOnclick('closeDrawer');
                    setContentType('');
                  }}
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
                  title: 'Add Appointment',
                  ref: formRef,
                  initialFields: generateEyeCenterForms(calendarList),
                  enableAutoSave: false,
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
            </div>
          )}
        </div>
      </div>
    );

  return (
    <AppLayout moduleId={moduleId} menuGroup={menuGroup}>
      <Head>
        <title>{pageTitle}</title>
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

export default withAuth(EyeCenter);
