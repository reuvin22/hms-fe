import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const dohApi = createApi({
  reducerPath: 'dohApi',
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

  endpoints: (builder) => ({
    getStatisticalReport: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { slug } = args;
        let url;
        let params;

        switch (slug) {
          case 'info_classification':
            (url = '/get-info-classification'),
              (params = {
                slug,
                selectedDB: session
              });
            break;

          default:
            break;
        }
        return {
          url,
          method: 'GET',
          body: params
        };
      }
    }),
    getInfoClassification: builder.query({
      query: () => {
        const session = Cookies.get('session');
        return {
          url: '/get-info-classification',
          method: 'GET',
          params: {
            slug: 'info_classification',
            selectedDB: session
          }
        };
      }
    }),

    submitAnnualReport: builder.mutation({
      query: (args) => {
        const session = Cookies.get('session');
        const { url, slug, reportingYear } = args;
        return {
          url,
          method: 'GET',
          params: {
            slug,
            reportingYear,
            selectedDB: session
          }
        };
      }
    })
  })
});

export const {
  useGetStatisticalReportQuery,
  useGetInfoClassificationQuery,
  useSubmitAnnualReportMutation
} = dohApi;
