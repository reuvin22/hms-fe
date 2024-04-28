import React, { useState, useEffect, useRef } from 'react';
import { FormContext } from '@/utils/context';
import Table from '../Table';
import Modal from '../Modal';
import SearchItemPage from '../SearchItemPage';
import Button from '../Button';
import SearchExport from '../SearchExport';
import ItemPerPage from '../ItemPerPage';
import Pagination from '../Pagination';
import Dropdown from '../Dropdown';
import Form from '../Form';
import SkeletonScreen from '../SkeletonScreen';
import { DropdownExport } from '../DropdownLink';
import {
  useUpdateBulkMutation,
  useGetBedListQuery,
  useGetBedFloorListQuery,
  useGetBedTypeListQuery,
  useGetBedGroupListQuery
} from '../../service/settingService';
import Alert from '../Alert';

function Bed({ slug }) {
  const fieldRef = useRef(null);
  const formRef = useRef(null);
  const [activeTab, setActiveTab] = useState('tab2');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [activeContent, setActiveContent] = useState('yellow');
  const [btnSpinner, setBtnSpinner] = useState(false);
  const [tableHeader, setTableHeader] = useState([]);
  const [floorId, setFloorId] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [state, setState] = useState({
    isShowedForm: false,
    selectedRow: null
  });
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [updateBulk] = useUpdateBulkMutation();

  const {
    data: bedData,
    isLoading: bedLoading,
    isError: bedError,
    isSuccess: bedSuccess,
    refetch: bedRefetch
  } = useGetBedListQuery(
    {
      items: itemsPerPage,
      tabs: activeTab,
      page: currentPage
    },
    {
      enabled: !!activeTab
    }
  );

  const { data: floorMaster, refetch: floorFetch } = useGetBedFloorListQuery();
  const { data: typeMaster, refetch: typeFetch } = useGetBedTypeListQuery();
  const { data: groupMaster, refetch: groupFetch } = useGetBedGroupListQuery();

  const bedMaster = bedData?.data ?? [];
  const pagination = bedData?.pagination ?? [];
  const header = bedData?.columns ?? [];

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

  // tab 2
  const bedTypeOptions = typeMaster?.map((type) => ({
    value: type?.id,
    label: type?.name
  }));

  // tab 2
  const bedGroupOptions = groupMaster?.map((group) => ({
    value: group?.id,
    label: `${group?.name} - ${group?.bed_floor?.floor}`
  }));

  // tab 2
  const bedListTab = [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' },
    {
      name: 'bed_type',
      type: 'dropdown',
      label: 'Bed Type',
      options: bedTypeOptions
    },
    {
      name: 'bed_group',
      type: 'dropdown',
      label: 'Bed Group',
      options: bedGroupOptions
    }
  ];

  // tab 3
  const bedTypeTab = [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' }
  ];

  // tab 4
  const bedFloorOptions = floorMaster?.map((floor) => ({
    value: floor?.id,
    label: floor?.floor
  }));
  // tab 4
  const bedGroupTab = [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' },
    {
      name: 'bed_floor',
      type: 'dropdown',
      label: 'Bed Floor',
      options: bedFloorOptions
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Enter description'
    }
  ];

  // tab 5
  const bedFloorTab = [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Enter description'
    }
  ];

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(e.target.value);
  };

  const handleCurrentPage = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleExportToPDF = () => {};

  const handleAlertClose = () => {
    setAlertType('');
    setAlertMessage([]);
  };

  const handleRefetch = () => {
    setItemsPerPage((prev) => prev + 1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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

      case 'submitBedType':
        updateBulk({
          actionType: 'updateBedType',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        bedRefetch();
        break;

      case 'submitBedGroup':
        updateBulk({
          actionType: 'updateBedGroup',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        bedRefetch();
        break;

      case 'submitBedList':
        updateBulk({
          actionType: 'updateBedList',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        console.log(state.selectedRow);
        bedRefetch();
        break;

      case 'submitFloor':
        updateBulk({
          actionType: 'updateBedFloor',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        console.log(state.selectedRow);
        bedRefetch();
        break;

      default:
        break;
    }
  };

  const handleNewPage = (newPage) => {
    setCurrentPage(newPage);
    // setRefetchData(true)
    // setItemsPerPage(prev => prev + 1)
  };

  const handleSubmitButton = (tabs) => {
    if (tabs === 'tab5') {
      formRef.current.handleSubmit('createBedFloor');
    } else if (tabs === 'tab4') {
      formRef.current.handleSubmit('createBedGroup');
    } else if (tabs === 'tab3') {
      formRef.current.handleSubmit('createBedType');
    } else if (tabs === 'tab2') {
      formRef.current.handleSubmit('createBed');
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

  const addRow = () => {
    fieldRef.current.handleAddRow();
  };

  console.log(activeTab);
  const renderTableContent = () => (
    <>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {header
              .filter((tblHeader) => tblHeader !== 'id')
              .map((tblHeader, tblHeaderIndex) => (
                <th
                  key={tblHeaderIndex}
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {tblHeader === 'floor_id'
                    ? 'floor'
                    : tblHeader === 'bed_type_id'
                      ? 'bed_type'
                      : tblHeader === 'bed_group_id'
                        ? 'bed_group'
                        : tblHeader === 'is_active'
                          ? 'status'
                          : tblHeader}
                </th>
              ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {bedMaster.length === 0 ? (
            <tr>
              <td colSpan={header.length + 1} className="px-6 py-2 text-center">
                No records found.
              </td>
            </tr>
          ) : (
            !state.isShowedForm &&
            bedMaster.map((tblBody, tblBodyIndex) => (
              <tr
                key={tblBodyIndex}
                onClick={() =>
                  handleOnClick({ type: 'rowClicked', value: tblBody })
                }
                className="hover:bg-gray-200 cursor-pointer"
              >
                {header
                  .filter((tblHeader) => tblHeader !== 'id')
                  .map((tblHeader, index) => (
                    <td
                      key={index}
                      className="px-6 py-2 whitespace-nowrap text-sm"
                    >
                      {tblHeader === 'floor_id' ? (
                        tblBody?.bed_floor.floor
                      ) : tblHeader === 'bed_type_id' ? (
                        tblBody?.bed_type.name
                      ) : tblHeader === 'bed_group_id' ? (
                        `${tblBody?.bed_group.name} - ${tblBody?.bed_group?.bed_floor.floor}`
                      ) : tblHeader === 'is_active' ? (
                        tblBody?.is_active ? (
                          <span className="bg-green-700 p-1 rounded-md text-white text-xs">
                            Available
                          </span>
                        ) : (
                          <span className="bg-red-700 p-1 rounded-md text-white text-xs">
                            Occupied
                          </span>
                        )
                      ) : (
                        tblBody[tblHeader]
                      )}
                    </td>
                  ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {activeTab === 'tab2' && state?.isShowedForm && (
        <div className="px-56 py-10">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Bed Name:
            </label>
            <input
              type="text"
              name="name"
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.name}
              onChange={handleInput}
            />
            <label className="block text-sm font-medium text-gray-700">
              Bed_type:
            </label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.bed_type_id}
              name="bed_type_id"
              onChange={handleInput}
            >
              {typeMaster.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <label className="block text-sm font-medium text-gray-700">
              Bed_Group:
            </label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.bed_group_id}
              name="bed_group_id"
              onChange={handleInput}
            >
              {groupMaster.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
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
                  type: 'submitBedList',
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
              Bed Name:
            </label>
            <input
              type="text"
              name="name"
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.name}
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
                  type: 'submitBedType',
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
      {activeTab === 'tab4' && state?.isShowedForm && (
        <div className="px-56 py-10">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              name="name"
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.name}
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
            <label className="block text-sm font-medium text-gray-700">
              Bed Group:
            </label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.floor_id}
              name="floor_id"
              onChange={handleInput}
            >
              {floorMaster.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.floor}
                </option>
              ))}
            </select>
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
                  type: 'submitBedGroup',
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
      {activeTab === 'tab5' && state?.isShowedForm && (
        <div className="px-56 py-10">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Floor:
            </label>
            <input
              type="text"
              name="floor"
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.floor}
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
                  type: 'submitFloor',
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

  const renderTableContentByTab = (tab) => {
    switch (tab) {
      case 'tab2':
        return (
          <Table
            title="User List"
            disableTable
            onOpenModal={(id) => setModalId(id)}
          >
            {renderTableContent()}
          </Table>
        );

      case 'tab3':
        return (
          <Table
            title="User List"
            disableTable
            onOpenModal={(id) => setModalId(id)}
          >
            {renderTableContent()}
          </Table>
        );

      case 'tab4':
        return (
          <Table
            title="User List"
            disableTable
            onOpenModal={(id) => setModalId(id)}
          >
            {renderTableContent()}
          </Table>
        );

      case 'tab5':
        return (
          <Table
            title="User List"
            disableTable
            onOpenModal={(id) => setModalId(id)}
          >
            {renderTableContent()}
          </Table>
        );

      default:
        return null;
    }
  };

  const renderContent = () => (
    <>
      <div
        className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`}
        style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
      >
        <div className="font-bold text-xl mb-2 text-gray-600">
          Bed Management
        </div>
        <div className="flex justify-between py-1">
          {activeTab !== 'tab1' && (
            <Button btnIcon="add" onClick={() => setActiveContent('green')}>
              Add
            </Button>
          )}

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
                onClick={() => handleTab('tab2')}
                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
              >
                Bed List
              </button>
              <button
                onClick={() => handleTab('tab3')}
                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab3' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
              >
                Bed Type
              </button>
              <button
                onClick={() => handleTab('tab4')}
                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab4' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
              >
                Bed Group
              </button>
              <button
                onClick={() => handleTab('tab5')}
                className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab5' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
              >
                Floor
              </button>
            </div>
          </div>

          {bedLoading ? (
            <div className="grid p-3 gap-y-2">
              <div className="w-full h-8 bg-gray-300 rounded animate-pulse" />
              <div className="w-full h-8 bg-gray-300 rounded animate-pulse" />
              <div className="w-full h-8 bg-gray-300 rounded animate-pulse" />
            </div>
          ) : (
            <div className="tab-content">
              {renderTableContentByTab(activeTab)}
            </div>
          )}
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
        <div className="flex justify-between pt-2 px-4">
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

        {activeTab === 'tab2' && (
          <FormContext.Provider
            value={{
              title: 'Bed List',
              ref: formRef,
              initialFields: bedListTab,
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
              title: 'Bed Type',
              ref: formRef,
              initialFields: bedTypeTab,
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
              title: 'Bed Group',
              ref: formRef,
              initialFields: bedGroupTab,
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

        {activeTab === 'tab5' && (
          <FormContext.Provider
            value={{
              title: 'Floor',
              ref: formRef,
              initialFields: bedFloorTab,
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
    </>
  );

  return (
    <div>
      {alertMessage && (
        <Alert
          alertType={alertType}
          isOpen={alertType !== ''}
          onClose={handleAlertClose}
          message={alertMessage}
          display="absolute"
        />
      )}

      <div className="flex relative overflow-hidden h-screen">
        <div className="absolute inset-0 w-full">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Bed;
