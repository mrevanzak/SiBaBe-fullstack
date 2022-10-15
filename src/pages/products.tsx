import { Modal } from '@mantine/core';
import * as React from 'react';
import { FiShoppingCart } from 'react-icons/fi';

import Layout from '@/components/layout/Layout';
import NextImage from '@/components/NextImage';
import ProductDetail from '@/components/ProductDetail';
import Seo from '@/components/Seo';

import thousandSeparator from '@/util/thousandSeparator';

import { ProductMock } from '../data';

import { Product } from '@/types';

export default function ProductPage() {
  const [opened, setOpened] = React.useState(false);
  const [selectedProduct, setSelectedProduct] =
    React.useState<Product | null>();

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        withCloseButton={false}
        padding={0}
        radius={50}
        size={982}
      >
        {selectedProduct && (
          <ProductDetail product={selectedProduct} setOpened={setOpened} />
        )}
      </Modal>
      <main>
        <div className='layout flex max-w-none flex-row flex-wrap items-center justify-center gap-12 py-12 font-secondary'>
          {ProductMock.map((product) => (
            <div
              key={product.name}
              className='h-56 w-64 cursor-pointer overflow-hidden rounded-[30px] bg-grey'
              onClick={() => {
                setOpened(true);
                setSelectedProduct(product);
              }}
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
                <div className=''>
                  <p className='font-secondary text-xs'>{product.name}</p>
                  <p className='font-secondary text-base font-extrabold'>
                    Rp {thousandSeparator(product.price)}
                  </p>
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
