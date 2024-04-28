import { useState, useEffect } from 'react';
import Table from '@/components/Table';
import { TableContext, useComponentContext } from '@/utils/context';
import {
  useUpdateBulkMutation,
  useCreateBulkMutation
} from '@/service/settingService';
import { update } from 'lodash';
import {
  useGetDetailByIdQuery,
  useGetDoctorOrderListQuery,
  useCreateDataMutation
} from '@/service/patientService';

const doctorOrderData = [
  {
    date: '23 Aug 23',
    time: '14:23',
    progress_notes: 'lorem ispum',
    physicians_order: '',
    nurse_in_charge: 'Jane Smith'
  }
];

const doctorOrderForm = [
  { tdName: 'date_time' },
  { tdName: 'progress_notes' },
  { tdName: 'physician_orders' },
  { tdName: 'nurse_incharge' }
  // {date_time: '', progress_notes: '', physicians_order: '', nurse_incharge: ''}
];

function DoctorOrder({ onModalState, data }) {
  const componentContext = useComponentContext();
  const profileData = componentContext?.state?.profileData;
  const [hoveringOverTh, setHoveringOverTh] = useState(false);
  const [hoveringOverTd, setHoveringOverTd] = useState(false);
  const [formData, setFormData] = useState([]);
  const [publish, setPublish] = useState(false);
  const [createData] = useCreateDataMutation();
  const [physicianOrder, setPhysicianOrder] = useState({
    orderList: [],
    orderField: {},
    progressNotesList: [],
    progressNotesField: {},
    medicationField: '',
    ivfField: '',
    labTestField: '',
    imagingField: '',
    selectedOption: 'medication'
  });

  const [orderList, setOrderList] = useState({
    nurse_incharge: profileData.admitting_clerk,
    physician_id: profileData.admitting_physician,
    patient_id: profileData.patient_id,
    description: '',
    name: physicianOrder?.selectedOption
  });

  
  const [progressNotes, setProgressNotes] = useState({
    order_id: null,
    nurse_incharge: profileData.admitting_clerk,
    physician_id: profileData.admitting_physician,
    patient_id: profileData.patient_id,
    progress_notes: ''
  });

  const [idCounter, setIdCounter] = useState(0);
  const initialRow = doctorOrderForm.reduce((acc, item) => {
    acc[item.tdName] = '';
    return acc;
  }, {});

  const [createBulk] = useCreateBulkMutation();
  const [updateBulk] = useUpdateBulkMutation();

  const nurseName =
    componentContext?.state?.profileData?.clerk_data_info?.last_name +
    componentContext?.state?.profileData?.clerk_data_info?.first_name;

  useEffect(() => {
    setFormData(data || []);
  }, [data]);

  const [rows, setRows] = useState([initialRow]);

  const handleAddRow = () => {
    componentContext?.onAddData({ slug: 'add-row-doctor-order' });
  };

  const handleDeleteRow = (index) => {
    componentContext?.onRemoveData({
      slug: 'remove-row-doctor-order',
      id: index
    });
  };

  const handleOnClick = (data) => {
    switch (data.type) {
      case 'saveOrder':
        setPhysicianOrder((prev) => ({
          ...prev,
          orderList: [
            {
              id: data.rowId,
              patient_id: profileData?.patient_id,
              physician_id: profileData?.admitting_physician,
              nurse_incharge: profileData?.admitting_clerk,
              name: 'Order',
              description: physicianOrder.orderField[data.rowId]
            },
            ...prev.orderList
          ],
          orderField: {
            ...prev.orderField,
            [data.rowId]: ''
          }
        }));
        createData({ url: 'create-doctor-order', actionType: 'createOrderList', data: orderList });
        updateBulk({
          actionType: 'updatePhysicianOrder',
          data: data.value,
          id: data.rowId
        });
        break;

      case 'progressNotes':
        setPhysicianOrder((prev) => ({
          ...prev,
          progressNotesList: [
            {
              id: data.rowId,
              nurse_incharge: profileData?.admitting_clerk,
              physician_id: profileData?.admitting_physician,
              patient_id: profileData?.patient_id,
              name: 'Notes',
              progress_notes: physicianOrder.progressNotesField[data.rowId]
            },
            ...prev.progressNotesList
          ],
          progressNotesField: {
            ...prev.progressNotesField,
            [data.rowId]: ''
          }
        }));

        createBulk({ actionType: 'createProgressNotes', data: progressNotes });
        break;

      case 'openModal':
        componentContext?.onModalOpen({
          type: data.value,
          modalType: data.value,
          modalState: true
        });
        break;

      case 'publish':
        componentContext?.onModalOpen({
          type: 'publish',
          modalType: 'publish',
          modalState: true
        });

        break;

      default:
        break;
    }
  };

  const handleOnChange = (data) => {
    switch (data.type) {
      case 'orderTextField':
        setPhysicianOrder((prev) => ({
          ...prev,
          orderField: {
            ...prev.orderField,
            [data.rowId]: data.value
          }
        }));
        setOrderList((prev) => ({
          ...prev,
          order_id: data.id,
          description: data.value
        }));
        break;

      case 'selectionGo':
        setPhysicianOrder((prev) => ({
          ...prev,
          selectedOption: data.value
        }));
        break;

      case 'progressNotes':
        setPhysicianOrder((prev) => ({
          ...prev,
          progressNotesField: {
            ...prev.progressNotesField,
            [data.rowId]: data.value
          }
        }));

        setProgressNotes((prev) => ({
          ...prev,
          order_id: data.id,
          progress_notes: data.value
        }));
        break;

      default:
        break;
    }
  };

  const test = profileData.doctor_orders.some(
    (items) => items.order_lists.length === 0
  );
  console.log(test);
  return (
    <div>
      <table className="border-none min-w-full divide-y divide-gray-200">
        <thead>
          <tr
            onMouseEnter={() => setHoveringOverTh(true)}
            onMouseLeave={() => setHoveringOverTh(false)}
            className="hover:cursor-pointer"
          >
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date/Time
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progress Notes
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Physician's Order
            </th>
            <th className="px-2 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              In-Charge
            </th>
            <th className="w-[3rem] bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" />
            {hoveringOverTh && (
              <button
                onClick={handleAddRow}
                title="Add Row"
                className="flex justify-center bg-blue-500 hover:bg-blue-600 absolute p-2 -translate-x-10 text-white  hover:text-white"
              >
                <svg
                  dataSlot="icon"
                  fill="none"
                  className="w-6 h-6 "
                  strokeWidth={1.5}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </button>
            )}
          </tr>
        </thead>

        <tbody>
          {formData?.length === 0 &&
          profileData?.doctor_orders?.length === 0 ? (
            // console.log(profileData.doctor_orders)
            <tr>
              <td colSpan="4" className="px-6 py-2 text-center">
                No records found.
              </td>
            </tr>
          ) : (
            formData?.map((row, rowIndex) =>
              row.patient_id !== profileData.patient_id ? null : (
                <tr key={rowIndex}>
                  <td className="align-top text-center p-2 border-r border-b border-gray-300 w-24">
                    {row?.date_time || ''}
                  </td>
                  <td className="align-top text-center p-2 border-r border-b border-gray-300 w-80">
                    <div className="top-0 auto">
                      <textarea
                        type="text"
                        name="progress_notes"
                        placeholder="Type..."
                        className="border p-2 border-gray-300 h-32 w-full focus:border-gray-500 focus:outline-none"
                        value={physicianOrder?.progressNotesField[row.id]}
                        onChange={(e) =>
                          handleOnChange({
                            type: 'progressNotes',
                            value: e.target.value,
                            id: row?.id,
                            rowId: row.id
                          })
                        }
                      />
                      <button
                        onClick={() =>
                          handleOnClick({
                            type: 'progressNotes',
                            rowId: row.id
                          })
                        }
                        className="bg-blue-500 hover:bg-blue-700 border w-full text-sm border-none  text-white font-bold px-4 py-2 rounded"
                      >
                        Save
                      </button>
                    </div>
                    {physicianOrder.progressNotesList?.filter(
                      (note) => note.id === row.id
                    ).length === 0 ? (
                      <div className="p-4 border border-gray-400 mt-2 border-dashed rounded-md">
                        <span className="text-gray-400">
                          No Order Available
                        </span>
                      </div>
                    ) : (
                      physicianOrder.progressNotesList?.map((note, index) =>
                        row.id !== note.id ? null : (
                          <div
                            key={index}
                            className="text-left p-4 bg-gray-200 mt-2 rounded-md border border-gray-300"
                          >
                            <span className="text-green-700 font-bold">
                              Notes:{' '}
                            </span>
                            {note.progress_notes}
                          </div>
                        )
                      )
                    )}
                    {data?.length > 0 ? (
                      data.map((item, index) =>
                        item.patient_id !== profileData.patient_id ? null : (
                          <div key={index}>
                            {item.progress_notes?.length > 0
                              ? item.progress_notes.map((note, indexNotes) =>
                                  row.id === note.order_id ? (
                                    <div
                                      key={indexNotes}
                                      className="text-left p-4 bg-gray-200 mt-2 rounded-md border border-gray-300"
                                    >
                                      <span className="text-green-700 font-bold">
                                        Notes:{' '}
                                      </span>
                                      {note.progress_notes}
                                    </div>
                                  ) : null
                                )
                              : null}
                          </div>
                        )
                      )
                    ) : (
                      <div className="p-4 border border-gray-400 mt-2 border-dashed rounded-md">
                        <span className="text-gray-400">
                          No Notes Available
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="align-top text-center p-2 border-r border-b border-gray-300">
                    {console.log(physicianOrder.orderField[row.id])}
                    <div>
                      <div>
                        <textarea
                          type="text"
                          name="physician_order"
                          placeholder="Type..."
                          value={physicianOrder.orderField[row.id] || ''}
                          // onClick={() => handleOnClick({type: "openDrawer"})}
                          onChange={(e) =>
                            handleOnChange({
                              type: 'orderTextField',
                              value: e.target.value,
                              id: row?.id,
                              rowId: row.id
                            })
                          }
                          className="border p-2 border-gray-300 h-32 w-full focus:border-gray-500 focus:outline-none"
                        />

                        <div className="flex justify-between gap-7">
                          <div className="flex gap-1">
                            <select
                              onChange={(e) =>
                                handleOnChange({
                                  type: 'selectionGo',
                                  value: e.target.value
                                })
                              }
                              className="border border-gray-300 rounded px-4 py-1 focus:outline-none text-sm"
                            >
                              <option value="medication">Medication </option>
                              <option value="ivfluid">IV Fluid</option>
                              <option value="lab_test_imaging">
                                Lab Tests/Imaging
                              </option>
                            </select>
                            <button
                              onClick={() =>
                                handleOnClick({
                                  type: 'openModal',
                                  value: physicianOrder.selectedOption
                                })
                              }
                              className="bg-green-500 border text-sm font-bold border-none hover:bg-green-700 text-white p-2 rounded"
                            >
                              Go
                            </button>
                          </div>
                          <button
                            onClick={() =>
                              handleOnClick({
                                type: 'saveOrder',
                                rowId: row.id
                              })
                            }
                            className={`${physicianOrder.orderField[row.id] === undefined || physicianOrder.orderField[row.id] === '' ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-700'}  border w-full text-sm border-none  text-white font-bold px-4 py-2 rounded`}
                            disabled={
                              physicianOrder.orderField[row.id] === undefined ||
                              physicianOrder.orderField[row.id] === ''
                            }
                          >
                            Save
                          </button>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            className={`${
                              profileData.doctor_orders?.some(
                                (items) =>
                                  row.id !== items.order_id &&
                                  items.order_lists.length === 0
                              )
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-gray-500 hover:bg-slate-200 cursor-pointer'
                            } bg-slate-100 border text-xs text-gray-500 px-4 py-2 rounded mr-2`}
                            onClick={() =>
                              handleOnClick({
                                type: 'publish'
                              })
                            }
                            disabled={
                              profileData.doctor_orders?.some(
                                (items) => items.order_lists.length === 0
                              )
                                ? true
                                : false
                            }
                          >
                            Publish
                          </button>
                          <button
                            className="bg-slate-100 border text-xs border-gray-500 hover:bg-slate-200 text-gray-500 px-4 py-2 rounded mr-2 cursor-not-allowed"
                            disabled
                          >
                            Refer
                          </button>
                          <button
                            className="bg-slate-100 border text-xs border-gray-500 hover:bg-slate-200 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
                            disabled
                          >
                            MGH
                          </button>
                        </div>
                      </div>
                      {/* {physicianOrder.orderList?.map((orders, index) =>
                        row.id !== orders.id ? null : (
                          <div
                            key={index}
                            className="text-left p-4 bg-gray-200 mt-2 rounded-md border border-gray-300"
                          >
                            <span className="text-green-700 font-bold">{`${orders.name}:`}</span>{' '}
                            {orders.description}
                          </div>
                        )
                      )} */}
                      {console.log(profileData.doctor_orders)}
                      {profileData.doctor_orders?.length > 0 ? (
                        profileData.doctor_orders.map((items, index) => (
                          <div key={index}>
                            {items.order_lists.map((note, noteIndex) =>
                              row.id === note.order_id ? (
                                <div
                                  key={noteIndex}
                                  className="text-left p-4 bg-gray-200 mt-2 rounded-md border border-gray-300"
                                >
                                  <span className="text-green-700 font-bold">{`${note.name}:`}</span>{' '}
                                  {note.description}
                                </div>
                              ) : null
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-4 border border-gray-400 mt-2 border-dashed rounded-md">
                          <span className="text-gray-400">
                            No Order Available
                          </span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="align-top text-center p-2 border-r border-b border-gray-300 w-24">
                    {nurseName}
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
                      className="relative rounded-md translate-x-0.5 h-full p-2 focus:outline-none text-white bg-[#cb4949]"
                    >
                      <svg
                        fill="none"
                        className="h-6 w-6"
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
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorOrder;
