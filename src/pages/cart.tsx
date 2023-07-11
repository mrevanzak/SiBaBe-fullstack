import * as React from 'react';

import { rspc } from '@/lib/rspc';

import Button from '@/components/buttons/Button';
import CartRow from '@/components/CartRow';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Separator from '@/components/Separator';

import thousandSeparator from '@/utils/thousandSeparator';

export default function CartPage() {
  const { data } = rspc.useQuery(['carts.get']);

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <div className='layout min-h-main mb-12 flex flex-col'>
          <p className='text-xl font-bold'>Keranjang</p>
          <Separator
            width='100%'
            height={2}
            color='#D6AD60BF'
            className='mt-8'
          />
          <div className='mb-8 mt-12 flex'>
            <div className='w-1/2 pl-6'>Produk</div>
            <div className='w-1/4 text-center'>Kuantitas</div>
            <div className='w-1/4 text-center'>Jumlah</div>
          </div>
          <Separator width='100%' color='#D6AD60BF' />
          {data?.product_carts.map((product) => (
            <div key={product.product_id}>
              <CartRow cartItems={product} />
              <Separator width='100%' color='#D6AD60BF' />
            </div>
          ))}
          <div className='mt-9 flex items-center justify-end gap-7'>
            <div className='text-end'>
              <p className='font-secondary text-sm font-semibold'>
                Total Harga
              </p>
              <p className='font-secondary text-2xl font-bold'>
                Rp {thousandSeparator(data?.total_price || 0)}
              </p>
            </div>
            <div>
              <Button
                className='rounded-3xl bg-brown px-28 py-6 font-secondary'
                // onClick={() => {
                //   router.push('/order');
                //   dispatch(clearCheckoutMessage());
                // }}
              >
                BELI
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
