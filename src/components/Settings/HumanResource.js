import React, { useState, useEffect, useRef } from 'react';
import { FormContext } from '@/utils/context';
import SearchItemPage from '../SearchItemPage';
import Modal from '../Modal';
import Table from '../Table';
import Button from '../Button';
import SearchExport from '../SearchExport';
import Dropdown from '../Dropdown';
import { DropdownExport } from '../DropdownLink';
import Pagination from '../Pagination';
import ItemPerPage from '../ItemPerPage';

const renderModalContentByTab = (tab) => {};

function HumanResource({ slug }) {
  const [activeTab, setActiveTab] = useState('tab1');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeContent, setActiveContent] = useState('yellow');
  const [contentHeight, setContentHeight] = useState(0);
  const [btnSpinner, setBtnSpinner] = useState(false);
  const formRef = useRef(null);

  const handleItemsPerPageChange = (item) => {
    setItemsPerPage(item);
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
  };

  const handleExportToPDF = () => {};

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const tableHeaderByTab = (tab) => {
    switch (tab) {
      case 'tab1':
        return (
          <>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test Name
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Short Name
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test Type
            </th>
          </>
        );
      case 'tab2':
        return (
          <>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sub-Category
            </th>
          </>
        );
    }
  };

  const renderTable = () => (
    <table className="min-w-full divide-y divide-gray-200">
      <thead>
        <tr className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          {tableHeaderByTab(activeTab)}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        <tr>
          <td colSpan="4" className="px-6 py-2 text-center">
            No records found.
          </td>
        </tr>
        {/* ) : (
                                hospitalChargeMaster.map((tblBody, tblBodyIndex) => (
                                    // <tr key={tblBodyIndex} className={`${highlightedRows.has(tblBodyIndex)} ? 'bg-green-200' : ''`}>
                                <tr key={tblBodyIndex}>
                                    {header.filter(tblHeader => tblHeader !== 'id').map((tblHeader) => (
                                        <td key={tblHeader} className="px-6 py-2 whitespace-nowrap text-sm">
                                            {tblHeader === 'charge_type_id' ? (
                                                    tblBody?.charge_type?.name
                                            ) : tblHeader === 'charge_category_id' ? (
                                                    tblBody?.charge_category?.name
                                            ) : tblHeader === 'doctor_id' ? (
                                                    `Dr ${tblBody?.identity?.first_name} ${tblBody?.identity?.last_name}` 
                                            ) : (
                                                    tblBody[tblHeader]
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )} */}
      </tbody>
    </table>
  );

  return (
    <div className="absolute inset-0 w-min-full">
      <div
        className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`}
        style={{ height: '100vh', overflowY: 'auto' }}
      >
        <div className="font-bold text-xl mb-2 uppercase text-gray-600">
          Human Resource
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
                leave type
              </button>
              <button
                onClick={() => setActiveTab('tab2')}
                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
              >
                department
              </button>
              <button
                onClick={() => setActiveTab('tab3')}
                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab3' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
              >
                designation
              </button>
              <button
                onClick={() => setActiveTab('tab4')}
                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab4' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
              >
                specialist
              </button>
            </div>
          </div>

          {/* {hospitalChargeLoading ? (
                                    <div className="grid p-3 gap-y-2">
                                        <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
                                        <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
                                        <div className="w-full h-8 bg-gray-300 rounded animate-pulse"></div>
                                    </div>
                                ) : ( */}
          <div className="tab-content">{renderTable()}</div>
          {/* )} */}
        </div>

        <div className="flex flex-wrap py-2">
          <div className="flex items-center justify-center flex-grow">
            <Pagination
              // currentPage={pagination.current_page}
              // totalPages={pagination.total_pages}
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
        style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
      >
        <div className="font-bold text-lg mb-2 text-gray-600 pt-10 px-4">
          Add{' '}
          {activeTab === 'tab1'
            ? 'Charges'
            : activeTab === 'tab2'
              ? 'Charge Category'
              : activeTab === 'tab3'
                ? 'Doctor Opd Charge'
                : activeTab === 'tab4'
                  ? 'Doctor Emergency Charge'
                  : activeTab === 'tab5'
                    ? 'Charge Type'
                    : ''}
        </div>
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

        {/* {/* {activeTab === 'tab1' && (
                                <FormContext.Provider value={{
                                    title: "Charges",
                                    ref: formRef,
                                    initialFields: chargeTab,
                                    enableAddRow: true,
                                    onLoading: (data) => setBtnSpinner(data),
                                    onSuccess: () => handleRefetch(),
                                    onCloseSlider: () => setActiveContent("yellow"),
                                    onAlert: (data) => {
                                        setAlertMessage(data.msg)
                                        setAlertType(data.type)
                                    }
                                }}>
                                    <Form />
                                </FormContext.Provider>
                            )} */}
      </div>
    </div>
  );
}

export default HumanResource;
