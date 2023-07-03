import * as React from 'react';

import ArrowLink from '@/components/links/ArrowLink';
import NextImage from '@/components/NextImage';

import thousandSeparator from '@/utils/thousandSeparator';

import { Cart, ProductElement } from '@/types';

type OrderRowProps = {
  product: Cart | ProductElement;
  review?: boolean;
  setSelectedProduct?: (id: number) => void;
  setOpened?: (opened: boolean) => void;
};

export default function OrderRow({
  product,
  review,
  setSelectedProduct,
  setOpened,
}: OrderRowProps) {
  return (
    <div className='relative flex items-center justify-between'>
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
      {review && (
        <div className='absolute left-1/2'>
          <ArrowLink
            onClick={() => {
              if (setSelectedProduct && setOpened) {
                setSelectedProduct(product.product.id);
                setOpened(true);
              }
            }}
          >
            Beri Ulasan
          </ArrowLink>
        </div>
      )}
      <div className='flex items-center'>
        <p className='font-secondary font-bold'>
          Rp {thousandSeparator(product.totalPrice)}
        </p>
      </div>
    </div>
  );
}
