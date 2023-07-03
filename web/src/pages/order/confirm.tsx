import { Modal } from '@mantine/core';
import * as React from 'react';

import { useAppSelector } from '@/hooks/redux';

import withAuth from '@/components/hoc/withAuth';
import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import OrderRow from '@/components/OrderRow';
import Seo from '@/components/Seo';
import Separator from '@/components/Separator';
import UploadModal from '@/components/UploadModal';

import thousandSeparator from '@/utils/thousandSeparator';

export default withAuth(ConfirmOrderPage, 'all');
function ConfirmOrderPage() {
  const { cart } = useAppSelector(({ cart }) => cart);
  const { invoice } = useAppSelector(({ checkout }) => checkout);
  const [uploadModalOpened, setuploadModalOpened] = React.useState(false);

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <Modal
        opened={uploadModalOpened}
        onClose={() => setuploadModalOpened(false)}
        centered
        withCloseButton={false}
        padding={0}
        radius={50}
        size={982}
      >
        {invoice && (
          <UploadModal setOpened={setuploadModalOpened} invoice={invoice} />
        )}
      </Modal>

      <main className='bg-white pb-12'>
        <div className='layout min-h-main flex flex-col'>
          <p className='my-14 text-xl font-bold'>Nota Pemesanan</p>
          <div className='relative mx-8 flex flex-col space-y-6 rounded-3xl bg-grey p-12 px-20'>
            <p className='absolute left-8 top-8'>Kode Pemesanan: {invoice}</p>
            <ArrowLink
              className='absolute right-8 top-2'
              onClick={() => setuploadModalOpened(true)}
            >
              Upload Bukti Pembayaran
            </ArrowLink>
            <div className='text-center'>
              <p>Silahkan Transfer Pada ITS BANK</p>
              <h3>012 - 3456 - 789</h3>
              <p>Bima Ganteng</p>
            </div>
            <Separator width='30%' className='mx-auto' height={1.5} />
            <div className='flex flex-row justify-between px-10'>
              <p>Detail Pemesanan</p>
              <p>Harga</p>
            </div>
            <Separator width='100%' className='mx-auto' height={1.5} />
            {cart &&
              cart.product &&
              cart.product.map((product) => (
                <div key={product.productId} className='px-5'>
                  <OrderRow product={product} />
                </div>
              ))}
            <div className='flex flex-row justify-between px-5'>
              <p>Jasa Pengiriman</p>
              <p className='font-secondary font-bold'>Rp 0</p>
            </div>
            <Separator height={1.5} />
            <div className='flex flex-row items-center space-x-10 self-end'>
              <div>
                <p className='font-secondary text-sm'>Total</p>
                <h4 className='font-secondary'>Harga</h4>
              </div>
              <p className='font-secondary text-2xl font-bold'>
                Rp {cart?.totalPrice && thousandSeparator(cart?.totalPrice)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
