import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

const session = Cookies.get('session');
export const pdfApi = createApi({
  reducerPath: 'pdfApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = Cookies.get('token');
      // console.log(token)
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        return headers;
      }
    },
    responseHandler: async (response) => {
      if (response.headers.get('Content-Type') === 'application/pdf') {
        return await response.blob();
      }
      return await response.json();
    }
  }),
  endpoints: (builder) => ({
    generatePdf: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        return {
          url: '/generatePDF',
          method: 'GET',
          params: {
            selectedDB: session,
            pdfCategory: args.pdfCategory
          }
        };
      }
    })
  })
});

export const {
  /* useGeneratePdfMutation */
  useGeneratePdfQuery
  // useGetPrescriptionPdfQuery
} = pdfApi;
