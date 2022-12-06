import * as React from 'react';

import { useAppSelector } from '@/hooks/redux';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

import { API_URL, httpClient } from '@/pages/api/products';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector(({ user }) => user);

  React.useEffect(() => {
    if (user) {
      httpClient.defaults.headers.Authorization = `Bearer ${user.token}`;
      httpClient.defaults.baseURL = API_URL + '/jwt';
    }
  }, [user]);

  return (
    <>
      <main
        style={{
          background:
            'linear-gradient(243.81deg, #F4EBD0 16.52%, #FFFFFF 98.02%)',
        }}
      >
        <Header />
        {children}
        <Footer />
      </main>
    </>
  );
}
