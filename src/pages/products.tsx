import { Modal } from '@mantine/core';
import * as React from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';

import withAuth from '@/components/hoc/withAuth';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ProductCard';
import ProductDetail from '@/components/ProductDetail';
import Seo from '@/components/Seo';

import { getProducts } from '@/redux/actions/Products';

import { Product } from '@/types';

export default withAuth(ProductPage, 'optional');
function ProductPage() {
  const { products, loading } = useAppSelector(({ products }) => products);
  const dispatch = useAppDispatch();
  const [opened, setOpened] = React.useState(false);
  const [selectedProduct, setSelectedProduct] =
    React.useState<Product | null>();

  React.useEffect(() => {
    dispatch(getProducts());
  }, []);

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
          {!loading &&
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                setOpened={setOpened}
                setSelectedProduct={setSelectedProduct}
              />
            ))}
        </div>
      </main>
    </Layout>
  );
}
