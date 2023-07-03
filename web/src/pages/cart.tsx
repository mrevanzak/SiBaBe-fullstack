import { useRouter } from 'next/router';
import * as React from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';

import Button from '@/components/buttons/Button';
import CartRow from '@/components/CartRow';
import withAuth from '@/components/hoc/withAuth';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Separator from '@/components/Separator';

import { fetchCart } from '@/redux/actions/Cart';
import { clearCheckoutMessage } from '@/redux/actions/Checkout';
import thousandSeparator from '@/utils/thousandSeparator';

export default withAuth(CartPage, 'all');
function CartPage() {
  const { cart } = useAppSelector(({ cart }) => cart);
  const dispatch = useAppDispatch();
  const router = useRouter();

  React.useEffect(() => {
    dispatch(fetchCart());
  }, []);

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
          {cart &&
            cart.product &&
            cart.product.map((product) => (
              <div key={product.productId}>
                <CartRow product={product} />
                <Separator width='100%' color='#D6AD60BF' />
              </div>
            ))}
          <div className='mt-9 flex items-center justify-end gap-7'>
            <div className='text-end'>
              <p className='font-secondary text-sm font-semibold'>
                Total Harga
              </p>
              <p className='font-secondary text-2xl font-bold'>
                Rp {thousandSeparator(cart?.totalPrice || 0)}
              </p>
            </div>
            <div>
              <Button
                className='rounded-3xl bg-brown px-28 py-6 font-secondary'
                onClick={() => {
                  router.push('/order');
                  dispatch(clearCheckoutMessage());
                }}
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
