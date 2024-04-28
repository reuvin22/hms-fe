import Head from 'next/head';
import GuestLayout from '@/components/Layouts/GuestLayout';
import Login from './login';

export default function Home() {
  return (
    <>
      <Head>
        <title>Laravel</title>
      </Head>

      {/* <Login /> */}
      {/* <TimeTracker /> */}
      <GuestLayout>
        <div className="container mx-auto p-4">
          <h2 className="text-lg font-semibold mb-2">
            Welcome to our website!
          </h2>
          <p className="text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit...
          </p>
        </div>
      </GuestLayout>
    </>
  );
}
