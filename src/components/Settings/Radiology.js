import React, { useState, useEffect, useReducer, useRef } from 'react';
import SearchItemPage from '../SearchItemPage';
import Modal from '../Modal';
import Table from '../Table';
import Button from '../Button';
import SearchExport from '../SearchExport';
import Dropdown from '../Dropdown';
import { DropdownExport } from '../DropdownLink';
import Pagination from '../Pagination';
import ItemPerPage from '../ItemPerPage';
import { FormContext } from '@/utils/context';
import Form from '../Form';
import {
  useGetRadiologyCategoryListQuery,
  useGetRadiologyListQuery
} from '@/service/patientService';
import { useUpdateBulkMutation } from '@/service/settingService';
import { TableContext } from '@/utils/context';

// const radiologyCategory = [
//     {name: ""}
// ]

const radiologyUnit = [{ unit_name: '' }];

const radiologyParams = [{ unit_name: '' }];

const renderModalContentByTab = (tab) => {};

const renderTableContentByTab = (tab) => {
  switch (tab) {
    case 'tab1':
      return (
        <Table
          title="User List"
          tableData={radiologyCategory}
          action={false}
          tableHeader={Object.keys(radiologyCategory[0])}
          // isLoading={userListLoading}
        />
      );

    case 'tab2':
      return (
        <Table
          title="User List"
          tableData={radiologyUnit}
          action={false}
          tableHeader={Object.keys(radiologyUnit[0])}
          // isLoading={userListLoading}
        />
      );

    case 'tab3':
      return (
        <Table
          title="User List"
          tableData={radiologyParams}
          action={false}
          tableHeader={Object.keys(radiologyParams[0])}
          // isLoading={userListLoading}
        />
      );

    default:
      return null;
  }
};

