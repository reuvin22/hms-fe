import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const icdApi = createApi({
  reducerPath: 'icdApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/'
  }),
  endpoints: (builder) => ({
    getICDData: builder.query({
      query: ({ keywords }) => ({
        url: 'search',
        method: 'GET',
        // params: { q: keywords }
        params: {
          sf: 'code,name',
          terms: keywords
        }
      }),
      onError: async (error, thunkApi, originalArgs) => {
        if (error.status === 401) {
          console.log(error);
        }
      }
    })
  })
});

export const { useGetICDDataQuery } = icdApi;
