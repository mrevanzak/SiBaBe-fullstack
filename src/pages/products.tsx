import { Modal } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';

import withAuth from '@/components/hoc/withAuth';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ProductCard';
import ProductDetail from '@/components/ProductDetail';
import Search from '@/components/Search';
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
  const [search, setSearch] = React.useState('');
  const [debounced] = useDebouncedValue(search, 200);

  React.useEffect(() => {
    dispatch(getProducts());
  }, []);

  React.useEffect(() => {
    toast.error('Produk tidak ditemukan');
  }, [debounced]);

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
        <div className='layout min-h-main my-6 flex flex-col py-12 font-secondary'>
          <Search search={search} setSearch={setSearch} />
          <div className='flex flex-wrap items-center justify-center gap-12'>
            {!loading &&
              products &&
              products
                .filter((product) =>
                  product.name.toLowerCase().includes(search.toLowerCase())
                )
                .map(
                  (product) =>
                    product.stock > 0 && (
                      <ProductCard
                        key={product.id}
                        product={product}
                        setOpened={setOpened}
                        setSelectedProduct={setSelectedProduct}
                      />
                    )
                )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
