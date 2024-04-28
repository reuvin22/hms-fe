import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { method } from 'lodash';
import PageLoader from 'node_modules/next/dist/client/page-loader';

export const patientApi = createApi({
  reducerPath: 'patientApi',
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
  tagTypes: ['UpdateOPDtoLatest', 'ActiveBedList', 'DoctorOrder', 'MonitoringSheet', 'ApprovePatient'],
  endpoints: (builder) => ({
    autoSaveData: builder.mutation({
      query: (args) => {
        const session = Cookies.get('session');
        const { data, patient_id, actionType } = args;
        // const data = dataArray.map(item => item.fields)
        // console.log(dataArray)
        console.log(data);
        return {
          url: `/auto-save/${patient_id}`,
          method: 'PUT',
          body: {
            data: data,
            actionType: actionType,
            selectedDB: session
          }
        };
      }
    }),

    createPathology: builder.mutation({
      query: (args) => {
        const session = Cookies.get('session');
        const { data, actionType } = args;
        return {
          url: 'create-pathology',
          method: 'POST',
          body: {
            data: data,
            actionType: actionType,
            selectedDB: session
          }
        };
      }
    }),

    getPatientApproval: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { items, page } = args;
        return {
          url: '/get-patient-approval',
          method: 'GET',
          params: {
            slug: 'patient-approval',
            items: items,
            page: page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      },
      providesTags: ['ApprovePatient']
    }),

    getPatientTotal: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-patient-total',
          method: 'GET',
          params: {
            slug: 'total-patient',
            selectedDB: session
          }
        };
      }
    }),

    createPathology: builder.mutation({
      query: (args) => {
        const session = Cookies.get('session');
        const { data, actionType } = args;
        return {
          url: 'create-pathology-parameter',
          method: 'POST',
          body: {
            data: data,
            actionType: actionType,
            selectedDB: session
          }
        };
      }
    }),

    // fetchData: builder.query({
    //     query: (args) => {
    //         const session = Cookies.get('session')
    //         const { data, actionType, url } = args
    //         return {
    //             url: `/${url}`,
    //             method: 'GET',
    //             body: {
    //                 data: data,
    //                 actionType: actionType,
    //                 selectedDB: session
    //             }
    //         }
    //     },
    // }), don't delete; for future used!

    createData: builder.mutation({
      query: (args) => {
        const session = Cookies.get('session');
        const { data, actionType, url } = args;
        return {
          url: `/${url}`,
          method: 'POST',
          body: {
            data: data,
            actionType: actionType,
            selectedDB: session
          }
        };
      },
      invalidatesTags: ['DoctorOrder']
    }),

    deleteData: builder.mutation({
      query: (args) => {
        const session = Cookies.get('session');
        const { data, actionType, url, id } = args;
        return {
          url: `/${url}/${id}`,
          method: 'DELETE',
          body: {
            actionType: actionType,
            selectedDB: session
          }
        };
      },
      invalidatesTags: ['DoctorOrder']
    }),

    deleteApprovedPatient: builder.mutation({
      query: (args) => {
        const session = Cookies.get('session');
        const { actionType, id } = args;
        return {
          url: `delete-approve-patient/${id}`,
          method: 'DELETE',
          body: {
            actionType: 'deleteApprovedPatient',
            selectedDB: session
          }
        };
      }
    }),

    getDoctorOrderList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        return {
          url: '/get-doctor-order',
          method: 'GET',
          params: {
            sort: 'created_at',
            slug: 'doctor-order',
            selectedDB: session
          }
        };
      },
      providesTags: ['DoctorOrder']
      // providesTags: (result, error, id) =>
      //     result
      //         ? [...result.map(({ id }) => ({ type: 'DoctorOrder', id }))]
      //         : ['DoctorOrder']
    }),

    getNurseNoteList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { patient_id } = args;
        return {
          url: '/get-nurse-note',
          method: 'GET',
          params: {
            slug: 'nurse-note',
            selectedDB: session,
            patient_id: patient_id
          }
        };
      }
    }),

    getErPatientList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page, slug } = args;
        return {
          url: '/er-list',
          method: 'GET',
          params: {
            q: keywords,
            slug: slug,
            items: items,
            page: page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getDetailById: builder.query({
      query: (args) => {
        const { user_id } = args;
        const session = Cookies.get('session');
        return {
          url: '/get-detail-by-id',
          method: 'GET',
          params: {
            selectedDB: session,
            user_id: user_id,
            slug: 'detail-information'
          }
        };
      },
      providesTags: ['DoctorOrder']
    }),

    getPersonalInformationList: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-personal-info-list',
          method: 'GET',
          params: {
            selectedDB: session,
            slug: 'all-personal-information'
          }
        };
      }
    }),

    getPatientList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page, slug, patientType } = args;
        return {
          url: '/opd-list',
          method: 'GET',
          params: {
            q: keywords,
            slug: slug,
            items: items,
            page: page,
            sort: 'created_at',
            patientType: patientType,
            selectedDB: session
          }
        };
      },
      providesTags: ['DoctorOrder']
    }),
    

    getInPatientList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page } = args;
        return {
          url: '/opd-list',
          method: 'GET',
          params: {
            q: keywords,
            slug: 'in-patient',
            items: items,
            page: page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      },
      providesTags: ['DoctorOrder']
    }),

    getOutPatientsList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page, slug, patientType } = args;
        return {
          url: '/opd-list',
          method: 'GET',
          params: {
            q: keywords,
            slug: slug,
            items: items,
            page: page,
            sort: 'created_at',
            patientType: patientType,
            selectedDB: session
          }
        };
      },
      providesTags: ['UpdateOPDtoLatest']
    }),

    getPhysicianList: builder.query({
      query: () => {
        const session = Cookies.get('session');
        // const { items, page, patientType } = args
        return {
          url: '/physician-list',
          method: 'GET',
          params: {
            roles: 'doctor',
            slug: 'physician',
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getPhysicianCharge: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/physician-charge',
          method: 'GET',
          params: {
            slug: 'physician-charge',
            selectedDB: session
          }
        };
      }
    }),

    getImgResultList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page, patient_id, slug } = args;
        return {
          url: '/get-imaging-result',
          method: 'GET',
          params: {
            slug: slug,
            patient_id: patient_id,
            items: items,
            page: page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getLabResultList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page, patient_id, slug } = args;
        return {
          url: '/get-lab-result',
          method: 'GET',
          params: {
            slug: slug,
            patient_id: patient_id,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getRadiologyList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { items, page } = args;
        return {
          url: '/get-radiology',
          method: 'GET',
          params: {
            slug: 'radiology-list',
            items: items,
            page: page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getRadiologyCategoryList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { tabs, items, page, keywords } = args;
        return {
          url: '/get-radiology-category',
          method: 'GET',
          params: {
            q: keywords,
            slug: 'radiology-category-list',
            items: items,
            page: page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getRadiologyCategory: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-radiology-category',
          method: 'GET',
          params: {
            slug: 'radiology-category',
            selectedDB: session
          }
        };
      }
    }),

    getPathologyList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { tabs, items, page, keywords } = args;
        return {
          url: '/get-pathology',
          method: 'GET',
          params: {
            q: keywords,
            slug: 'pathology-list',
            items: items,
            page: page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getPathologyCategoryList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { tabs, items, page, keywords } = args;
        return {
          url: '/get-pathology-category',
          method: 'GET',
          params: {
            q: keywords,
            slug: 'pathology-category',
            items: items,
            page: page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getPathologyCategory: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-pathology-category',
          method: 'GET',
          params: {
            slug: 'pathology-parameter-list',
            selectedDB: session
          }
        };
      }
    }),

    getPathologyParameterList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { tabs, items, page, keywords } = args;
        return {
          url: '/get-pathology-parameter',
          method: 'GET',
          params: {
            q: keywords,
            slug: 'pathology-parameter-list',
            items: items,
            page: page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getPathologyParameters: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-pathology-parameter',
          method: 'GET',
          params: {
            slug: 'pathology-parameter',
            selectedDB: session
          }
        };
      }
    }),

    getAllSymptoms: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-symptoms',
          method: 'GET',
          params: {
            slug: 'all-symptoms',
            selectedDB: session
          }
        };
      }
    }),

    getSymptomList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page, tabs } = args;
        return {
          url: '/get-symptoms',
          method: 'GET',
          params: {
            q: keywords,
            slug: 'symptoms',
            items: items,
            page: page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getMedicineList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, patient_id } = args;
        return {
          url: '/get-medicine',
          method: 'GET',
          params: {
            q: keywords,
            // patient_id: patient_id,
            slug: 'medicine',
            selectedDB: session
          }
        };
      }
    }),

    getFilteredMedicineList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page, tabs } = args;
        return {
          url: '/get-medicine',
          method: 'GET',
          params: {
            q: keywords,
            items: items,
            page: page,
            sort: 'created_at',
            slug: 'medicine-filter',
            tabs: tabs,
            selectedDB: session
          }
        };
      }
    }),

    getMedicineFormList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page } = args;
        return {
          url: '/get-medicine',
          method: 'GET',
          params: {
            q: keywords,
            items: items,
            page: page,
            sort: 'created_at',
            slug: 'medicine-form',
            selectedDB: session
          }
        };
      }
    }),

    getMedicineFrequencyList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page } = args;
        return {
          url: '/get-medicine',
          method: 'GET',
          params: {
            q: keywords,
            items: items,
            page: page,
            sort: 'created_at',
            slug: 'medicine-frequency',
            selectedDB: session
          }
        };
      }
    }),

    getPharmacyCategory: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page } = args;
        return {
          url: '/get-pharmcy-category',
          method: 'GET',
          params: {
            q: keywords,
            slug: 'pharmacy-category',
            items: items,
            page: page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getPharmacySupplier: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page } = args;
        return {
          url: '/get-pharmcy-supplier',
          method: 'GET',
          params: {
            q: keywords,
            slug: 'pharmacy-supplier',
            items: items,
            page: page,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    }),

    getHealthMonitor: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-health-monitor',
          method: 'GET',
          params: {
            slug: 'health-monitor',
            selectedDB: session
          }
        };
      },
      
    }),

    getMedicationList: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, patient_id } = args;
        return {
          url: '/get-medication',
          method: 'GET',
          params: {
            patient_id: patient_id,
            slug: 'medication',
            q: keywords,
            selectedDB: session
          }
        };
      }
    }),

    getActiveBedList: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-bed-list',
          method: 'GET',
          params: {
            tabs: 'bed-list',
            selectedDB: session
          }
        };
      },
      providesTags: ['ActiveBedList']
    }),

    getIcd10List: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        return {
          url: '/get-icd10',
          method: 'GET',
          params: {
            slug: 'icd10',
            selectedDB: session
          }
        };
      }
    }),

    updateBulk: builder.mutation({
      query: (args) => {
        const { actionType, data, id } = args;
        const session = Cookies.get('session');
        let url;
        let body;
        switch (actionType) {
          case 'updateEyeCenterAppointment':
            (url = `/update-eyecenter-appointment/${id}`),
              (body = {
                actionType,
                data,
                selectedDB: session
              });
            break;

          case 'updateIsApprove':
            (url = `update-approve-patient/${id}`),
              (body = {
                actionType,
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
      }
    })
  })
});

