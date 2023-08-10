import * as React from 'react';

import { rspc } from '@/lib/rspc';

import Layout from '@/components/layout/Layout';
import ManageOrderRow from '@/components/ManageOrderRow';
import Seo from '@/components/Seo';
import Separator from '@/components/Separator';

export default function ManageOrdersPage() {
  const { data: orders } = rspc.useQuery(['orders.admin.get']);

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
          {orders?.map((order) => (
            <ManageOrderRow key={order.id} orders={order} />
          ))}
        </div>
      </main>
    </Layout>
  );
}
