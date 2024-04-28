import bloodBank from '@/pages/blood-bank';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const settingApi = createApi({
  reducerPath: 'settingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL,
    prepareHeaders: (headers, { getState }) => {
      // const token = getState().auth.userToken
      const token = Cookies.get('token');
      // console.log(token)
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        return headers;
      }
    }
  }),

  tagTypes: [
    'BedList',
    'FloorList',
    'BedTypeList',
    'BedGroupList',
    'HospitalChargeList',
    'HospitalChargeTypeList',
    'HospitalChargeCategoryList',
    'ActiveBedList',
    'UpdateOPDtoLatest',
    'ApprovePatient'
  ],
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page } = args;
        return {
          url: '/user-list',
          method: 'GET',
          params: {
            q: keywords,
            items,
            page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
      // keepUnusedData: true,
      // refetchOnMount: true,
      // staleTime: 60,
      // cacheTime: 300,
      // keepAllData: true
    }),

    getPermissionList: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/permission',
          method: 'GET',
          params: {
            selectedDB: session
          }
        };
      }
    }),

    getModuleList: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/module',
          method: 'GET',
          params: {
            selectedDB: session
          }
        };
      }
    }),

    getModuleNameList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { tabs, items, page } = args;
        return {
          url: '/module',
          method: 'GET',
          params: {
            tabs,
            items,
            page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getBedList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { tabs, items, page } = args;
        return {
          url: '/bed-management',
          method: 'GET',
          params: {
            tabs,
            items,
            page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      },
      providesTags: ['BedList']
    }),

    getDesignationList: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-designation-list',
          method: 'GET',
          params: {
            slug: 'designation',
            selectedDB: session
          }
        };
      }
    }),

    getBedFloorList: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-bed-floor',
          method: 'GET',
          params: {
            tabs: 'floor',
            selectedDB: session
          }
        };
      },
      providesTags: ['FloorList']
    }),

    getBedTypeList: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-bed-type',
          method: 'GET',
          params: {
            tabs: 'type',
            selectedDB: session
          }
        };
      },
      providesTags: ['BedTypeList']
    }),

    getBedGroupList: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-bed-group',
          method: 'GET',
          params: {
            tabs: 'group',
            selectedDB: session
          }
        };
      },
      providesTags: ['BedGroupList']
    }),

    getHosptlCharge: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-hosptl-charge',
          method: 'GET',
          params: {
            tabs: 'hosptl-charge',
            selectedDB: session
          }
        };
      },
      providesTags: ['HospitalChargeList']
    }),

    getHosptlChargeType: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-hosptl-charge-type',
          method: 'GET',
          params: {
            tabs: 'hosptl-charge-type',
            selectedDB: session
          }
        };
      },
      providesTags: ['HospitalChargeTypeList']
    }),

    getHosptlChargeCategory: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-hosptl-charge-category',
          method: 'GET',
          params: {
            tabs: 'hosptl-charge-category',
            selectedDB: session
          }
        };
      },
      providesTags: ['HospitalChargeCategoryList']
    }),

    getNotification: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-all-notification',
          method: 'GET',
          params: {
            selectedDB: session,
            sort: 'created_at'
          }
        };
      }
    }),

    getInventoryItemStockList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page, slug } = args;
        return {
          url: '/get-inventory-stock-list',
          method: 'GET',
          params: {
            q: keywords,
            slug: 'inventory-stock-list',
            items,
            page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getInventoryCategory: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-inventory-stock-list',
          method: 'GET',
          params: {
            slug: 'item-category',
            selectedDB: session
          }
        };
      }
    }),

    getInventoryCategoryList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page, slug } = args;
        return {
          url: '/get-inventory-stock-list',
          method: 'GET',
          params: {
            slug: 'item-category-list',
            items,
            page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getInventoryIssue: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page, slug } = args;
        return {
          url: '/get-inventory-issue',
          method: 'GET',
          params: {
            q: keywords,
            slug: 'inventory-issue',
            items,
            page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getItemCategoryList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page, tabs } = args;
        return {
          url: 'get-item-category',
          method: 'GET',
          params: {
            slug: 'item-category-list',
            q: keywords,
            items,
            page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getInventoryItemStatus: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-item-status',
          method: 'GET',
          params: {
            slug: 'item_status',
            selectedDB: session
          }
        };
      }
    }),

    getAboutUsInfo: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-about-us',
          method: 'GET',
          params: {
            slug: 'get-about-us-info',
            selectedDB: session
          }
        };
      }
    }),

    getAboutUs: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { tabs, items, page } = args;
        return {
          url: '/get-about-us',
          method: 'GET',
          params: {
            slug: 'get-about-us-list',
            items,
            page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getEyeCenterAppointmentList: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-eyecenter-list',
          method: 'GET',
          params: {
            slug: 'eyecenter-appointment-list',
            selectedDB: session
          }
        };
      }
    }),

    createUserBatch: builder.mutation({
      query: (dataArray) => {
        const data = dataArray.map((item) => item.fields);
        const session = Cookies.get('session');
        return {
          url: '/user-bulk-registration',
          method: 'POST',
          body: {
            data,
            selectedDB: session
          }
        };
      }
    }),

    // deleteApproval: builder.mutation({
    //   query: (args) => {
    //     const session = Cookies.get('session');
    //     const { id } = args;
    //     return {
    //       url: `delete-approve-patient/${id}`,
    //       method: 'DELETE',
    //       body: {
    //         actionType: 'deletePatientApproval',
    //         selectedDB: session
    //       }
    //     };
    //   }
    // }),

    updateBulk: builder.mutation({
      query: (args) => {
        const { actionType, data, id } = args;
        const session = Cookies.get('session');
        let url;
        let body;
        switch (actionType) {
          case 'updateMedicines':
          case 'updateMedication':
            (url = `/update-patient-medication/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;
          case 'updatePathologyTest':
            (url = `/update-pathology-test/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updatePathologyParameter':
            (url = `/update-pathology-parameter/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updatePathologyCategory':
            (url = `/update-pathology-category/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateRadiology':
            (url = `/update-radiology/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateRadiologyCategory':
            (url = `/update-radiology-category/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateSymptom':
            (url = `/update-symptom/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateHospitalCharge':
            (url = `/update-hospital-charge/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateHospitalChargeType':
            (url = `/update-hospital-charge-type/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateHospitalChargeCategory':
            (url = `/update-hospital-charge-type/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateHospitalPhysicianCharge':
            (url = `/update-hospital-physician-charge/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateHospitalPhysicianCharge':
            (url = `/update-hospital-physician-charge/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateHospitalPhysicianCharge':
            (url = `/update-hospital-physician-charge/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateBedGroup':
            (url = `/update-bed-group/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateBedType':
            (url = `/update-bed-type/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateBedList':
            (url = `/update-bed-list/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateBedFloor':
            (url = `/update-bed-floor/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateHospitalChargeOpd':
            (url = `/update-hospital-charge-opd/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateHospitalChargeEr':
            (url = `/update-hospital-charge-opd/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateAboutUs':
            (url = `/update-about-us/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateModule':
            (url = `/update-module/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateDoctorOrders':
            (url = `/update-progress-note/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updatePhysicianOrder':
            (url = `/update-physician-order/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          default:
            break;
        }
        return {
          url,
          method: 'PUT',
          body
        };
      },
    }),

    createBulk: builder.mutation({
      query: (args) => {
        const { actionType, data, nurseId, patientId, physicianId } = args;
        const session = Cookies.get('session');
        let url;
        let body;
        switch (actionType) {
          case 'createEyeCenterAppointment':
            (url = '/create-eyecenter-appointment'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;
          case 'createDoctorOrderNewRow':
            (url = '/create-doctor-order-row'),
              (body = {
                actionType,
                nurseId,
                patientId,
                physicianId,
                selectedDB: session
              });
            break;

          case 'createSymptom':
            (url = '/create-symptom'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createMedicine':
            (url = '/create-pharmcy-medicine'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createMedicineForm':
            (url = '/create-pharmcy-medicine'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createMedicineFrequency':
            (url = '/create-pharmcy-medicine'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createPharmacyCategory':
            (url = '/create-pharmcy-category'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createPharmacySupplier':
            (url = '/create-pharmcy-supplier'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;
          case 'createNurseNote':
            (url = '/create-nurse-note'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                patientId: data[0].patientId,
                selectedDB: session
              });
            break;
          case 'createNurseIVF':
            (url = '/create-nurse-note'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                patientId: data[0].patientId,
                selectedDB: session
              });
            break;
          case 'createNurseMedication':
            (url = '/create-nurse-note'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;
          case 'createNurseVitalS':
            (url = '/create-nurse-note'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                patientId: data[0].patientId,
                selectedDB: session
              });
            break;

          case 'createPrescription':
            (url = '/create-prescription'),
              (body = {
                data,
                patient_id: patientId,
                physician_id: physicianId,
                selectedDB: session,
                actionType
              });
            break;
          case 'createDoctorRequest':
            (url = '/create-doctor-request'),
              (body = {
                actionType,
                // labCategory: "",
                data,
                selectedDB: session
              });
            break;

          case 'createUser':
            (url = '/user-bulk-registration'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createBedFloor':
            (url = '/create-bed-floor'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;
          case 'createBedGroup':
            (url = '/create-bed-group'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;
          case 'createBedType':
            (url = '/create-bed-type'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;
          case 'createBed':
            (url = '/create-bed'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createHosptlCharge':
            (url = '/create-hosptl-charge'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createHosptlChargeCat':
            (url = '/create-hosptl-charge-cat'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createHosptlPhyChargeOpd':
            (url = '/create-hosptl-phy-opd'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createHosptlPhyChargeEr':
            (url = '/create-hosptl-phy-er'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createHosptlChargeType':
            (url = '/create-hosptl-charge-type'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createOutPatient':
            (url = '/create-out-patient'),
              (body = {
                // notifications
                title: 'Newly Added Patient',
                message: 'need for consultations',
                action: 'admitted',

                patientType: 'new_opd',
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createInPatient':
            (url = '/create-in-patient'),
              (body = {
                patientType: 'new_ipd',
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createErPatient':
            // console.log(data)
            (url = '/create-patient'),
              (body = {
                patientType: 'new_er',
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createModule':
            (url = '/create-module'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createPathologyTest':
            (url = '/create-pathology-test'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;
          // case 'createInPatient':
          //     url = '/create-in-patient',
          //     body = {
          //         patientType: 'new',
          //         actionType: actionType,
          //         data: data.map(item => item.fields),
          //         selectedDB: session
          //     }
          //     break

          case 'createHealthMonitor':
            (url = '/create-health-monitor'),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'createPathologyCategory':
            (url = 'create-pathology-category'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;
          case 'createPathologyParameter':
            (url = 'create-pathology-parameter'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createRadiologyCategory':
            (url = 'create-radiology-category'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createRadiology':
            (url = 'create-radiology'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createInventoryStockList':
            (url = 'create-inventory-stock-list'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createInventoryCategory':
            (url = 'create-inventory-category'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createInventoryIssue':
            (url = 'create-inventory-issue'),
              (body = {
                actionType,
                data: data.map((item) => item.fields),
                selectedDB: session
              });
            break;

          case 'createAboutUs':
            (url = 'create-about-us'),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'createApprovePatient':
            (url = 'create-approve-patient'),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'createOrderList':
            (url = 'create-doctor-order'),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'createProgressNotes':
            (url = 'create-progress-notes-list'),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;
          // default:
          //     break
        }
        return {
          url,
          method: 'POST',
          body
        };
      },
      invalidatesTags: [
        'BedList',
        'FloorList',
        'BedTypeList',
        'BedGroupList',
        'HospitalChargeList',
        'HospitalChargeTypeList',
        'HospitalChargeCategoryList',
        'ActiveBedList',
        'UpdateOPDtoLatest'
      ]
    })
  })
});

export const {
  useGetDesignationListQuery,
  useGetUserListQuery,
  useGetPermissionListQuery,
  useGetModuleListQuery,
  useGetModuleNameListQuery,
  useCreateBulkMutation,
  useUpdateBulkMutation,
  useGetBedListQuery,
  useGetBedFloorListQuery,
  useGetBedTypeListQuery,
  useGetBedGroupListQuery,
  useGetHosptlChargeQuery,
  useGetHosptlChargeTypeQuery,
  useGetHosptlChargeCategoryQuery,
  useGetNotificationQuery,
  useGetInventoryItemStockListQuery,
  useGetInventoryCategoryQuery,
  useGetInventoryIssueQuery,
  useGetInventoryItemStatusQuery,
  useGetItemCategoryListQuery,
  useGetPathologyCategoryQuery,
  useGetAboutUsQuery,
  useGetAboutUsInfoQuery,
  useCreateAboutUsMutation,
  useDeleteApprovedPatientMutation,
  useGetInventoryCategoryListQuery,
  useGetEyeCenterAppointmentListQuery
} = settingApi;
