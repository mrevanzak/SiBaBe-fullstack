import * as React from 'react';

import { HistoryMock } from '@/data';

import HistoryRow from '@/components/HistoryRow';
import withAuth from '@/components/hoc/withAuth';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Separator from '@/components/Separator';

export default withAuth(HistoryPage, 'all');
function HistoryPage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <div className='layout min-h-main mb-12 flex flex-col'>
          <p className='text-xl font-bold'>Riwayat</p>
          <Separator
            width='100%'
            height={2}
            color='#D6AD60BF'
            className='mt-8'
          />
          {HistoryMock.map((history) => (
            <HistoryRow key={history.id} history={history} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