export const {
  useGetAllSymptomsQuery,
  // useFetchDataQuery,
  useDeleteDataMutation,
  useCreateDataMutation,
  // useCreateBulkMutation,
  useUpdateBulkMutation,
  useGetDoctorOrderListQuery,
  useGetSymptomListQuery,
  useGetPersonalInformationListQuery,
  useGetDetailByIdQuery,
  useGetErPatientListQuery,
  useGetMedicineFormListQuery,
  useGetMedicineFrequencyListQuery,
  useGetFilteredMedicineListQuery,
  useGetNurseNoteListQuery,
  useAutoSaveDataMutation,
  useGetPatientListQuery,
  useGetOutPatientsListQuery,
  useGetPhysicianListQuery,
  useGetPhysicianChargeQuery,
  useGetRadiologyListQuery,
  useGetRadiologyCategoryListQuery,
  useGetPathologyListQuery,
  useGetPathologyCategoryQuery,
  useGetMedicationListQuery,
  useGetIcd10ListQuery,
  useGetActiveBedListQuery,
  useGetImgResultListQuery,
  useGetLabResultListQuery,
  useGetMedicineListQuery,
  useCreatePathologyMutation,
  useGetPathologyCategoryListQuery,
  useGetPathologyParameterListQuery,
  useGetPathologyParametersQuery,
  useGetRadiologyCategory,
  useGetPatientApprovalQuery,
  useGetPatientTotalQuery,
  useGetInPatientListQuery,
  useDeleteApprovedPatientMutation,
  useGetPharmacyCategoryQuery,
  useGetPharmacySupplierQuery,
  useGetHealthMonitorQuery
} = patientApi;
