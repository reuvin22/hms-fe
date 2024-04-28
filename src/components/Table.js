import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useContext
} from 'react';
import SkeletonScreen from './SkeletonScreen';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import Modal from './Modal';
import Alert from './Alert';
import Pagination from './Pagination';
import { authApi } from '@/service/authService';
import {
  useGetUserListQuery,
  useGetPermissionListQuery,
  useGetModuleListQuery
} from '@/service/settingService';
import Soap from './Patient/OPD/Soap';

import { useFormContext, useTableContext } from '@/utils/context';

const soapData = [
  {
    hematology: [
      {
        id: 1,
        type: 'hematology',
        name: 'Complete Blood Count with platelet count(CBC with platelet)'
      },
      { id: 2, type: 'hematology', name: 'Peripheral Blood Smear' },
      { id: 3, type: 'hematology', name: 'Clotting Time(CT)' },
      { id: 4, type: 'hematology', name: 'Bleeding Time(BT)' },
      { id: 5, type: 'hematology', name: 'Prothrombin Time(PT)' },
      { id: 6, type: 'hematology', name: 'Partial Thromboplastin Time(PTT)' },
      { id: 7, type: 'hematology', name: 'Dengue NS1' },
      { id: 8, type: 'hematology', name: 'Crossmatching' },
      { id: 9, type: 'hematology', name: 'Blood Typing' },
      { id: 10, type: 'hematology', name: 'Others' }
    ],
    urine_stool_studies: [
      { id: 11, type: 'stool', name: 'Urinalysis(midstream, clean catch)' },
      { id: 12, type: 'stool', name: 'Pregnancy Test' },
      { id: 13, type: 'stool', name: 'Fecalysis' },
      { id: 14, type: 'stool', name: 'Others' }
    ],
    cardiac_studies: [
      { id: 15, type: 'cardiac', name: 'Electrocardiogram(ECG)' },
      { id: 16, type: 'cardiac', name: 'Others' }
    ],
    chemistry: [
      { id: 17, type: 'chemistry', name: 'Lipid Profile' },
      { id: 18, type: 'chemistry', name: 'Serum Sodium(Na)' },
      { id: 19, type: 'chemistry', name: 'Serum Potassium(K)' },
      { id: 20, type: 'chemistry', name: 'Blood Urea Nitrogen(BUN)' },
      { id: 21, type: 'chemistry', name: 'Ionized Calcium(iCa)' },
      { id: 22, type: 'chemistry', name: 'Uric Acid' },
      { id: 23, type: 'chemistry', name: 'ALT/SGPT' },
      { id: 24, type: 'chemistry', name: 'AST/SGOT' },
      { id: 25, type: 'chemistry', name: 'Hepatitis Test' },
      { id: 26, type: 'chemistry', name: 'Syphilis' },
      { id: 27, type: 'chemistry', name: 'TSH' },
      { id: 28, type: 'chemistry', name: 'Ft4' },
      { id: 29, type: 'chemistry', name: 'Ft3' },
      { id: 30, type: 'chemistry', name: 'TT4' },
      { id: 31, type: 'chemistry', name: 'TT3' },
      { id: 32, type: 'chemistry', name: 'PSA' },
      { id: 33, type: 'chemistry', name: 'Rapid Antigen Test(COVID-19)' },
      { id: 45, type: 'chemistry', name: 'Others' }
    ],
    glucose: [
      { id: 46, type: 'glucose', name: 'Fasting Blood Sugar(FBS)' },
      { id: 47, type: 'glucose', name: 'Hba1c' },
      { id: 48, type: 'glucose', name: 'Random Blood Sugar' },
      {
        id: 49,
        type: 'glucose',
        name: '75g Oral Glucose Tolerance Test(OGTT)'
      },
      { id: 50, type: 'glucose', name: 'Others' }
    ]
  }
];

const soapHeaders = [
  'hematology',
  'urine_stool_studies',
  'cardiac_studies',
  'chemistry',
  'glucose'
];

