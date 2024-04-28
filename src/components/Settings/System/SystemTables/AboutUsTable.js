import React, { useState, useEffect, useReducer, useRef } from 'react';
import Table from '@/components/Table';
import Button from '@/components/Button';
import SearchExport from '@/components/SearchExport';
import Dropdown from '@/components/Dropdown';
import { DropdownExport } from '@/components/DropdownLink';
import Pagination from '@/components/Pagination';
import ItemPerPage from '@/components/ItemPerPage';
import { useUpdateBulkMutation } from '@/service/settingService';
import { TableContext } from '@/utils/context';
import { useGetAboutUsQuery } from '@/service/settingService';

const AboutUsTable = () => {
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
    data: aboutUsData,
    isLoading: aboutUsLoading,
    isError: aboutUsError,
    isSuccess: aboutUsSuccess,
    refetch: aboutUsRefetch
  } = useGetAboutUsQuery(
    {
      items: itemsPerPage,
      tabs: activeTab,
      page: currentPage
    },
    {
      enabled: !!activeTab
    }
  );

  const aboutUsList = aboutUsData?.data ?? [];
  const aboutUsHeaders = aboutUsData?.columns ?? [];
  const aboutUsPagination = aboutUsData?.pagination ?? [];

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

  const renderTableContent = () => {
    return (
      <TableContext.Provider
        value={{
          tableData: aboutUsList,
          tableHeader: aboutUsHeaders,
          isLoading: aboutUsLoading,
          disableCheckbox: true,
          onClick: (tblBody) => {
            handleOnClick({ type: 'rowClicked', value: tblBody.value });
          }
        }}
      >
        <Table />
      </TableContext.Provider>
    );
  };

  const renderContent = () => {
    return (
      <>
        <div className="bg-white overflow-hidden border border-gray-300 rounded">
          {aboutUsLoading ? (
            <div className="grid p-3 gap-y-2">
              <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
            </div>
          ) : (
            <div className="tab-content">{renderTableContent()}</div>
          )}
        </div>
        {!state?.isShowedForm && (
          <div className="flex flex-wrap py-2">
            <div className="flex items-center justify-center flex-grow">
              <Pagination
                currentPage={aboutUsPagination.current_page}
                totalPages={aboutUsPagination.total_pages}
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
      </>
    );
  };

  return <div>{renderContent()}</div>;
};

export default AboutUsTable;
