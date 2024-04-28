import React, { useState, useRef, useEffect } from 'react';
import { useGetHospitalChargeQuery } from '@/service/chargeService';
import { FormContext } from '@/utils/context';
import {
  useUpdateBulkMutation,
  useGetHosptlChargeTypeQuery,
  useGetHosptlChargeCategoryQuery,
  useGetPhysicianListQuery
} from '@/service/settingService';
import SearchItemPage from '../SearchItemPage';
import Modal from '../Modal';
import Form from '../Form';
import Table from '../Table';
import Button from '../Button';
import ItemPerPage from '../ItemPerPage';
import SearchExport from '../SearchExport';
import Dropdown from '../Dropdown';
import Pagination from '../Pagination';
import SkeletonScreen from '../SkeletonScreen';
import { DropdownExport } from '../DropdownLink';
import Alert from '../Alert';

const hospitalCharge = [
  {
    charge_category: 'Category Charge 1',
    charge_type: 'Procedures',
    code: 'PCC11'
  },
  {
    charge_category: 'Biochemistry',
    charge_type: 'Investigations',
    code: "ABG's"
  },
  {
    charge_category: 'General Surgery',
    charge_type: 'Operation Theatre',
    code: 'Knee Surgery'
  }
];

const hospitalChargeType = [{ charge_type: 'Procedures' }];

const hospitalEmergencyCharge = [{ doctor: 'Procedures', standard_charge: 20 }];

const hospitalOPDCharge = [{ doctor: 'Procedures', standard_charge: 20 }];

const hospitalChargeCategory = [
  {
    name: 'OT Charges',
    decscription: 'OT Charges',
    charge_type: 'Operation Theatre'
  }
];