const dummyData = [
  { id: 1, name: 'Paracetamol' },
  { id: 2, name: 'Other Medicine' },
  { id: 3, name: 'Test Medicine2' },
  { id: 4, name: 'Test Medicine5' },
  { id: 5, name: 'Test Medicine6' },
  { id: 6, name: 'Test Medicine7' },
  { id: 7, name: 'Test Medicine7' },
  { id: 8, name: 'Test Medicine7' },
  { id: 9, name: 'Test Medicine7' },
  { id: 10, name: 'Test Medicine7' },
  { id: 11, name: 'Test Medicine7' },
  { id: 12, name: 'Test Medicine7' },
  { id: 13, name: 'Test Medicine7' },
  { id: 14, name: 'Test Medicine7' },
  { id: 15, name: 'Test Medicine7' },
  { id: 16, name: 'Test Medicine7' }
];

const bedGroup = [
  { name: 'General Ward', floor: '1st Floor', description: '' }
];

const bedType = [{ name: 'Normal' }];

const styleDropdown = {
  control: (provided) => ({
    ...provided,
    // border: '1px solid gray',
    padding: '0.1em',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'gray',
      border: '1px solid gray'
    }
  }),
  input: (provided) => ({
    ...provided,
    inputOutline: 'none'
  })
};

