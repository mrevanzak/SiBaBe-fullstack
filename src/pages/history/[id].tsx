import { Modal } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';

import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux';

import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import UploadModal from '@/components/modals/Upload';
import Seo from '@/components/Seo';
import Separator from '@/components/Separator';

import { fetchHistoryById } from '@/redux/actions/History';
import thousandSeparator from '@/utils/thousandSeparator';

export default function HistoryDetailPage() {
  const { history, historyById } = useAppSelector(({ history }) => history);
  const dispatch = useAppDispatch();
  const [uploadModalOpened, setuploadModalOpened] = React.useState(false);

  const { query } = useRouter();
  const historyId = query.id as string;

  const historyDetail = history?.order?.find(
    (history) => history.id === Number(historyId)
  );

  React.useEffect(() => {
    dispatch(fetchHistoryById(Number(historyId)));
  }, []);

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}

      {/* <Modal */}
      {/*   opened={reviewModalOpened} */}
      {/*   onClose={() => setreviewModalOpened(false)} */}
      {/*   centered */}
      {/*   withCloseButton={false} */}
      {/*   padding={0} */}
      {/*   radius={50} */}
      {/*   size={982} */}
      {/* > */}
      {/*   {selectedProduct && ( */}
      {/*     <ReviewModal */}
      {/*       historyId={historyId} */}
      {/*       id={selectedProduct} */}
      {/*       setOpened={setreviewModalOpened} */}
      {/*     /> */}
      {/*   )} */}
      {/* </Modal> */}

      <Modal
        opened={uploadModalOpened}
        onClose={() => setuploadModalOpened(false)}
        centered
        withCloseButton={false}
        padding={0}
        radius={50}
        size={982}
      >
        {historyById && (
          <UploadModal
            setOpened={setuploadModalOpened}
            invoice={historyById.invoice}
          />
        )}
      </Modal>

      <Seo />
      <main className='bg-white pb-12'>
        <div className='layout min-h-main flex flex-col'>
          <p className='my-14 text-xl font-bold'>Detail Riwayat Pemesanan</p>
          <div className='relative mx-8 flex flex-col space-y-6 rounded-3xl bg-grey p-12 px-20'>
            {historyById && (
              <p className='absolute left-8 top-8'>
                Kode Pemesanan: {historyById.invoice}
              </p>
            )}
            {historyById?.status === 'Belum Dibayar' && (
              <ArrowLink
                className='absolute right-8 top-2'
                onClick={() => setuploadModalOpened(true)}
              >
                Upload Bukti Pembayaran
              </ArrowLink>
            )}
            <div className='text-center'>
              <p>Pembayaran Melalui ITS-BANK</p>
              <h3>
                {historyById?.status === 'Menunggu Validasi' ||
                historyById?.status === 'Belum Dibayar'
                  ? historyById.status
                  : `Pesanan anda telah di${historyById?.status.toLowerCase()}`}
              </h3>
            </div>
            <Separator width='30%' className='mx-auto' height={1.5} />
            <div className='flex flex-row justify-between px-10'>
              <p>Detail Pemesanan</p>
              <p>Harga</p>
            </div>
            <Separator width='100%' className='mx-auto' height={1.5} />
            {historyById &&
              historyById.product &&
              historyById.product.map((product, index) => (
                <div key={index} className='px-5'>
                  {/* <OrderRow */}
                  {/*   product={product} */}
                  {/*   review={historyDetail?.status === 'Terima'} */}
                  {/*   setSelectedProduct={setSelectedProduct} */}
                  {/*   setOpened={setreviewModalOpened} */}
                  {/* /> */}
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
                {historyDetail?.totalPrice &&
                  thousandSeparator(historyDetail?.totalPrice)}
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
