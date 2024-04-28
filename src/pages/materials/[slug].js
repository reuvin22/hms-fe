import Head from 'next/head';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import AppLayout from '@/components/Layouts/AppLayout';

const SubModule = () => {
  const formRef = useRef(null);
  const menuGroup = 'materials';
  const router = useRouter();
  const { slug } = router.query;
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const calculateHeight = () => {
      const windowHeight = window.innerHeight;
      setContentHeight(windowHeight);
    };
    calculateHeight();

    // Recalculate height on window resize
    window.addEventListener('resize', calculateHeight);
    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, []);

  return (
    <AppLayout
      moduleId={slug}
      menuGroup={menuGroup}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          {slug}
        </h2>
      }
    >
      <Head>
        <title></title>
      </Head>

      <div className="pl-[5rem] pr-[5rem]">
        <div
          className="relative overflow-x-hidden"
          style={{ height: `${contentHeight}px` }}
        >
          {slug}
        </div>
      </div>
    </AppLayout>
  );
};

export default SubModule;
