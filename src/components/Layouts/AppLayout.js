import { createContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useGetUserDetailsQuery } from '@/service/authService';
// import { fetchUserDetails } from '@/store/actions/authActions'
import { useLoginMutation } from '@/service/loginService';
import Cookies from 'js-cookie';

// components
import Navigation from '@/components/Layouts/Navigation';

export const AppLayoutContext = createContext({
  props: null,
  globalRef: null,
  onClose: () => {}
});
function AppLayout({ ...props }) {
  // header, children, moduleId, menuGroup, isLoading,

  // return <Navigation menuGroup={menuGroup} isLoading={isLoading} moduleId={moduleId} children={children}/>
  const contextValue = useMemo(() => ({ ...props }), [props]);
  return (
    <AppLayoutContext.Provider
      value={{
        props: contextValue
      }}
    >
      <Navigation />
    </AppLayoutContext.Provider>
  );
}

export default AppLayout;
