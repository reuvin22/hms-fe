import React, { useState, useEffect, useRef } from 'react';
import { FormContext } from '@/utils/context';
import {
  useGetInventoryItemStockListQuery,
  useGetInventoryCategoryQuery,
  useGetInventoryIssueQuery,
  useGetInventoryItemStatusQuery,
  useGetInventoryCategoryListQuery
} from '@/service/settingService';
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

const renderModalContentByTab = (tab) => {};

function Inventory({ slug }) {
  const formRef = useRef(null);
  const [activeTab, setActiveTab] = useState('tab1');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeContent, setActiveContent] = useState('yellow');
  const [contentHeight, setContentHeight] = useState(0);
  const [btnSpinner, setBtnSpinner] = useState(false);

  const {
    data: inventoryCategoryList,
    isLoading: inventoryCategoryLoading,
    isError: inventoryCategoryError,
    isSuccess: inventoryCategorySuccess
    // refetch
  } = useGetInventoryCategoryListQuery(
    {
      items: itemsPerPage,
      tabs: activeTab,
      page: currentPage
    },
    {
      enabled: !!activeTab
    }
  );

  const inventoryCategoryMaster = inventoryCategoryList?.data ?? [];
  const inventoryCategoryPagination = inventoryCategoryList?.pagination ?? [];
  const inventoryCategoryHeaders = inventoryCategoryList?.columns ?? [];

  console.log(inventoryCategoryList);
  // Inventory Item Stock List
  const {
    data: inventoryData,
    isLoading: inventoryLoading,
    isError: inventoryError,
    isSuccess: inventorySuccess
    // refetch
  } = useGetInventoryItemStockListQuery(
    {
      items: itemsPerPage,
      tabs: activeTab,
      page: currentPage
    },
    {
      enabled: !!activeTab
    }
  );

  const inventoryMaster = inventoryData?.data ?? [];
  const itemStockpagination = inventoryData?.pagination ?? [];
  const inventoryHeaders = inventoryData?.columns ?? [];

  // Inventory Issue
  const {
    data: inventoryIssueData,
    isLoading: inventoryIssueLoading,
    isError: inventoryIssueError,
    isSuccess: inventoryIssueSuccess
    // refetch
  } = useGetInventoryIssueQuery(
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

  const inventoryIssueMaster = inventoryIssueData?.data ?? [];
  const Issuepagination = inventoryIssueData?.pagination ?? [];
  const inventoryIssueHeaders = inventoryIssueData?.columns ?? [];

  const { data: itemStatus } = useGetInventoryItemStatusQuery();

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value);
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
  };

  const handleExportToPDF = () => {};

  const handleNewPage = (newPage) => {
    setCurrentPage(newPage);
    // setRefetchData(true)
    // setItemsPerPage(prev => prev + 1)
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

  const categories = inventoryCategoryList?.data ?? [];

  const categoryList = categories?.map((category) => ({
    value: category?.id,
    label: category?.category_name
  }));

  const status = itemStatus?.data ?? [];
  const inventoryItemStatus = status?.map((status) => ({
    value: status?.id,
    lable: status?.status
  }));

  const itemStockList = [
    { name: 'name', type: 'text', label: 'name', placeholder: 'Item Name' },
    {
      name: 'category',
      type: 'dropdown',
      options: categoryList,
      label: 'Item Category'
    },
    {
      name: 'supplier',
      type: 'text',
      label: 'supplier',
      placeholder: 'Supplier'
    },
    { name: 'date', type: 'date', label: 'date', placeholder: 'Date' },
    {
      name: 'quantity',
      type: 'number',
      label: 'quantity',
      placeholder: 'Total Quantity'
    },
    {
      name: 'price',
      type: 'number',
      label: 'price',
      placeholder: 'Purchase Price'
    }
  ];

  const issueItem = [
    { name: 'name', type: 'text', label: 'name', placeholder: 'Item Name' },
    {
      name: 'category_id',
      type: 'text',
      label: 'item_category',
      placeholder: 'Item Category'
    },
    {
      name: 'return',
      type: 'text',
      label: 'return',
      placeholder: 'Issued - Return'
    },
    {
      name: 'issuedTo',
      type: 'text',
      label: 'issuedTo',
      placeholder: 'Issued To'
    },
    {
      name: 'issuedBy',
      type: 'text',
      label: 'issuedBy',
      placeholder: 'Issued By'
    },
    {
      name: 'quantity',
      type: 'number',
      label: 'quantity',
      placeholder: 'Quantity'
    },
    {
      name: 'status_id',
      type: 'dropdown',
      options: inventoryItemStatus,
      label: 'Item Status'
    }
  ];

  const item = [
    { name: 'name', type: 'text', label: 'name', placeholder: 'Item Name' },
    {
      name: 'category',
      type: 'text',
      label: 'item_category',
      placeholder: 'Item Category'
    },
    { name: 'unit', type: 'text', label: 'unit', placeholder: 'Unit' },
    {
      name: 'quantity',
      type: 'number',
      label: 'quantity',
      placeholder: 'Total Quantity'
    }
  ];

  const category = [
    {
      name: 'category_name',
      type: 'text',
      label: 'Category Name',
      placeholder: 'Category Name'
    }
  ];
  const renderTableByTab = (tab) => {
    switch (tab) {
      case 'tab1':
        return (
          <>
            <TableContext.Provider
              value={{
                tableData: inventoryMaster,
                tableHeader: inventoryHeaders,
                disableCheckbox: true,
                isLoading: inventoryLoading,
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
                tableData: inventoryIssueMaster,
                tableHeader: inventoryIssueHeaders,
                disableCheckbox: true,
                isLoading: inventoryIssueLoading,
                onClick: (tblBody) => {
                  handleOnClick({ type: 'rowClicked', value: tblBody.value });
                }
              }}
            >
              <Table />
            </TableContext.Provider>
          </>
        );

      case 'tab3':
        return (
          <>
            <TableContext.Provider
              value={{
                tableData: inventoryCategoryMaster,
                tableHeader: inventoryCategoryHeaders,
                disableCheckbox: true,
                isLoading: inventoryCategoryLoading,
                onClick: (tblBody) => {
                  handleOnClick({ type: 'rowClicked', value: tblBody.value });
                }
              }}
            >
              <Table />
            </TableContext.Provider>
          </>
        );

      case 'tab4':
        return (
          <>
            <TableContext.Provider
              value={{
                tableData: inventoryCategoryMaster,
                tableHeader: inventoryCategoryHeaders,
                disableCheckbox: true,
                isLoading: inventoryCategoryLoading,
                onClick: (tblBody) => {
                  handleOnClick({ type: 'rowClicked', value: tblBody.value });
                }
              }}
            >
              <Table />
            </TableContext.Provider>
          </>
        );
    }
  };

  return (
    <div className="absolute inset-0 w-min-full">
      <div
        className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`}
        style={{ height: '100vh', overflowY: 'auto' }}
      >
        <div className="font-bold text-xl mb-2 uppercase text-gray-600">
          Inventory
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
                onClick={() => setActiveTab('tab1')}
                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab1' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
              >
                Item Stock List
              </button>
              <button
                onClick={() => setActiveTab('tab2')}
                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
              >
                Issue Item
              </button>
              <button
                onClick={() => setActiveTab('tab3')}
                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab3' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
              >
                Items
              </button>
              <button
                onClick={() => setActiveTab('tab4')}
                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab4' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
              >
                Category
              </button>
            </div>
          </div>

          {inventoryLoading ? (
            <div className="grid p-3 gap-y-2">
              <div className="w-full h-8 bg-gray-300 rounded animate-pulse" />
              <div className="w-full h-8 bg-gray-300 rounded animate-pulse" />
              <div className="w-full h-8 bg-gray-300 rounded animate-pulse" />
            </div>
          ) : (
            <div className="tab-content">{renderTableByTab(activeTab)}</div>
          )}
        </div>

        <div className="flex flex-wrap py-2">
          <div className="flex items-center justify-center flex-grow">
            {activeTab === 'tab1' && (
              <Pagination
                currentPage={itemStockpagination.current_page}
                totalPages={itemStockpagination.total_pages}
                // onPageChange={newPage => setCurrentPage(newPage)}
                onPageChange={(newPage) => handleNewPage(newPage)}
              />
            )}
            {activeTab === 'tab2' && (
              <Pagination
                currentPage={Issuepagination.current_page}
                totalPages={Issuepagination.total_pages}
                // onPageChange={newPage => setCurrentPage(newPage)}
                onPageChange={(newPage) => handleNewPage(newPage)}
              />
            )}
            {activeTab === 'tab3' && (
              <Pagination
                currentPage={inventoryCategoryPagination.current_page}
                totalPages={inventoryCategoryPagination.total_pages}
                // onPageChange={newPage => setCurrentPage(newPage)}
                onPageChange={(newPage) => handleNewPage(newPage)}
              />
            )}
            {activeTab === 'tab4' && (
              <Pagination
                currentPage={inventoryCategoryPagination.current_page}
                totalPages={inventoryCategoryPagination.total_pages}
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
                title: 'Inventory',
                ref: formRef,
                initialFields: itemStockList,
                enableAddRow: true,
                onLoading: (data) => setBtnSpinner(data),
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
                title: 'Inventory',
                ref: formRef,
                initialFields: issueItem,
                enableAddRow: true,
                onLoading: (data) => setBtnSpinner(data),
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
                title: 'Inventory',
                ref: formRef,
                initialFields: item,
                enableAddRow: true,
                onLoading: (data) => setBtnSpinner(data),
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
          {activeTab === 'tab4' && (
            <FormContext.Provider
              value={{
                title: 'Inventory Category',
                ref: formRef,
                initialFields: category,
                enableAddRow: true,
                onLoading: (data) => setBtnSpinner(data),
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
    </div>
  );
}

export default Inventory;
