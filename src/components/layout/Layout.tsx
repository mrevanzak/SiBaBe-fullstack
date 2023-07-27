import { useAuth } from '@clerk/nextjs';
import * as React from 'react';

import { useJwtStore } from '@/lib/store';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const setToken = useJwtStore((s) => s.setJwt);

  React.useEffect(() => {
    const token = async () => {
      return await getToken();
    };
    token().then((res) => setToken(res));
  }, [getToken]);

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
