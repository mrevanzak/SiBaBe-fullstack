import * as React from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
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
        <ToastContainer position='top-center' />
      </main>
    </>
  );
}
