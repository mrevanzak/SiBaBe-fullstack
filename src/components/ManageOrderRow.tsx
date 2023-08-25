import { Tooltip } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import * as React from 'react';
import { FiCheck, FiMap, FiX } from 'react-icons/fi';

import clsxm from '@/lib/clsxm';
import { rspc } from '@/lib/rspc';

import Separator from '@/components/Separator';

import { OrderWithCart } from '@/utils/api';
import thousandSeparator from '@/utils/thousandSeparator';

import UnstyledLink from './links/UnstyledLink';

type OrdersRowProps = {
  orders: OrderWithCart;
};

export default function ManageOrderRow({ orders }: OrdersRowProps) {
  const { mutate } = rspc.useMutation(['orders.confirm'], {
    meta: { message: 'Berhasil mengubah status pesanan' },
    onSuccess: () => {
      queryClient.invalidateQueries(['orders.admin.get']);
    },
  });
  const queryClient = rspc.useContext().queryClient;

  const { hovered, ref } = useHover();

  const onConfirm = () => {
    mutate({ id: orders.id, confirm: true });
  };

  const onReject = () => {
    mutate({ id: orders.id, confirm: false });
  };

  const tooltipLabel = () => (
    <div>
      <p>Total Harga: Rp {thousandSeparator(orders.total_price)}</p>
      {orders.cart.product_carts.map((orders) => (
        <p key={orders.product.id}>
          Harga {orders.quantity} {orders.product.name}: Rp{' '}
          {thousandSeparator(orders.total_price)}
        </p>
      ))}
    </div>
  );

  return (
    <div ref={ref}>
      <Tooltip label={tooltipLabel()} color='#D6AD60'>
        <div className='flex justify-between py-8  transition-all duration-200'>
          <div className=' w-1/5'>
            <p className='text-sm'>Invoice</p>
            <p className='font-secondary text-xl font-bold'>{orders.id}</p>
          </div>
          <div className=' w-3/5 text-center'>
            <p className='font-secondary font-bold'>
              {orders.status === 'pending'
                ? 'Menunggu Pembayaran'
                : orders.status === 'payment'
                ? 'Menunggu Validasi'
                : orders.status === 'validated'
                ? 'Pesanan Dikonfirmasi'
                : orders.status === 'rejected'
                ? 'Pesanan Ditolak'
                : 'Pesanan Selesai'}
            </p>
          </div>
          <div className='flex w-1/5 flex-row justify-end'>
            {orders.status === 'payment' ? (
              <>
                <FiCheck
                  className='m-2 h-10 cursor-pointer pr-5 text-5xl'
                  onClick={onConfirm}
                ></FiCheck>
                <div
                  style={{
                    backgroundColor: '#D6AD60',
                    height: '60px',
                    border: '1px solid #D6AD60BF',
                  }}
                />
                <FiX
                  className='m-2 h-10 cursor-pointer pl-5 text-5xl'
                  onClick={onReject}
                ></FiX>
              </>
            ) : orders.status === 'validated' ? (
              <UnstyledLink
                href={`https://google.com/maps/search/${orders.address.replace(
                  ' ',
                  '+'
                )}`}
              >
                <FiMap className='m-2 text-2xl'></FiMap>
              </UnstyledLink>
            ) : null}
          </div>
        </div>
      </Tooltip>
      <Separator
        height={2}
        color='#D9D9D9BF'
        className={clsxm(
          'mx-auto transition-all duration-300',
          hovered ? 'w-full' : 'w-[90%]'
        )}
      />
    </div>
  );
}
