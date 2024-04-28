import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { useLoginMutation } from '@/service/loginService';
import { useGetUserDetailsQuery } from '@/service/authService';
import { useGetModuleListQuery } from '@/service/settingService';
import { useDispatch, useSelector } from 'react-redux';
import SystemError from '@/components/SystemError';
import Cookies from 'js-cookie';

const withAuth = (WrappedContent) => {
  const MemoizedWrappedContent = React.memo(WrappedContent);

  return function (props, parentLoading) {
    const router = useRouter();
    const token = Cookies.get('token');

    useEffect(() => {
      if (typeof window !== 'undefined' && !token) {
        const timer = setTimeout(() => {
          router.replace('/login');
        }, 1000);

        return () => clearTimeout(timer);
      }
    }, [router, token]);

    if (!token) {
      return <SystemError />;
    }

    return <MemoizedWrappedContent {...props} />;
  };
};

export default withAuth;
