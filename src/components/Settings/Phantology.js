import React, { useState, useEffect, useRef } from 'react';
import SearchItemPage from '../SearchItemPage';
import Modal from '../Modal';
import Table from '../Table';
import Button from '../Button';
import SearchExport from '../SearchExport';
import Dropdown from '../Dropdown';
import { DropdownExport } from '../DropdownLink';
import { FormContext, useComponentContext } from '@/utils/context';
import Form from '../Form';
import Tabs from '../Tabs';
import Pagination from '../Pagination';
import ItemPerPage from '../ItemPerPage';
import {
  useGetPathologyCategoryListQuery,
  useGetPathologyListQuery,
  useGetPathologyParameterListQuery,
  useGetPathologyCategoryQuery,
  useGetPathologyParametersQuery
} from '@/service/patientService';
import Alert from '../Alert';
import { set } from 'lodash';
import { useUpdateBulkMutation } from '@/service/settingService';
import { TableContext } from '@/utils/context';

const panthologyUnit = [{ unit_name: '' }];

const panthologyParams = [
  { param_name: '', reference_range: '', unit: '', description: '' }
];

const pathologyCategories = [
  { test_name: '', short_name: '', test_type: '', category: '' }
];

// const test = pathologyCategories.map((item, index) => (
//     Object.keys(item).map((key) => (
//         <tr>
//         <th key={key}>{key}</th>
//         </tr>
//     ))
// ));

// const renderModalContentByTab = (tab) => {
//     switch(tab) {
//         case 'tab1':
//             return (
//                 <>
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead>
//                             <tr>
//                                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th>
//                                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Name</th><th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Street</th><th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Name</th><th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                             </tr>
//                         </thead>
//                     </table>
//                 </>
//             )
//         case 'tab3':
//             return (
//                 <>
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead>
//                             <tr>
//                                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pathology Parameter</th>
//                             </tr>
//                         </thead>
//                     </table>
//                 </>
//             )
//     }
// }