const Radiology = ({ slug }) => {
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
  const [updateBulk] = useUpdateBulkMutation();

  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const {
    data: radiologyData,
    isLoading: radiologyLoading,
    isError: radiologyError,
    isSuccess: radiologySuccess,
    refetch: radiologyListRefetch
  } = useGetRadiologyListQuery(
    {
      items: itemsPerPage,
      tabs: activeTab,
      page: currentPage
    },
    {
      enabled: !!activeTab
    }
  );

  const {
    data: categoryData,
    isLoading: radiologyCategoryLoading,
    isError: radiologyCategoryError,
    isSuccess: radiologyCategorySuccess,
    refetch: radiologyCategoryRefetch
  } = useGetRadiologyCategoryListQuery(
    {
      items: itemsPerPage,
      tabs: activeTab,
      page: currentPage
    },
    {
      enabled: !!activeTab
    }
  );

  //Radiology
  const radCategory = categoryData?.data ?? [];
  const radiologyCategoryHeader = categoryData?.columns ?? [];
  const radiologyCategoryPagination = categoryData?.pagination ?? [];
  const radiologyMaster = radiologyData?.data ?? [];
  const radiologyPagination = radiologyData?.pagination ?? [];
  const radiologyHeader = radiologyData?.columns ?? [];
  const radiologyCategories = radCategory?.map((category) => ({
    value: category?.id,
    label: category?.category_name
  }));

  const radiologyTest = [
    {
      name: 'test_name',
      type: 'text',
      label: 'Test Name',
      placeholder: 'Enter Test Name'
    },
    {
      name: 'test_type',
      type: 'text',
      label: 'Test Type',
      placeholder: 'Enter Test Type'
    },
    {
      name: 'radio_cat_id',
      type: 'dropdown',
      label: 'Radiology Category',
      options: radiologyCategories
    },
    {
      name: 'charge',
      type: 'number',
      label: 'Charge',
      placeholder: 'Enter Charge'
    }
  ];
  const radiologyCategory = [
    {
      name: 'category_name',
      type: 'text',
      label: 'Category Name',
      placeholder: 'Enter Category Name'
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Enter Description'
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

  const handleTab = (tab) => {
    setActiveTab(tab);
    setState((prevState) => ({
      ...prevState,
      isShowedForm: false
    }));
  };

  const handleSubmitButton = (tabs) => {
    if (tabs === 'tab1') {
      formRef.current.handleSubmit('createRadiology');
      radiologyListRefetch();
    } else if (tabs === 'tab2') {
      formRef.current.handleSubmit('createRadiologyCategory');
      radiologyCategoryRefetch();
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

  const handleOnClick = (data) => {
    switch (data.type) {
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
        radiologyListRefetch();
        break;

      case 'submitCategory':
        updateBulk({
          actionType: 'updateRadiologyCategory',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        console.log(state.selectedRow);
        radiologyCategoryRefetch();
        break;
      default:
        break;
    }
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

  // const tableHeaderByTab = (tab) => {
  //     switch(tab) {
  //         case 'tab1':
  //             return (
  //                 <>
  //                     <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
  //                     <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
  //                     <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
  //                     <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge</th>
  //                 </>
  //             )
  //         case 'tab2':
  //             return (
  //                 <>
  //                     <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
  //                     <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
  //                 </>
  //             )
  //     }
  // }

  const renderTableContent = (tab) => {
    switch (tab) {
      case 'tab1':
        return (
          <>
            <TableContext.Provider
              value={{
                tableData: radiologyMaster,
                tableHeader: radiologyHeader,
                disableCheckbox: true,
                isLoading: radiologyLoading,
                onClick: (tblBody) => {
                  handleOnClick({ type: 'rowClicked', value: tblBody.value });
                }
              }}
            >
              <Table />
            </TableContext.Provider>
          </>
        );

      case 'tab2':
        return (
          <>
            <TableContext.Provider
              value={{
                tableData: radCategory,
                tableHeader: radiologyCategoryHeader,
                disableCheckbox: true,
                isLoading: radiologyCategoryLoading,
                onClick: (tblBody) => {
                  handleOnClick({ type: 'rowClicked', value: tblBody.value });
                }
              }}
            >
              <Table />
            </TableContext.Provider>
          </>
        );

      default:
        break;
    }
  };
  const updateForm = (tab) => {
    switch (tab) {
      case 'tab1':
        return (
          <>
            {state?.isShowedForm && (
              <div className="px-56 py-10">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Test Name:
                  </label>
                  <input
                    type="text"
                    name="test_name"
                    className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                    value={state?.selectedRow?.test_name}
                    onChange={handleInput}
                  />
                  <label className="block text-sm font-medium text-gray-700">
                    Test Type:
                  </label>
                  <input
                    type="text"
                    name="test_type"
                    className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                    value={state?.selectedRow?.test_type}
                    onChange={handleInput}
                  />
                  <label className="block text-sm font-medium text-gray-700">
                    Category Name:
                  </label>
                  <select
                    className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                    value={state?.selectedRow?.radio_cat_id}
                    name="radio_cat_id"
                    onChange={handleInput}
                  >
                    {radCategory.map((category) => (
                      <option key={category?.id} value={category?.id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                  <label className="block text-sm font-medium text-gray-700">
                    Charge:
                  </label>
                  <input
                    type="text"
                    name="charge"
                    className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                    value={state?.selectedRow?.charge}
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
                        type: 'submitRadiology',
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
        break;

      case 'tab2':
        return (
          <>
            {state?.isShowedForm && (
              <div className="px-56 py-10">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Category Name:
                  </label>
                  <input
                    type="text"
                    name="category_name"
                    className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                    value={state?.selectedRow?.category_name}
                    onChange={handleInput}
                  />
                  <label className="block text-sm font-medium text-gray-700">
                    Description:
                  </label>
                  <input
                    type="text"
                    name="description"
                    className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                    value={state?.selectedRow?.description}
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
                        type: 'submitCategory',
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
        break;

      default:
        break;
    }
  };
  const renderContent = () => {
    return (
      <>
        <div
          className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`}
          style={{ height: '100vh', overflowY: 'auto' }}
        >
          <div className="font-bold text-xl mb-2 uppercase text-gray-600">
            Radiology
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
            <div className="flex justify-items-center border-gray-300 border-b-[1px]">
              <div className="rounded-tl-lg py-3 ml-3">
                <button
                  onClick={() => handleTab('tab1')}
                  className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab1' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                >
                  Radiology Name
                </button>
                <button
                  onClick={() => handleTab('tab2')}
                  className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                >
                  Radiology Category
                </button>
              </div>
            </div>
            {radiologyLoading ? (
              <div className="grid p-3 gap-y-2">
                <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ) : (
              <div className="tab-content">
                {state?.isShowedForm
                  ? updateForm(activeTab)
                  : renderTableContent(activeTab)}
              </div>
            )}
          </div>
          {activeTab === 'tab1' && !state?.isShowedForm && (
            <div className="flex flex-wrap py-2">
              <div className="flex items-center justify-center flex-grow">
                <Pagination
                  currentPage={radiologyPagination.current_page}
                  totalPages={radiologyPagination.total_pages}
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
          )}
          {activeTab === 'tab2' && !state?.isShowedForm && (
            <div className="flex flex-wrap py-2">
              <div className="flex items-center justify-center flex-grow">
                <Pagination
                  currentPage={radiologyCategoryPagination.current_page}
                  totalPages={radiologyCategoryPagination.total_pages}
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
          )}
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
                  title: 'Radiology Test',
                  ref: formRef,
                  initialFields: radiologyTest,
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
            {activeTab === 'tab2' && (
              <FormContext.Provider
                value={{
                  title: 'Radiology Category',
                  ref: formRef,
                  initialFields: radiologyCategory,
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
  };

  return (
    <div>
      {/* <Modal 
                slug={slug}
                isOpen={isModalOpen}
                onClose={closeModal}
            >
                {renderModalContentByTab(activeTab)}
            </Modal>

            <SearchItemPage
                action={true}
                onExportToPDF={handleExportToPDF}
                onChangeItemPage={(item) => handleItemsPerPageChange(item)}
                onCurrentPage={(page) => handleCurrentPage(page)}
                // onSearchResults={(results) => handleSearchResults(results)}
                onSearch={(q) => handleSearch(q)}
                onAddClicked={() => setIsModalOpen(true)}
            />

            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mx-auto sm:w-full">
                <div className="border rounded-lg">
                    <div className="flex justify-items-center">
                        <div className="rounded-tl-lg py-3 ml-3">
                            <button 
                                onClick={() => setActiveTab('tab1')}
                                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab1' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Radiology Category
                            </button>
                            <button 
                                onClick={() => setActiveTab('tab2')}
                                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Unit
                            </button>
                            <button 
                                onClick={() => setActiveTab('tab3')}
                                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab3' ? 'bg-gray-200 rounded-md p-4':'bg-white rounded-md p-4'}`}>Radiology Parameter
                            </button>
                        </div>
                    </div>

                    <div className="tab-content px-3 max-h-[65vh] overflow-y-auto scroll-custom">
                        {renderTableContentByTab(activeTab)}
                    </div>
                </div>
            </div> */}
      {renderContent()}
    </div>
  );
};

export default Radiology;
