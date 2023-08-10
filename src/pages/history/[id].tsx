import { Modal, Tooltip } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';

import { rspc } from '@/lib/rspc';

import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import ReviewModal from '@/components/modals/Review';
import UploadModal from '@/components/modals/Upload';
import OrderRow from '@/components/OrderRow';
import Seo from '@/components/Seo';
import Separator from '@/components/Separator';

import { ProductCart } from '@/utils/api';
import thousandSeparator from '@/utils/thousandSeparator';

export default function HistoryDetailPage() {
  const [uploadModalOpened, setuploadModalOpened] = React.useState(false);
  const [reviewModalOpened, setreviewModalOpened] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<string>();

  const { query, isReady } = useRouter();
  const historyId = query.id as string;
  const { data: history } = rspc.useQuery(['orders.show', historyId], {
    enabled: isReady,
  });

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}

      <Modal
        opened={reviewModalOpened}
        onClose={() => setreviewModalOpened(false)}
        centered
        withCloseButton={false}
        padding={0}
        radius={50}
        size={982}
      >
        {selectedProduct && (
          <ReviewModal
            historyId={historyId}
            id={selectedProduct}
            setOpened={setreviewModalOpened}
          />
        )}
      </Modal>

      <Modal
        opened={uploadModalOpened}
        onClose={() => setuploadModalOpened(false)}
        centered
        withCloseButton={false}
        padding={0}
        radius={50}
        size={982}
      >
        {history && (
          <UploadModal setOpened={setuploadModalOpened} invoice={history.id} />
        )}
      </Modal>

      <Seo />
      <main className='bg-white pb-12'>
        <div className='layout min-h-main flex flex-col'>
          <p className='my-14 text-xl font-bold'>Detail Riwayat Pemesanan</p>
          <div className='relative mx-8 flex flex-col space-y-6 rounded-3xl bg-grey p-12 px-20'>
            {history && (
              <p className='absolute left-8 top-8'>
                Kode Pemesanan: {history.id}
              </p>
            )}
            {history?.status === 'pending' && (
              <ArrowLink
                as='button'
                className='absolute right-8 top-2'
                onClick={() => setuploadModalOpened(true)}
              >
                Upload Bukti Pembayaran
              </ArrowLink>
            )}
            <div className='text-center'>
              {history?.status === 'pending' && (
                <p>
                  Pembayaran Melalui{' '}
                  <Tooltip
                    label={
                      <>
                        <p>Silahkan Transfer Pada ITS BANK</p>
                        <h3>012 - 3456 - 789</h3>
                        <p>Bima Ganteng</p>
                      </>
                    }
                  >
                    <UnderlineLink>
                      {history?.payment_method.replace('_', ' ')}
                    </UnderlineLink>
                  </Tooltip>
                </p>
              )}
              <h3>
                {history?.status === 'pending'
                  ? 'Menunggu Pembayaran'
                  : history?.status === 'payment'
                  ? 'Menunggu validasi pembayaran'
                  : history?.status === 'validated'
                  ? 'Pesanan anda sedang dikirim'
                  : 'Pesanan anda telah selesai'}
              </h3>
            </div>
            <Separator width='30%' className='mx-auto' height={1.5} />
            <div className='flex flex-row justify-between px-10'>
              <p>Detail Pemesanan</p>
              <p>Harga</p>
            </div>
            <Separator width='100%' className='mx-auto' height={1.5} />
            {history?.cart.product_carts.map((product, index) => (
              <div key={index} className='px-5'>
                <OrderRow
                  product={product as ProductCart}
                  review={history?.status === 'complete'}
                  setSelectedProduct={setSelectedProduct}
                  setOpened={setreviewModalOpened}
                />
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
                Rp{' '}
                {history?.total_price &&
                  thousandSeparator(history?.total_price)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
