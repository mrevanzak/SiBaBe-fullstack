import * as React from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';

import NextImage from '@/components/NextImage';
import { Product } from '@/components/types';

import thousandSeparator from '@/util/thousandSeparator';

type ProductDetailProps = {
  product: Product;
};

export default function CartRow({ product }: ProductDetailProps) {
  return (
    <div className='my-8 flex'>
      <div className='flex w-1/2'>
        <div className='w-[110px] overflow-hidden rounded-l-3xl'>
          <NextImage
            useSkeleton
            src={product.image}
            alt={product.name}
            width={165}
            height={111}
            className='ml-[-30px]'
          />
        </div>
        <div className='ml-9 flex flex-col justify-center'>
          <p className='text-xs'>{product.name}</p>
          <p className='font-extrabold'>
            Rp {thousandSeparator(product.price)}
          </p>
        </div>
      </div>
      <div className='flex w-1/4 items-center justify-center'>
        <button className='text-2xl'>
          <AiOutlineMinusCircle />
        </button>
        <p className='mx-8 font-extrabold'>2</p>
        <button className='text-2xl'>
          <AiOutlinePlusCircle />
        </button>
      </div>
      <div className='flex w-1/4 items-center justify-center'>
        <p className='font-bold'>Rp {thousandSeparator(product.price)}</p>
      </div>
    </div>
  );
}
