import React, { useState, useEffect } from 'react';
import { TableContext, useComponentContext } from '@/utils/context';
import SearchItemPage from '../SearchItemPage';
import Modal from '../Modal';
import Table from '../Table';
import Button from '../Button';
import SearchExport from '../SearchExport';
import Dropdown from '../Dropdown';
import { DropdownExport } from '../DropdownLink';
import Tabs from '../Tabs';

const renderModalContentByTab = (tab) => {};

const renderTableContentByTab = (tab) => {};

function Pharmacy({ slug }) {
  const componentContext = useComponentContext();
  const [activeTab, setActiveTab] = useState('tab1');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [activeContent, setActiveContent] = useState('yellow');
  // const [isShowedForm, setIsShowMedForm] = useState(false)
  // const [selectedMedicine, setSelectedMedicine] = useState(null)

  const [state, setState] = useState({
    isShowedForm: false,
    selectedMedicine: null
  });

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
  console.log(componentContext?.state);

  const handleOnClick = (data) => {
    switch (data.type) {
      case 'tabClicked':
        setActiveTab(data.value);
        break;
      case 'rowClicked':
        setState((prev) => ({
          ...prev,
          isShowedForm: true,
          selectedMedicine: data.value
        }));
        break;
      case 'backBtn':
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedMedicine: null
        }));
        break;

      case 'submitMedicine':
        componentContext?.onSubmitData({ type: data.type, value: data.value });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedMedicine: null
        }));
      default:
        break;
    }
  };

  const handleOnChange = (data) => {
    switch (data.type) {
      case 'addMedicine':
        setState((prev) => ({
          ...prev,
          selectedMedicine: {
            ...prev.selectedMedicine,
            quantity: parseInt(data.value, 10)
          }
        }));
        break;
      default:
        break;
    }
  };

  const renderTableContent = (data) => (
    <>
      {!state?.isShowedForm && (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {data.tableHeader?.map((tblHeader, tblHeaderIndex) => (
                <th
                  key={tblHeaderIndex}
                  className="px-6 py-3 bg-white text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {tblHeader}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {data.tableData.length === 0 ? (
              <tr>
                <td
                  colSpan={data.tableHeader?.length + 1}
                  className="px-6 py-2 text-center"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              data.tableData.map((tblBody, tblBodyIndex) => (
                <tr
                  key={tblBody.id}
                  onClick={() => {
                    handleOnClick({ type: 'rowClicked', value: tblBody });
                  }}
                  className="hover:bg-gray-200"
                >
                  {data.tableHeader?.map((tblHeader) => (
                    <td
                      key={tblHeader}
                      className="px-6 py-2 whitespace-nowrap text-sm cursor-pointer"
                    >
                      {tblBody[tblHeader]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {activeTab === 'tab1' && state?.isShowedForm && (
        <div className="px-56 py-10">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Brand name:
            </label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
              value={state?.selectedMedicine?.brand_name}
              readOnly
            />
            <label className="block text-sm font-medium text-gray-700">
              Generic name:
            </label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
              value={state?.selectedMedicine?.generic_name}
              readOnly
            />

            <label className="block text-sm font-medium text-gray-700">
              Qty:
            </label>
            <input
              type="number"
              min={0}
              className="mt-1 block w-full p-2 border bg-gray-100 text-sm px-3 py-2 focus:outline-none focus:border-gray-500 border-gray-300"
              value={state?.selectedMedicine.quantity}
              onChange={(e) =>
                handleOnChange({ type: 'addMedicine', value: e.target.value })
              }
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
                  type: 'submitMedicine',
                  value: state?.selectedMedicine
                })
              }
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {activeTab === 'tab4' && state?.isShowedForm && (
        <div className="px-56 py-10">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category name:
            </label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
              value={state?.selectedMedicine?.category_name}
              readOnly
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
                  type: 'submitMedicine',
                  value: state?.selectedMedicine
                })
              }
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {activeTab === 'tab4' && state?.isShowedForm && (
        <div className="px-56 py-10">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Supplier name:
            </label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 bg-gray-200 px-3 py-2 text-sm focus:outline-none cursor-not-allowed"
              value={state?.selectedMedicine?.supplier_name}
              readOnly
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
                  type: 'submitMedicine',
                  value: state?.selectedMedicine
                })
              }
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      )}
      {console.log(activeTab)}
    </>
  );

  const renderContent = (data) => {
    switch (data) {
      case 'tab1':
      case 'tab2':
      case 'tab3':
        return renderTableContent({
          tableData: componentContext?.state?.medicine,
          tableHeader: componentContext?.state?.header
        });
      case 'tab4':
        return renderTableContent({
          tableData: componentContext?.state?.pharmacyCategoryData,
          tableHeader: componentContext?.state?.pharmacyCategoryHeaders
        });
      case 'tab5':
        return renderTableContent({
          tableData: componentContext?.state?.pharmacySupplierData,
          tableHeader: componentContext?.state?.pharmacySupplierHeaders
        });
      default:
        return null;
    }
  };

  return <div>{renderContent(componentContext?.state?.activeTab)}</div>;
}

export default Pharmacy;
