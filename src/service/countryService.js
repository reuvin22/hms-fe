import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const countryApi = createApi({
  reducerPath: 'countryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.countrystatecity.in/v1/',
    prepareHeaders: (headers, { getState }) => {
      headers.set(
        'X-CSCAPI-KEY',
        'SWNiakhhMFVuZDN1UDJrenc4aHpFY2tXMGtkZkVyQTZXdFhWWlpaTw=='
      );
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getCountryData: builder.query({
      query: () => ({
        url: '/countries',
        method: 'GET'
      })
    })
  })
});

export const { useGetCountryDataQuery } = countryApi;