const Phantology = ({ slug }) => {
  const componentContext = useComponentContext();
  const formRef = useRef(null);
  const [activeTab, setActiveTab] = useState('tab1');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [activeContent, setActiveContent] = useState('yellow');
  const [contentHeight, setContentHeight] = useState(0);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [state, setState] = useState({
    isShowedForm: false,
    selectedRow: null
  });
  const [updateBulk, { isLoading: updateBulkLoading }] =
    useUpdateBulkMutation();
  const { data: parametersMaster } = useGetPathologyParametersQuery();

  // const parameter = parametersData?.data ?? []
  // console.log(parametersData)

  const {
    data: pathologyData,
    isLoading: pathologyLoading,
    isError: pathologyError,
    isSuccess: pathologySuccess,
    refetch: pathologyRefetch,
    isLoading: pathologyListLoading
  } = useGetPathologyListQuery(
    {
      items: itemsPerPage,
      tabs: activeTab,
      page: currentPage,
      q: searchQuery
    },
    {
      enabled: !!activeTab
    }
  );

  const {
    data: parameterMaster,
    isError: parameterError,
    isSuccess: parameterSuccess,
    refetch: paramRefetch,
    isLoading: pathologyParameterLoading
  } = useGetPathologyParameterListQuery(
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
    data: categoryMaster,
    isLoading: categoryLoading,
    isError: categoryError,
    isSuccess: categorySuccess,
    refetch: categoryRefetch,
    isLoading: pathologyCategoryLoading
  } = useGetPathologyCategoryListQuery(
    {
      items: itemsPerPage,
      tabs: activeTab,
      page: currentPage
    },
    {
      enabled: !!activeTab
    }
  );

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
      // clearTimeout(highlightTimeout)
    };
  }, [btnSpinner]);

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
    if (tabs === 'tab3') {
      formRef.current.handleSubmit('createPathologyCategory');
    } else if (tabs === 'tab2') {
      formRef.current.handleSubmit('createPathologyParameter');
    } else if (tabs === 'tab1') {
      formRef.current.handleSubmit('createPathologyTest');
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

  const pathologyParameterList = parameterMaster?.data ?? [];
  const pathologyParameterPage = parameterMaster?.pagination ?? [];
  const pathologyParameterColumns = parameterMaster?.columns ?? [];
  const pathologyCategoryList = categoryMaster?.data ?? [];
  const pathologyCategoryPage = categoryMaster?.pagination ?? [];
  const pathologyCategoryHeaders = categoryMaster?.columns ?? [];
  const pathologyListHeaders = pathologyData?.columns ?? [];
  const pathologyListPage = pathologyData?.pagination ?? [];
  const pathologyList = pathologyData?.data ?? [];
  const pathologyPagination = pathologyData?.pagination ?? [];

  const categoryOptions = pathologyCategoryList?.map((category) => ({
    value: category?.id,
    label: category?.category_name
  }));

  const parameterOptions = pathologyParameterList?.map((category) => ({
    value: category?.id,
    label: category?.param_name
  }));

  const pathologyParameter = [
    {
      name: 'param_name',
      type: 'text',
      label: 'Parameter Name',
      placeholder: 'Enter Pathology Parameter'
    },
    {
      name: 'test_value',
      type: 'text',
      label: 'Test Value',
      placeholder: 'Enter Test Value'
    },
    {
      name: 'ref_range',
      type: 'text',
      label: 'Ref Range',
      placeholder: 'Enter Ref Range'
    },
    { name: 'unit', type: 'text', label: 'Unit', placeholder: 'Enter Unit' },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Enter Description'
    }
  ];

  const pathologyCategory = [
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

  const pathologyTest = [
    {
      name: 'test_name',
      type: 'text',
      label: 'Test Name',
      placeholder: 'Enter Test Name'
    },
    {
      name: 'short_name',
      type: 'text',
      label: 'Short Name',
      placeholder: 'Enter Short Name'
    },
    {
      name: 'patho_category_id',
      type: 'dropdown',
      label: 'Category',
      options: categoryOptions
    },
    {
      name: 'patho_param_id',
      type: 'dropdown',
      label: 'Parameter Test',
      options: parameterOptions
    },
    { name: 'unit', type: 'text', label: 'Unit', placeholder: 'Enter Unit' },
    {
      name: 'sub_category',
      type: 'text',
      label: 'Sub Category',
      placeholder: 'Enter Sub Category'
    },
    {
      name: 'report_days',
      type: 'text',
      label: 'Report Days',
      placeholder: 'Enter Report Days'
    },
    {
      name: 'methods',
      type: 'text',
      label: 'Methods',
      placeholder: 'Enter Methods'
    },
    {
      name: 'charge',
      type: 'number',
      label: 'Charge',
      placeholder: 'Enter Charge'
    }
  ];

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

      case 'submitPathology':
        updateBulk({
          actionType: 'updatePathologyTest',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        pathologyRefetch();
        break;

      case 'submitParameter':
        updateBulk({
          actionType: 'updatePathologyParameter',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        paramRefetch();
        break;

      case 'submitCategory':
        updateBulk({
          actionType: 'updatePathologyCategory',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        categoryRefetch();
        break;
      default:
        break;
    }
  };

  // const handleOnChange = (data) => {
  //     switch(data.type) {
  //         case 'updateTest':
  //             setState(prev => ({
  //                 ...prev,
  //                 selectedRow: {
  //                     ...prev.selectedRow,
  //                     test_name: data.value,
  //                     short_name: data.value
  //                 }
  //             }));
  //             break;
  //         default:
  //             break;
  //     }
  // }
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

  const renderTableContentByTab = (tab) => {
    switch (tab) {
      case 'tab1':
        return (
          <TableContext.Provider
            value={{
              tableData: pathologyList,
              tableHeader: pathologyListHeaders,
              isLoading: pathologyListLoading,
              disableCheckbox: true,
              onClick: (tblBody) => {
                handleOnClick({ type: 'rowClicked', value: tblBody.value });
              }
            }}
          >
            <Table />
          </TableContext.Provider>
        );

      case 'tab2':
        return (
          <TableContext.Provider
            value={{
              tableData: pathologyParameterList,
              tableHeader: pathologyParameterColumns,
              isLoading: pathologyParameterLoading,
              disableCheckbox: true,
              onClick: (tblBody) => {
                handleOnClick({ type: 'rowClicked', value: tblBody.value });
              }
            }}
          >
            <Table />
          </TableContext.Provider>
        );

      case 'tab3':
        return (
          // <Table
          //     title="User List"
          //     tableData={panthologyParams}
          //     action={false}
          //     tableHeader={Object.keys(panthologyParams[0])}
          //     // isLoading={userListLoading}
          // />
          <TableContext.Provider
            value={{
              tableData: pathologyCategoryList,
              tableHeader: pathologyCategoryHeaders,
              disableCheckbox: true,
              onClick: (tblBody) => {
                handleOnClick({ type: 'rowClicked', value: tblBody.value });
              },
              isLoading: pathologyCategoryLoading
            }}
          >
            <Table />
          </TableContext.Provider>
        );

      // case 'tab3':
      //     return (
      //         <Table
      //             title="User List"
      //             tableData={panthologyParams}
      //             action={false}
      //             tableHeader={Object.keys(panthologyParams[0])}
      //             // isLoading={userListLoading}
      //         />
      //     )

      default:
        return null;
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
            Pathology
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
                  Pathology Test
                </button>
                <button
                  onClick={() => setActiveTab('tab2')}
                  className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                >
                  Pathology Parameter
                </button>
                <button
                  onClick={() => setActiveTab('tab3')}
                  className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab3' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                >
                  Pathology Category
                </button>
              </div>
            </div>
            {pathologyListLoading ? (
              <div className="grid p-3 gap-y-2">
                <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
                <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ) : (
              <div className="tab-content">
                {state?.isShowedForm
                  ? null
                  : renderTableContentByTab(activeTab)}
                {activeTab === 'tab1' && state?.isShowedForm && (
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
                        Short name:
                      </label>
                      <input
                        type="text"
                        name="short_name"
                        className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        value={state?.selectedRow?.short_name}
                        onChange={handleInput}
                      />
                      <label className="block text-sm font-medium text-gray-700">
                        Category Name:
                      </label>
                      <select
                        className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        value={state?.selectedRow?.patho_category_id}
                        name="patho_category_id"
                        onChange={handleInput}
                      >
                        {pathologyCategoryList?.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                      <label className="block text-sm font-medium text-gray-700">
                        Sub Category:
                      </label>
                      <input
                        type="text"
                        name="sub_category"
                        className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        value={state?.selectedRow?.sub_category}
                        onChange={handleInput}
                      />
                      <label className="block text-sm font-medium text-gray-700">
                        Parameter Name:
                      </label>
                      <select
                        className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        value={state?.selectedRow?.patho_param_id}
                        name="patho_param_id"
                        onChange={handleInput}
                      >
                        {pathologyParameterList.map((param) => (
                          <option key={param.id} value={param.id}>
                            {param.param_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Unit:
                      </label>
                      <input
                        type="text"
                        name="unit"
                        className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        value={state?.selectedRow?.unit}
                        onChange={handleInput}
                      />
                      <label className="block text-sm font-medium text-gray-700">
                        Report Days:
                      </label>
                      <input
                        type="text"
                        name="report_days"
                        className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none bg-gray-200 cursor-not-allowed"
                        value={state?.selectedRow?.report_days}
                        readOnly
                      />
                      <label className="block text-sm font-medium text-gray-700">
                        Methods:
                      </label>
                      <input
                        type="text"
                        name="methods"
                        className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        value={state?.selectedRow?.methods}
                        onChange={handleInput}
                      />
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
                            type: 'submitPathology',
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
                {activeTab === 'tab2' && state?.isShowedForm && (
                  <div className="px-56 py-10">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Parameter:
                      </label>
                      <input
                        type="text"
                        name="param_name"
                        className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        value={state?.selectedRow?.param_name}
                        onChange={handleInput}
                      />
                      <label className="block text-sm font-medium text-gray-700">
                        Test Value:
                      </label>
                      <input
                        type="text"
                        name="test_value"
                        className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        value={state?.selectedRow?.test_value}
                        onChange={handleInput}
                      />
                      <label className="block text-sm font-medium text-gray-700">
                        Ref Range:
                      </label>
                      <input
                        type="text"
                        name="ref_range"
                        className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        value={state?.selectedRow?.ref_range}
                        onChange={handleInput}
                      />
                      <label className="block text-sm font-medium text-gray-700">
                        Unit:
                      </label>
                      <input
                        type="text"
                        name="unit"
                        className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                        value={state?.selectedRow?.unit}
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
                            type: 'submitParameter',
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
                {activeTab === 'tab3' && state?.isShowedForm && (
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
              </div>
            )}
          </div>
          <div className="flex flex-wrap py-2">
            {state?.isShowedForm ? null : (
              <>
                <div className="flex items-center justify-center flex-grow">
                  {activeTab === 'tab1' && (
                    <Pagination
                      currentPage={pathologyPagination.current_page}
                      totalPages={pathologyPagination.total_pages}
                      // onPageChange={newPage => setCurrentPage(newPage)}
                      onPageChange={(newPage) => handleNewPage(newPage)}
                    />
                  )}
                  {activeTab === 'tab2' && (
                    <Pagination
                      currentPage={pathologyParameterPage.current_page}
                      totalPages={pathologyParameterPage.total_pages}
                      // onPageChange={newPage => setCurrentPage(newPage)}
                      onPageChange={(newPage) => handleNewPage(newPage)}
                    />
                  )}
                  {activeTab === 'tab3' && (
                    <Pagination
                      currentPage={pathologyCategoryPage.current_page}
                      totalPages={pathologyCategoryPage.total_pages}
                      // onPageChange={newPage => setCurrentPage(newPage)}
                      onPageChange={(newPage) => handleNewPage(newPage)}
                    />
                  )}
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
              </>
            )}
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
                  title: 'Pathology Test',
                  ref: formRef,
                  initialFields: pathologyTest,
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
                  title: 'Pathology Parameter',
                  ref: formRef,
                  initialFields: pathologyParameter,
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
            {activeTab === 'tab3' && (
              <FormContext.Provider
                value={{
                  title: 'Pathology Category',
                  ref: formRef,
                  initialFields: pathologyCategory,
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
      <Modal slug={slug} isOpen={isModalOpen} onClose={closeModal}>
        {renderTableContentByTab(activeTab)}
      </Modal>

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
  );
};

export default Phantology;
