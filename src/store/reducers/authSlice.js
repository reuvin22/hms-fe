import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { userLogin, userGrants } from '../actions/authActions';

// initialize userToken from cookies
const userToken = Cookies.get('token') ? Cookies.get('token') : null;

const isLoggedIn = Cookies.get('isLoggedIn') ? Cookies.get('isLoggedIn') : null;

console.log(userToken);

const initialState = {
  loading: false,
  userDetails: null,
  userInfo: null,
  userToken,
  error: null,
  success: false,
  // isLoggedIn: false,
  isLoggedIn,
  module: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove('token');
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      (state.error = null), (state.isLoggedIn = false), Router.push('/');
    },
    setCredentials: (state, { payload }) => {
      state.userInfo = payload;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // user login
      // .addCase(userLogin.pending, (state) => {
      //     state.error = null,
      //     state.loading = true
      //     state.isLoggedIn = false
      // })
      // .addCase(userLogin.fulfilled, (state, action) => {
      //     // console.log(state.isLoggedIn)
      //     state.loading = false
      //     state.success = false
      //     state.userInfo = action.payload,
      //     state.userToken = action.payload.token
      //     // if(action.payload.userInfo !== "") {

      //     //     state.isLoggedIn = action.payload.loggedIn
      //     // }
      //     Router.push('/dashboard')

      // })
      // .addCase(userLogin.rejected, (state, action) => {
      //     state.loading = false
      //     state.isLoggedIn = false
      //     state.error = action.payload
      // })

      // catch user modules
      .addCase(userGrants.pending, (state) => {
        (state.error = null), (state.loading = false);
      })
      .addCase(userGrants.fulfilled, (state, action) => {
        // console.log(action.payload)
        state.loading = false;
        state.success = true;
        state.module = action.payload;
      })
      .addCase(userGrants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
