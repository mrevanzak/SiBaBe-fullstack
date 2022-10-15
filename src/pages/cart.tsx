import * as React from 'react';

import { ProductMock } from '@/data';

import Button from '@/components/buttons/Button';
import CartRow from '@/components/CartRow';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Separator from '@/components/Separator';

import thousandSeparator from '@/util/thousandSeparator';

export default function ProductPage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <div className='layout mb-12 flex flex-col'>
          <p className='text-xl font-bold'>Keranjang</p>
          <Separator
            width='100%'
            height={2}
            color='#D6AD60BF'
            className='mt-8'
          />
          <div className='mt-12 mb-8 flex'>
            <div className='w-1/2 pl-6'>Produk</div>
            <div className='w-1/4 text-center'>Kuantitas</div>
            <div className='w-1/4 text-center'>Jumlah</div>
          </div>
          <Separator width='100%' color='#D6AD60BF' />
          {ProductMock.filter((_, i) => i < 3).map((product) => (
            <>
              <CartRow key={product.name} product={product} />
              <Separator width='100%' color='#D6AD60BF' />
            </>
          ))}
          <div className='mt-9 flex items-center justify-end gap-7'>
            <div className='text-end'>
              <p className='text-sm font-semibold'>Total Harga</p>
              <p className='text-2xl font-bold'>
                Rp {thousandSeparator(40000)}
              </p>
            </div>
            <div>
              <Button className='rounded-3xl bg-brown py-6 px-28'>BELI</Button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
