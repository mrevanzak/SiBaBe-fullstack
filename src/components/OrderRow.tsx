import * as React from 'react';

import NextImage from '@/components/NextImage';

import thousandSeparator from '@/util/thousandSeparator';

import { Cart } from '@/types';

type OrderRowProps = {
  product: Cart;
};

export default function OrderRow({ product }: OrderRowProps) {
  return (
    <div className='my-8 flex justify-between'>
      <div className='flex'>
        <div className='w-[110px] overflow-hidden rounded-l-3xl'>
          <NextImage
            useSkeleton
            src={product.product.image}
            alt={product.product.name}
            width={165}
            height={111}
            className='ml-[-30px]'
          />
        </div>
        <div className='ml-9 flex flex-col justify-center'>
          <p className='font-secondary text-xs'>{product.product.name}</p>
          <p className='font-secondary font-extrabold'>
            {product.quantity} Qty
          </p>
        </div>
      </div>
      <div className='flex items-center'>
        <p className='font-secondary font-bold'>
          Rp {thousandSeparator(product.totalPrice)}
        </p>
      </div>
    </div>
  );
}