const renderModalContentByTab = (tab) => {
  switch (tab) {
    case 'tab1':
      return (
        <div className="w-80">
          <div className="flex flex-col w-full mb-4">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Charge Type
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

          <div className="flex flex-col w-full mb-4">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Charge Category
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

          <div className="flex flex-col w-full mb-4">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Code
            </label>
            <input
              type="text"
              placeholder="Enter code"
              className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col w-full mb-4">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Standard Charge
            </label>
            <input
              type="text"
              placeholder="Enter code"
              className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col w-full mb-4">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Description
            </label>
            <textarea
              type="text"
              placeholder="Enter standard charge"
              className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>
      );

    case 'tab2':
      return (
        <div className="w-80">
          <div className="flex flex-col w-full mb-4">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter name"
              className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col w-full mb-4">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Description
            </label>
            <textarea
              type="text"
              placeholder="Enter standard charge"
              className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col w-full mb-4">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Charge Type
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
        </div>
      );

    case 'tab3':
      return (
        <div className="w-80">
          <div className="flex flex-col w-full mb-4">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Doctor
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
              Standard Charge
            </label>
            <input
              type="text"
              placeholder="Enter standard charge"
              className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>
      );

    case 'tab4':
      return (
        <div className="w-80">
          <div className="flex flex-col w-full mb-4">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Doctor
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
              Standard Charge
            </label>
            <input
              type="text"
              placeholder="Enter standard charge"
              className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>
      );

    case 'tab5':
      return (
        <div className="w-80">
          <div className="flex flex-col w-full">
            <label className="ml-2 mb-2 text-gray-700 uppercase text-medium">
              Charge type
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

function HospitalCharge({
  slug,
  hosptlChargeTypeData,
  hosptlChargeCategoryData,
  hosptlPhysicianListData,
  refetchPhysicianList
}) {
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
  const [state, setState] = useState({
    isShowedForm: false,
    selectedRow: null
  });
  const [updateBulk] = useUpdateBulkMutation();
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const {
    data: hospitalCharge,
    isLoading: hospitalChargeLoading,
    isError: hospitalChargeError,
    isSuccess: hospitalChargeSuccess,
    refetch: hcRefetch
  } = useGetHospitalChargeQuery(
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

  const hospitalChargeMaster = hospitalCharge?.data ?? [];
  const pagination = hospitalCharge?.pagination ?? [];
  const header = hospitalCharge?.columns ?? [];

  // console.log(hosptlPhysicianListData)

  const chargeTypeOption = hosptlChargeTypeData?.map((type) => ({
    value: type?.id,
    label: type?.name
  }));

  const chargeCategoryOption = hosptlChargeCategoryData?.map((category) => ({
    value: category?.id,
    label: category?.name
  }));

  const chargeTab = [
    {
      name: 'charge_type',
      type: 'dropdown',
      label: 'Charge Type',
      options: chargeTypeOption
    },
    {
      name: 'charge_category',
      type: 'dropdown',
      label: 'Charge Category',
      options: chargeCategoryOption
    },
    { name: 'code', type: 'text', label: 'Code', placeholder: 'Enter code' },
    {
      name: 'standard_charge',
      type: 'number',
      label: 'Standard Charge',
      placeholder: 'Enter standard charge'
    }
  ];

  const chargeCategoryTab = [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' },
    {
      name: 'description',
      type: 'text',
      label: 'Description',
      placeholder: 'Enter description'
    },
    {
      name: 'charge_type',
      type: 'dropdown',
      label: 'Charge Type',
      options: chargeTypeOption
    }
  ];

  // physician list
  const physicianChargeOption = hosptlPhysicianListData?.map((physician) => ({
    value: physician?.user_id,
    label: `Dr. ${physician?.identity?.first_name} ${physician?.identity?.last_name}`
  }));

  console.log(hosptlPhysicianListData);
  const physicianChargeOPD = [
    {
      name: 'doctor_id',
      type: 'dropdown',
      label: 'Doctor',
      options: physicianChargeOption
    },
    {
      name: 'standard_charge',
      type: 'number',
      label: 'Standard Charge',
      placeholder: 'Enter standard charge'
    }
  ];

  console.log(physicianChargeOPD);
  const physicianChargeER = [
    {
      name: 'doctor_id',
      type: 'dropdown',
      label: 'Doctor',
      options: physicianChargeOption
    },
    {
      name: 'standard_charge',
      type: 'number',
      label: 'Standard Charge',
      placeholder: 'Enter standard charge'
    }
  ];

  const chargeType = [
    { name: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' }
  ];

  const handleItemsPerPageChange = (item) => {
    setItemsPerPage(item);
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

  const handleTab = (tab) => {
    setActiveTab(tab);
    setState((prevState) => ({
      ...prevState,
      isShowedForm: false
    }));
  };
  console.log(state?.selectedRow);
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

      case 'submitHc':
        updateBulk({
          actionType: 'updateHospitalCharge',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        hcRefetch();
        break;

      case 'submitType':
        updateBulk({
          actionType: 'updateHospitalChargeType',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        hcRefetch();
        break;

      case 'submitCategory':
        updateBulk({
          actionType: 'updateHospitalChargeCategory',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        console.log(state.selectedRow);
        hcRefetch();
        break;

      case 'submitDoctor':
        updateBulk({
          actionType: 'updateHospitalPhysicianCharge',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        hcRefetch();
        break;

      case 'submitChargeEr':
        updateBulk({
          actionType: 'updateHospitalChargeEr',
          data: data.value,
          id: data.value.id
        });
        setState((prev) => ({
          ...prev,
          isShowedForm: false,
          selectedRow: null
        }));
        hcRefetch();
        break;

      default:
        break;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitButton = (tabs) => {
    if (tabs === 'tab1') {
      formRef.current.handleSubmit('createHosptlCharge');
    } else if (tabs === 'tab2') {
      formRef.current.handleSubmit('createHosptlChargeCat');
    } else if (tabs === 'tab3') {
      formRef.current.handleSubmit('createHosptlPhyChargeOpd');
    } else if (tabs === 'tab4') {
      formRef.current.handleSubmit('createHosptlPhyChargeEr');
    } else if (tabs === 'tab5') {
      formRef.current.handleSubmit('createHosptlChargeType');
    }
  };

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
                  {tblHeader === 'charge_type_id'
                    ? 'CHARGE_TYPE'
                    : tblHeader === 'charge_category_id'
                      ? 'CHARGE_CATEGORY'
                      : tblHeader === 'doctor_id'
                        ? 'doctor'
                        : tblHeader}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {hospitalChargeMaster.length === 0 ? (
            <tr>
              <td colSpan={header.length + 1} className="px-6 py-2 text-center">
                No records found.
              </td>
            </tr>
          ) : (
            !state.isShowedForm &&
            hospitalChargeMaster.map((tblBody, tblBodyIndex) => (
              <tr
                key={tblBodyIndex}
                onClick={() =>
                  handleOnClick({ type: 'rowClicked', value: tblBody })
                }
                className="hover:bg-gray-200 cursor-pointer"
              >
                {header
                  .filter((tblHeader) => tblHeader !== 'id')
                  .map((tblHeader, headerIndex) => (
                    <td
                      key={headerIndex}
                      className="px-6 py-2 whitespace-nowrap text-sm"
                    >
                      {tblHeader === 'charge_type_id'
                        ? tblBody?.charge_type?.name
                        : tblHeader === 'charge_category_id'
                          ? tblBody?.charge_category?.name
                          : tblHeader === 'doctor_id'
                            ? `Dr ${tblBody?.identity?.first_name} ${tblBody?.identity?.last_name}`
                            : tblBody[tblHeader]}
                    </td>
                  ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {activeTab === 'tab1' && state?.isShowedForm && (
        <div className="px-56 py-10">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Charge Type:
            </label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.charge_type_id}
              name="charge_type_id"
              onChange={handleInput}
            >
              {hosptlChargeTypeData?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <label className="block text-sm font-medium text-gray-700">
              Category Name:
            </label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.charge_category_id?.name}
              name="charge_category_id"
              onChange={handleInput}
            >
              {hosptlChargeCategoryData.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <label className="block text-sm font-medium text-gray-700">
              Code:
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
                handleOnClick({ type: 'submitHc', value: state?.selectedRow })
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
              Category Name:
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
              Charge Type:
            </label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.charge_type_id}
              name="charge_type_id"
              onChange={handleInput}
            >
              {hosptlChargeTypeData.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
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
      {activeTab === 'tab3' && state?.isShowedForm && (
        <div className="px-56 py-10">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Doctor:
            </label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.doctor_id}
              name="charge_type_id"
              onChange={handleInput}
            >
              {hosptlPhysicianListData?.map((type) => (
                <option key={type.id} value={type.id}>
                  {`Dr. ${type?.identity?.first_name} ${type?.identity?.last_name}`}
                </option>
              ))}
            </select>
            <label className="block text-sm font-medium text-gray-700">
              Standard Charge:
            </label>
            <input
              type="number"
              name="standard_charge"
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.standard_charge}
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
                  type: 'submitDoctor',
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
      {console.log(state?.selectedRow?.standard_charge)}
      {activeTab === 'tab4' && state?.isShowedForm && (
        <div className="px-56 py-10">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category Name:
            </label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.doctor_id}
              name="doctor_id"
              onChange={handleInput}
            >
              {hosptlPhysicianListData?.map((type) => (
                <option key={type.id} value={type.id}>
                  {`Dr. ${type?.identity?.first_name} ${type?.identity?.last_name}`}
                </option>
              ))}
            </select>
            <label className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <input
              type="number"
              name="standard_charge"
              className="mt-1 block w-full p-2 border border-gray-300 px-3 py-2 text-sm focus:outline-none"
              value={state?.selectedRow?.standard_charge}
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
                  type: 'submitChargeEr',
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
              Name:
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
                handleOnClick({ type: 'submitType', value: state?.selectedRow })
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
      case 'tab1':
        return (
          <Table
            title="User List"
            disableTable
            onOpenModal={(id) => setModalId(id)}
          >
            {renderTableContent()}
          </Table>
        );

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
    <div className="flex relative overflow-hidden h-screen">
      <div className="absolute inset-0 w-full">
        <div
          className={`transition-transform duration-500 ease-in-out ${activeContent === 'yellow' ? 'translate-y-0' : '-translate-x-full'} absolute inset-0 p-8 pt-[5rem]`}
          style={{ height: `${contentHeight}px`, overflowY: 'auto' }}
        >
          <div className="font-bold text-xl mb-2 uppercase text-gray-600">
            Hospital Charges
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
                  Charges
                </button>
                <button
                  onClick={() => handleTab('tab2')}
                  className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab2' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                >
                  Charge Category
                </button>
                <button
                  onClick={() => handleTab('tab3')}
                  className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab3' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                >
                  Doctor OPD Charge
                </button>
                <button
                  onClick={() => handleTab('tab4')}
                  className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab4' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                >
                  Doctor Emergency Charge
                </button>
                <button
                  onClick={() => handleTab('tab5')}
                  className={`focus:outline-none font-medium uppercase text-sm text-gray-500  ${activeTab === 'tab5' ? 'bg-gray-200 rounded-md p-4' : 'bg-white rounded-md p-4'}`}
                >
                  Charge Type
                </button>
              </div>
            </div>

            {hospitalChargeLoading ? (
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

          {activeTab === 'tab1' && (
            <FormContext.Provider
              value={{
                title: 'Charges',
                ref: formRef,
                initialFields: chargeTab,
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
                title: 'Charge Category',
                ref: formRef,
                initialFields: chargeCategoryTab,
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
                title: 'Doctor OPD Charge',
                ref: formRef,
                initialFields: physicianChargeOPD,
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

          {activeTab === 'tab4' && (
            <FormContext.Provider
              value={{
                title: 'Doctor Emergency Charge',
                ref: formRef,
                initialFields: physicianChargeER,
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

          {activeTab === 'tab5' && (
            <FormContext.Provider
              value={{
                title: 'Charge Type',
                ref: formRef,
                initialFields: chargeType,
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
    </div>
  );

  return (
    <div>
      <Modal slug={slug} isOpen={isModalOpen} onClose={closeModal}>
        {renderModalContentByTab(activeTab)}
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
}

export default HospitalCharge;