const Table = forwardRef(
  (
    {
      title,
      tableData,
      tableHeader,
      onChecked,
      onClick,
      onEdit,

      isLoading,
      permission,
      module,
      tab,
      onOpenModal,
      onSuccess,
      action,
      slug,
      children,
      disableTable,
      dynamicTable,
      fontSize,
      disableCheckbox
    },
    ref
  ) => {
    const context = useTableContext();
    const imgRef = useRef(null);
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [openModalId, setOpenModalId] = useState('');
    const [imgLink, setImgLink] = useState('');
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomScale, setZoomScale] = useState(1);
    const [maxHeight, setMaxHeight] = useState('70vh');
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState([]);
    const [inpatientAction, setInpatientAction] = useState('');
    const [checked, setChecked] = useState([]);
    const [lastCheckedUserId, setLastCheckedUserId] = useState(null);

    // state for dynamic table
    // const [formData, setFormData] = useState([])
    const [formData, setFormData] = useState([]);
    const [editMode, setEditMode] = useState({});
    const [idCounter, setIdCounter] = useState(0);
    const [addRowClicked, setAddRowClicked] = useState(false);
    const [selectedBedType, setSelectedBedType] = useState('');
    const [selectedBedGroup, setSelectedBedGroup] = useState('');
    const [selectedOption, setSelectedOption] = useState({
      bed_type: '',
      bed_group: ''
    });
    const [checkboxDisable, setCheckBoxDisable] = useState(false);

    const [state, setState] = useState({
      isShowForm: false,
      selectedRow: null
    });

    // console.log(context)
    useImperativeHandle(context?.ref, () => ({
      handleOnClick: (data) => handleOnClick(data),
      handleResetState
    }));

    useEffect(() => {
      // if(tableData?.length > 0) {
      //     setFormData(tableData)
      // }

      if (lastCheckedUserId !== null) {
        context?.onEdit(lastCheckedUserId);
      }
    }, [lastCheckedUserId]);

    let adjustFontSize;

    switch (fontSize) {
      case 'xmall':
        adjustFontSize = 'text-xs';
        break;

      case 'small':
        adjustFontSize = 'text-sm';
        break;

      case 'large':
        adjustFontSize = 'text-lg';
        break;

      case 'xlarge':
        adjustFontSize = 'text-xl';
        break;

      default:
        adjustFontSize = 'text-base';
        break;
    }

    const { data: moduleList, isLoading: moduleListLoading } =
      useGetModuleListQuery();
    const moduleData = moduleList?.moduleList ?? [];
    // console.log(moduleData)

    // console.log(formData)

    const openModal = (userId) => {
      if (selectedRows.includes(userId)) {
        setSelectedRows(selectedRows.filter((index) => index !== userId));
      } else {
        setSelectedRows([...selectedRows, userId]);
      }
      setOpenModalId(userId);
      setIsModalOpen(true);
      onOpenModal(userId);

      // dispatch(authApi.util.invalidateTags([{ type: 'UserDetails', id: 'LIST' }]));
    };

    const handleScroll = (e) => {
      e.preventDefault();

      // Zoom in or out based on the scroll direction
      const newZoomScale =
        e.deltaY > 0
          ? Math.max(zoomScale - 0.1, 1) // Limiting the minimum zoom to original size
          : Math.min(zoomScale + 0.1, 3); // Let's limit the maximum zoom to 3x for now

      setZoomScale(newZoomScale);

      const adjustedMaxHeight = 500 * newZoomScale; // Assuming 500px is base height
      setMaxHeight(`${adjustedMaxHeight}px`);

      if (imgRef.current) {
        imgRef.current.style.transform = `scale(${newZoomScale})`;
      }
    };

    const handleImageClick = () => {
      if (!isZoomed) {
        setIsZoomed(true);
      }
    };

    const handleAlertClose = () => {
      setAlertType('');
      setAlertMessage([]);
      setInpatientAction('');
    };

    const closeModal = () => {
      // reset state
      setSelectedRows([]);
      setIsModalOpen(false);
      setImgLink('');
      setInpatientAction('');
    };

    const handleClickedPO = (action) => {
      setIsModalOpen(true);
      setInpatientAction(action);
    };

    const handleClickedPublish = (action) => {
      setIsModalOpen(true);
      setInpatientAction(action);
    };

    const handleClickedRefer = (action) => {
      setIsModalOpen(true);
      setInpatientAction(action);
    };

    const handleClickedMGH = (action) => {
      setIsModalOpen(true);
      setInpatientAction(action);
    };

    const handleImageView = (action, link) => {
      setIsModalOpen(true);
      setInpatientAction(action);
      setImgLink(link);
    };

    const handleSelectChange = (optionSelected, rowId, name) => {
      console.log(rowId);
      setSelectedOption((prevOptions) => ({
        ...prevOptions,
        [rowId]: {
          ...prevOptions[rowId],
          [name]: optionSelected
        }
      }));
    };

    const handleFieldChange = (e, id, fieldName) => {
      const updateData = formData.map((row, index) => {
        if (row.id === id) {
          return { ...row, [fieldName]: e.target.value };
        }
        return row;
      });
      setFormData(updateData);
    };

    const handleInputText = (a, b, c) => {
      console.log(a, b, c);
    };

    const toggleEditMode = (rowId) => {
      setEditMode((prev) => ({
        ...prev,
        [rowId]: true
        // [rowId]: !prev[rowId]
        // [formData[rowId]?.id]: !prev[formData[rowId]?.id]
      }));

      if (!selectedOption[rowId]) {
        setSelectedOption((prevSelected) => ({
          ...prevSelected,
          [rowId]: {
            bed_type: bed_type,
            bed_group: bed_group
          }
        }));
      }
    };

    const toggleSaveMode = (rowId) => {
      setEditMode((prev) => ({
        ...prev,
        [rowId]: !prev[rowId]
        // [formData[rowId]?.id]: !prev[formData[rowId]?.id]
      }));
    };

    const handleRemoveRow = (rowIndex, formRowId) => {
      setFormData((prev) => prev.filter((_, index) => index !== rowIndex));
    };

    const handleResetState = () => {
      setChecked([]);
    };

    const handleOnClick = (data) => {
      switch (data.type) {
        case 'tickedCheckbox':
          data.event.stopPropagation();
          if (
            context?.state?.type === 'inpatient' ||
            context?.state?.type === 'outpatient'
          ) {
            context?.onCheckPatient({
              checked: data.event.target.checked,
              data: data.value
            });
          }
          break;

        case 'clickedRow':
          context?.onClick({ type: data.type, value: data.value });
          break;

        default:
          break;
      }
    };

    const handleOnchange = (type, e, ids, userId) => {
      switch (type) {
        case 'tblSelectRow':
          const newChecked = e.target.checked
            ? [...checked, ids]
            : checked.filter((sid) => sid !== ids);

          setChecked(newChecked);
          context?.onChecked(newChecked);

          if (e.target.checked) {
            setLastCheckedUserId(userId);
          }
          break;

        case 'tblSelectAll':
          if (e.target.checked) {
            const allIds = context?.tableData?.map((pd) => pd.id); // assuming each patientData has a unique id
            setChecked(allIds);
            context?.onChecked(allIds);
          } else {
            setChecked([]);
          }
          break;

        default:
          break;
      }
    };

    const renderForm = (fieldName, formRow, index) => {
      // console.log(idCounter)
      if (fieldName === 'bed_type') {
        return (
          <Select
            name="bed_type"
            options={bedType?.map((type) => ({
              value: type.name,
              label: type.name
            }))}
            onChange={(optionSelected) =>
              handleSelectChange(optionSelected, idCounter, 'bed_type')
            }
            isSearchable={true}
            isClearable={true}
            placeholder="Select..."
            classNamePrefix="react-select"
            styles={styleDropdown}
            defaultValue={selectedOption.bed_type}
          />
        );
      } else if (fieldName === 'bed_group') {
        return (
          <Select
            name="bed_group"
            options={bedGroup?.map((group) => ({
              value: group.name,
              label: `${group.name} - ${group.floor}`
            }))}
            onChange={(optionSelected) =>
              handleSelectChange(optionSelected, idCounter, 'bed_group')
            }
            isSearchable={true}
            isClearable={true}
            placeholder="Select..."
            classNamePrefix="react-select"
            styles={styleDropdown}
            defaultValue={selectedOption.bed_group}
          />
        );
      } else {
        return (
          <input
            type="text"
            name={`${fieldName}-${formRow.id}`}
            value={formRow[fieldName]}
            onChange={(e) => handleFieldChange(e, index, fieldName)}
            className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none"
          />
        );
      }
    };

    const renderContentBySlug = (action) => {
      switch (action) {
        case 'po':
          return (
            <Soap
              soapData={soapData}
              soapHeaders={soapHeaders}
              dummyData={dummyData}
              physiciansOrder={true}
            />
          );
        case 'publish':
          return (
            <div className="text-center space-y-4">
              <label className="ml-2 text-gray-500 font-bold uppercase text-medium">
                Will publish order now?
              </label>
              <div className="flex items-center">
                <label className="ml-2 mb-2 mr-4 text-gray-500 font-bold uppercase text-xs">
                  Password:{' '}
                </label>
                <input
                  type="password"
                  placeholder=""
                  className="border border-gray-300 px-3 py-2 focus:border-gray-500 focus:outline-none w-full"
                />
              </div>
            </div>
          );

        case 'refer':
          return <></>;

        case 'mgh':
          return <></>;

        case 'imgView':
          return (
            <div className="text-center space-y-4">
              <div
                className="flex justify-center border p-4 overflow-auto scroll-custom"
                onWheel={isZoomed ? handleScroll : null}
                style={{ maxHeight }}
              >
                <img
                  onClick={handleImageClick}
                  ref={imgRef}
                  src={imgLink}
                  // className="w-full h-auto cursor-pointer"
                  className="w-full md:w-[50vh] sm:w-full h-[50vh] transition-transform duration-300 cursor-zoom-in"
                />
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <>
        {alertMessage && (
          <Alert
            alertType={alertType}
            isOpen={alertType !== ''}
            onClose={handleAlertClose}
            message={alertMessage}
          />
        )}

        <Modal
          // title={title}
          moduleData={moduleData}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSuccess={closeModal}
          permission={permission}
          selectedRowId={openModalId}
          onSetAlertType={(data) => setAlertType(data)}
          onSetAlertMessage={(data) => setAlertMessage(data)}
        >
          {renderContentBySlug(inpatientAction)}
        </Modal>

        <div className="bg-white overflow-y-auto scroll-custom sm:rounded-lg">
          {disableTable ? (
            <div>{children}</div>
          ) : dynamicTable ? (
            <table className="min-w-full divide-y  divide-gray-200">
              <thead>
                <tr>
                  {tableHeader.map((tblHeader, tblHeaderIndex) => (
                    <th
                      key={tblHeaderIndex}
                      className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {tblHeader}
                    </th>
                  ))}
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {/* {formData.map(renderTableRow)} */}
                {formData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tableHeader.length + 1}
                      className="px-6 py-2 text-center"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  formData.map((formRow, index) => (
                    <tr key={formRow.id}>
                      {tableHeader.map((fieldName, fieldIndex) => (
                        <td
                          key={fieldIndex}
                          className="px-6 py-3 whitespace-nowrap text-sm"
                        >
                          {editMode[idCounter]
                            ? renderForm(fieldName, formRow, index)
                            : formRow[fieldName]}
                        </td>
                      ))}
                      <td className="px-6 whitespace-nowrap">
                        {editMode[idCounter] ? (
                          <button onClick={() => toggleSaveMode(idCounter)}>
                            <svg
                              fill="none"
                              stroke="currentColor"
                              className="h-5 w-5"
                              strokeWidth={1.5}
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>
                          </button>
                        ) : (
                          <button onClick={() => toggleEditMode(idCounter)}>
                            <svg
                              fill="none"
                              stroke="currentColor"
                              className="h-5 w-5"
                              strokeWidth={1.5}
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index, formRow.id)}
                          className="ml-2  text-[#cb4949] rounded-md px-2 py-1 focus:outline-none"
                        >
                          <svg
                            fill="none"
                            className="h-5 w-5"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {context?.disableCheckbox ? null : (
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={
                          checked?.length === context?.tableData?.length &&
                          context?.tableData?.length !== 0
                        }
                        onChange={(e) => handleOnchange('tblSelectAll', e)}
                      />
                    </th>
                  )}

                  {context?.tableHeader?.map((tblHeader, tblHeaderIndex) => (
                    <th
                      key={tblHeaderIndex}
                      className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {tblHeader === 'id'
                        ? 'patient_id'
                        : tblHeader === 'patient_id'
                          ? 'patient_name'
                          : tblHeader === 'admitting_physician'
                            ? 'physician'
                            : tblHeader === 'created_at'
                              ? 'time_in'
                              : tblHeader}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {context?.tableData?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={context?.tableHeader?.length + 1}
                      className="px-6 py-2 text-center"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  context?.tableData?.map((tblBody, tblBodyIndex) => (
                    // <tr key={tblBodyIndex} className={`${highlightedRows.has(tblBodyIndex)} ? 'bg-green-200' : ''`}>
                    <tr
                      key={tblBody.id}
                      className={
                        context?.disableRow
                          ? tblBody.is_approved === 'Pending'
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'hover:bg-gray-200 hover:cursor-pointer'
                          : 'hover:bg-gray-200 hover:cursor-pointer'
                      }
                      onClick={() =>
                        context?.disableRow
                          ? tblBody.is_approved === 'Pending'
                            ? null
                            : handleOnClick({
                                type: 'clickedRow',
                                value: tblBody
                              })
                          : null
                      }
                    >
                      {context?.disableCheckbox ? null : (
                        <td className="px-6 py-2 whitespace-nowrap text-sm">
                          <input
                            type="checkbox"
                            checked={checked?.includes(tblBody.id)}
                            onChange={(e) =>
                              handleOnchange(
                                'tblSelectRow',
                                e,
                                tblBody.id,
                                tblBody.user_id
                              )
                            }
                            onClick={(e) =>
                              handleOnClick({
                                type: 'tickedCheckbox',
                                event: e,
                                value: tblBody
                              })
                            }
                            disabled={
                              tblBody.is_approved === 'Pending' ? true : false
                            }
                          />
                        </td>
                      )}

                      {context?.tableHeader?.map((tblHeader) => (
                        <td
                          key={tblHeader}
                          className="px-6 py-2 whitespace-nowrap text-sm"
                        >
                          {tblHeader === 'admitting_physician'
                            ? `Dr. ${tblBody?.physician_data_info?.first_name} ${tblBody?.physician_data_info?.last_name}`
                            : tblHeader === 'id'
                              ? tblBody?.patient_id
                              : tblHeader === 'patient_id'
                                ? `${tblBody?.user_data_info?.first_name} ${tblBody?.user_data_info?.last_name}`
                                : tblBody[tblHeader]}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            // <table className="min-w-full divide-y divide-gray-200">
            //     <thead>
            //         <tr>
            //             {tableHeader.map((tblHeader, tblHeaderIndex) => (
            //                 <th key={tblHeaderIndex} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            //                     {tblHeader}
            //                 </th>

            //             ))}

            //             {action && (
            //                 <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            //                     Action
            //                 </th>
            //             )}

            //         </tr>
            //     </thead>
            //     <tbody className="bg-white divide-y divide-gray-200">
            //         {tableData.length === 0 ? (
            //             <tr>
            //                 <td colSpan={tableHeader.length + 1} className="px-6 py-2 text-center">
            //                     No records found.
            //                 </td>
            //             </tr>
            //         ) : (
            //             tableData.map((tblBody, tblBodyIndex) => (
            //                 <tr key={tblBodyIndex}>
            //                     {tableHeader.map((tblHeader) => (
            //                         <td key={tblHeader} className="px-6 py-2 whitespace-nowrap text-sm">
            //                             {tblHeader === 'patient_id' ? (
            //                                 // console.log(slug)
            //                                 slug === 'out-patient' || slug === 'in-patient' ? (
            //                                     <a href={`/patients/${slug}/${tblBody[tblHeader]}`} className="text-blue-500 hover:underline">
            //                                         {tblBody[tblHeader]}
            //                                     </a>
            //                                 ) : slug === 'laboratory' ? (
            //                                     <a href={`/${slug}/${tblBody[tblHeader]}`} className="text-blue-500 hover:underline">
            //                                         {tblBody[tblHeader]}
            //                                     </a>
            //                                 ) : (
            //                                     <></>
            //                                 )
            //                             ) : tblHeader === 'ancillary' ? (
            //                                     tblBody[tblHeader] === "None" && (
            //                                         <span className="p-2 bg-slate-600 text-white rounded-full uppercase font-bold text-xs">{tblBody[tblHeader]}</span>
            //                                     )
            //                             ) : tblHeader === 'laboratory_status' ? (
            //                                     tblBody[tblHeader] === "Pending" ? (
            //                                         <span className="p-2 bg-red-600 text-white rounded-full uppercase font-bold text-xs">{tblBody[tblHeader]}</span>
            //                                     ) :

            //                                     tblBody[tblHeader] === "Available" && (
            //                                         <span className="p-2 bg-green-600 text-white rounded-full uppercase font-bold text-xs">{tblBody[tblHeader]}</span>
            //                                     )
            //                             ) : tblHeader === 'imaging_status' ? (
            //                                     tblBody[tblHeader] === "Pending" ? (
            //                                         <span className="p-2 bg-red-600 text-white rounded-full uppercase font-bold text-xs">{tblBody[tblHeader]}</span>
            //                                     ) :

            //                                     tblBody[tblHeader] === "Available" && (
            //                                         <span className="p-2 bg-green-600 text-white rounded-full uppercase font-bold text-xs">{tblBody[tblHeader]}</span>
            //                                     )
            //                             ) : tblHeader === 'disposition' ? (
            //                                     tblBody[tblHeader] === "Admission" ? (
            //                                         <span className="p-2 bg-blue-600 text-white rounded-full uppercase font-bold text-xs">{tblBody[tblHeader]}</span>
            //                                     ) :

            //                                     tblBody[tblHeader] === "Discharged" && (
            //                                         <span className="p-2 bg-yellow-600 text-white rounded-full uppercase font-bold text-xs">{tblBody[tblHeader]}</span>
            //                                     )
            //                             ) : tblHeader === 'physicians_order' ? (
            //                                 <td className="flex items-center space-x-2">
            //                                     <textarea
            //                                         type="text"
            //                                         name="lastName"
            //                                         placeholder="Click for physicians order"
            //                                         onClick={() => handleClickedPO("po")}
            //                                         className="border border-gray-300 px-3 py-2 w-[20rem] focus:border-gray-500 focus:outline-none"
            //                                     />
            //                                     <button onClick={() => handleClickedPublish("publish")} className="bg-slate-100 border border-gray-500 hover:bg-slate-200 text-gray-500 px-4 py-2 rounded mr-2">Publish</button>
            //                                     <button onClick={() => handleClickedRefer("refer")} className="bg-slate-100 border border-gray-500 hover:bg-slate-200 text-gray-500 px-4 py-2 rounded mr-2">Refer</button>
            //                                     <button onClick={() => handleClickedMGH("refer")} className="bg-slate-100 border border-gray-500 hover:bg-slate-200 text-gray-500 px-4 py-2 rounded mr-2">MGH</button>

            //                                 </td>
            //                             ) : tblHeader === 'result_image' ? (
            //                                 <a href="javascript:void(0)" onClick={() => handleImageView("imgView", tblBody?.result_image)} className="text-blue-500 hover:underline">
            //                                     {tblBody?.image_type}
            //                                 </a>
            //                             ) : (
            //                                 tblBody[tblHeader]
            //                             )}
            //                         </td>
            //                     ))}

            //                     {action && (
            //                         <td className="px-6 py-2 whitespace-nowrap">
            //                             <button title="Add Modules" type="button" onClick={() => openModal(tblBody.user_id)}>
            //                                 <svg fill="none" stroke="currentColor" className="h-5 w-5" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            //                                     <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            //                                 </svg>

            //                             </button>
            //                         </td>
            //                     )}
            //                 </tr>
            //             ))
            //         )}
            //     </tbody>
            // </table>
          )}
        </div>
      </>
    );
  }
);

export default React.memo(Table);
