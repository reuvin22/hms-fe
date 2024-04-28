import React, { useState, useEffect, useReducer, useRef } from 'react';
import { FormContext } from '@/utils/context';
import { useGetSymptomListQuery } from '@/service/patientService';
import { useUpdateBulkMutation } from '@/service/settingService';
import SearchItemPage from '../SearchItemPage';
import Modal from '../Modal';
import Table from '../Table';
import Button from '../Button';
import SearchExport from '../SearchExport';
import Dropdown from '../Dropdown';
import { DropdownExport } from '../DropdownLink';
import Pagination from '../Pagination';
import ItemPerPage from '../ItemPerPage';
import Form from '../Form';
import { TableContext } from '@/utils/context';

const symptomsHead = [
  { symptoms_head: 'Allergy', symptoms_type: '', symptoms_description: '' }
];

const symptomsType = [{ symptoms_head: 'Allergy' }];

const renderModalContentByTab = (tab) => {
  switch (tab) {
    case 'tab1':
      return (
        <div className="w-80">
          <div className="flex flex-col w-full mb-4">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Symptoms Head
            </label>
            <input
              type="text"
              placeholder="Enter symptoms"
              className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col w-full mb-4">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Symptoms Type
            </label>
            <select
              name=""
              value=""
              onChange={(e) => handleInputChange(e, rowIndex, field.name)}
              className="border border-gray-300  w-full px-3 py-2 focus:outline-none"
            >
              <option value="">Select option</option>
              <option value="">Test</option>
            </select>
          </div>

          <div className="flex flex-col w-full">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Description
            </label>
            <textarea
              type="text"
              placeholder="Enter description"
              className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>
      );

    case 'tab2':
      return (
        <div className="w-80">
          <div className="flex flex-col w-full">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Symptoms Type
            </label>
            <input
              type="text"
              placeholder="Enter charge type"
              className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};

const renderTableContentByTab = (tab) => {
  switch (tab) {
    case 'tab1':
      return (
        <Table
          title="User List"
          tableData={symptomsHead}
          action={false}
          tableHeader={Object.keys(symptomsHead[0])}
          // isLoading={userListLoading}
        />
      );

    case 'tab2':
      return (
        <Table
          title="User List"
          tableData={symptomsType}
          action={false}
          tableHeader={Object.keys(symptomsType[0])}
          // isLoading={userListLoading}
        />
      );

    default:
      return null;
  }
};

function Symptoms({ slug }) {
  const [activeTab, setActiveTab] = useState('tab1');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeContent, setActiveContent] = useState('yellow');
  const [btnSpinner, setBtnSpinner] = useState(false);
  const formRef = useRef(null);
  const [state, setState] = useState({
    isShowedForm: false,
    selectedRow: null
  });
  const [updateBulk, { isLoading: updateBulkLoading }] =
    useUpdateBulkMutation();
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const {
    data: symptomsList,
    isLoading: symptomsLoading,
    isError: symptomsError,
    isSuccess: symptomsSuccess,
    refetch: symptomRefetch
  } = useGetSymptomListQuery(
    {
      items: itemsPerPage,
      tabs: activeTab,
      page: currentPage
    },
    {
      enabled: !!activeTab
    }
  );

  const symptomsListMaster = symptomsList?.data ?? [];
  const pagination = symptomsList?.pagination ?? [];
  const header = symptomsList?.columns ?? [];

  const symptoms = [
    {
      name: 'name',
      type: 'text',
      label: 'Symptoms Name',
      placeholder: 'Enter Symptoms'
    },
    {
      name: 'code',
      type: 'text',
      label: 'Code',
      label: 'Symptoms Code',
      placeholder: 'Enter Code'
    }
  ];
  const handleAlertClose = () => {
    setAlertType('');
    setAlertMessage([]);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value);
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const handleNewPage = (newPage) => {
    setCurrentPage(newPage);
    // setRefetchData(true)
    // setItemsPerPage(prev => prev + 1)
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
  };

  const handleExportToPDF = () => {};

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
    console.log(tab);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRefetch = () => {
    setItemsPerPage((prev) => prev + 1);
  };

  const handleSubmitButton = (tabs) => {
    if (tabs === 'tab1') {
      formRef.current.handleSubmit('createSymptom');
    }
  };

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

  const handleTab = (tab) => {
    setActiveTab(tab);
    setState((prevState) => ({
      ...prevState,
      isShowedForm: false
    }));
  };

  const handleInput = (e) => {
    const { value, name } = e.target;
    setState((prev) => ({
      ...prev,
      selectedRow: {
        ...prev.selectedRow,
        [name]: value
      }
    }));
  };

  const handleOnClick = (data) => {
    switch (data.type) {
      case 'tabClicked':
        setActiveTab(data.value);
        break;
      case 'rowClicked':
        setState((prev) => ({
          ...prev,
          isShowedForm: true,
          selectedRow: data.value
        }));
        break;
      case 'backBtn':
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        break;

      case 'submitSymptoms':
        updateBulk({
          actionType: 'updateSymptom',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        symptomRefetch();
        break;

      default:
        break;
    }
  };

  const tableHeaderByTab = (tab) => {
    switch (tab) {
      case 'tab1':
        return (
          <>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Code
            </th>
          </>
        );
    }
  };

  console.log(symptomsList);
  const renderTableContent = () => (
    <>
      {state?.isShowedForm ? null : (
        <TableContext.Provider
          value={{
            tableData: symptomsListMaster,
            tableHeader: header,
            isLoading: symptomsLoading,
            disableCheckbox: true,
            onClick: (tblBody) => {
              handleOnClick({ type: 'rowClicked', value: tblBody.value });
            }
          }}
        >
          <Table />
        </TableContext.Provider>
      )}
      {activeTab === 'tab1' && state?.isShowedForm && (
        <div className="px-56 py-10">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Symptom Name:
            </label>
            <input
              type="text"
              name="name"
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.name}
              onChange={handleInput}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Code: Symptom Code:
            </label>
            <input
              type="text"
              name="code"
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.code}
              onChange={handleInput}
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOnClick({ type: 'backBtn' })}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              &larr; Back
            </button>
            <button
              onClick={() =>
                handleOnClick({
                  type: 'submitSymptoms',
                  value: state?.selectedRow
                })
              }
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );

  const renderContent = () => (
    <>
      <div
        className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`}
        style={{ height: '100vh', overflowY: 'auto' }}
      >
        <div className="font-bold text-xl mb-2 uppercase text-gray-600">
          Symptoms
        </div>
        <div className="flex justify-between py-1">
          <Button btnIcon="add" onClick={() => setActiveContent('green')}>
            Add
          </Button>

          <SearchExport>
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
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
          <div className="flex justify-items-center border-gray-300 border-b-[1px]">
            <div className="rounded-tl-lg py-3 ml-3">
              <button
                onClick={() => setActiveTab('tab1')}
                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab1' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
              >
                Symptoms Name
              </button>
            </div>
          </div>
          {symptomsLoading ? (
            <div className="grid p-3 gap-y-2">
              <div className="w-full h-8 bg-gray-300 rounded animate-pulse" />
              <div className="w-full h-8 bg-gray-300 rounded animate-pulse" />
              <div className="w-full h-8 bg-gray-300 rounded animate-pulse" />
            </div>
          ) : (
            <div className="tab-content">{renderTableContent(activeTab)}</div>
          )}
        </div>
        <div className="flex flex-wrap py-2">
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
        className={`transition-transform duration-500 ease-in-out ${activeContent === 'green' ? 'translate-y-0' : 'translate-x-full'} absolute inset-0 p-8 pt-[5rem]`}
        style={{ height: `100vh`, overflowY: 'auto' }}
      >
        <div className="flex justify-between py-1 px-4">
          <Button
            paddingY="2"
            btnIcon="close"
            onClick={() => setActiveContent('yellow')}
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
              onClick={() => handleSubmitButton(activeTab)}
            >
              {btnSpinner ? '' : 'Submit'}
            </Button>
          </div>
        </div>
        <div>
          {activeTab === 'tab1' && (
            <FormContext.Provider
              value={{
                title: 'Symptoms',
                ref: formRef,
                initialFields: symptoms,
                enableAddRow: true,
                onLoading: (data) => setBtnSpinner(data),
                onSuccess: () => handleRefetch(),
                onCloseSlider: () => setActiveContent('yellow'),
                onAlert: (data) => {
                  setAlertMessage(data.msg);
                  setAlertType(data.type);
                }
              }}
            >
              <Form />
            </FormContext.Provider>
          )}
        </div>
      </div>
    </>
  );

  return <div>{renderContent()}</div>;
}

export default Symptoms;
