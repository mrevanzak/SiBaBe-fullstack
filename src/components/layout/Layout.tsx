import { useAuth } from '@clerk/nextjs';
import { useIsFetching } from '@tanstack/react-query';
import * as React from 'react';
import { toast } from 'react-toastify';

import { useJwtStore } from '@/lib/store';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  const isLoading = useIsFetching({
    predicate: (query) => query.state.status === 'loading',
  });

  if (isLoading) {
    toast.loading('Loading...', {
      toastId: 'loading',
    });
  }

  if (!isLoading) {
    toast.dismiss('loading');
  }

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
