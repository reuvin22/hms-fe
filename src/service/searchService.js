import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = Cookies.get('token');
      // console.log(token)
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        return headers;
      }
    }
  }),

  endpoints: (builder) => ({
    search: builder.query({
      query: (args) => {
        const session = Cookies.get('session');
        const { keywords, model, items, page } = args;
        return {
          url: `/search?q=${keywords}`,
          method: 'GET',
          params: {
            type: model,
            selectedDB: session
            // items: items,
            // page: page
          }
        };
      }
    })
  })
});

export const { useSearchQuery } = searchApi;
