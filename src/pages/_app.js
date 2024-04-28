import 'tailwindcss/tailwind.css';
import 'public/assets/css/style.css';
import Head from 'next/head';
import getConfig from 'next/config';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { makeStore } from '@/store/store';
import Loading from '@/components/Loading';

export default function App({ Component, pageProps }) {
  const { store, persistor } = makeStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a 2-second loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // Adjust the delay time as needed
  }, []);
  // a
  return (
    <>
      <Head>
        {/* HELLOW WORLD */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="https://i.imgur.com/OyjAuyh.png" />
        <link rel="manifest" href="/manifest.json" />

        <title>Loading...</title>
      </Head>
      <Provider store={store}>
        {isLoading ? <Loading /> : <Component {...pageProps} />}
      </Provider>
    </>
  );
}
