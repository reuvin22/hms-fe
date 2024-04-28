import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const hospitalChargeApi = createApi({
  reducerPath: 'hospitalChargeApi',
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
    getHospitalCharge: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, items, page, tabs } = args;
        return {
          url: '/charge-list',
          method: 'GET',
          params: {
            q: keywords,
            items,
            page,
            tabs,
            sort: 'created_at',
            selectedDB: session
          }
        };
      }
    })
  })
});

export const { useGetHospitalChargeQuery } = hospitalChargeApi;
