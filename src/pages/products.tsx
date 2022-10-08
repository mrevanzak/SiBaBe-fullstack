import * as React from 'react';
import { FiShoppingCart } from 'react-icons/fi';

import Layout from '@/components/layout/Layout';
import NextImage from '@/components/NextImage';
import Seo from '@/components/Seo';

import { ProductMock } from '../data';

export default function ProductPage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <div className='layout flex max-w-none flex-row flex-wrap items-center justify-center gap-12 py-12'>
          {ProductMock.map((product) => (
            <div
              key={product.name}
              className='h-56 w-64 overflow-hidden rounded-[30px]  bg-grey'
            >
              <NextImage
                useSkeleton
                src={product.image}
                alt={product.name}
                width={250}
                height={150}
                className='w-64'
              />
              <div className='flex h-16 items-center justify-between px-5 py-3'>
                <div>
                  <p className='text-xs'>{product.name}</p>
                  <p className='text-base font-extrabold'>{product.price}</p>
                </div>
                <FiShoppingCart className='text-2xl' />
              </div>
            </div>
          ))}
        </div>
      </main>
    </Layout>
  );
}
