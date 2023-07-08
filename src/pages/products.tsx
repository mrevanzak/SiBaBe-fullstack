import { Modal } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import * as React from 'react';
import { toast } from 'react-toastify';

import { rspc } from '@/lib/rspc';

import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/ProductCard';
import ProductDetail from '@/components/ProductDetail';
import Search from '@/components/Search';
import Seo from '@/components/Seo';

import { Product } from '@/utils/api';

export default function ProductPage() {
  const { data: products, isLoading } = rspc.useQuery(['products.get']);
  const [opened, setOpened] = React.useState(false);
  const [selectedProduct, setSelectedProduct] =
    React.useState<Product | null>();
  const [search, setSearch] = React.useState('');
  const [debounced] = useDebouncedValue(search, 500);

  const productFiltered = products?.filter((product) =>
    product.name.toLowerCase().includes(debounced.toLowerCase())
  );

  if (isLoading) {
    toast.loading('Memuat produk...', {
      toastId: 'fetching',
    });
  }

  if (!isLoading) {
    toast.update('fetching', {
      render: 'Produk berhasil dimuat',
      type: 'success',
      isLoading: false,
    });
  }

  React.useEffect(() => {
    if (!isLoading && productFiltered && productFiltered.length === 0) {
      toast.error('Produk tidak ditemukan', {
        toastId: 'not-found',
      });
    }
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
          <div className='flex flex-wrap items-center justify-center gap-8'>
            {!isLoading &&
              productFiltered?.map(
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
