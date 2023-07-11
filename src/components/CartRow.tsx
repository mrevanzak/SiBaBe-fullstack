import * as React from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';

import NextImage from '@/components/NextImage';

import { ProductCart } from '@/utils/api';
import thousandSeparator from '@/utils/thousandSeparator';

type CartRowProps = {
  cartItems: ProductCart;
};

export default function CartRow({ cartItems }: CartRowProps) {
  const onAddQuantity = () => {
    if (cartItems.quantity >= cartItems.product.stock) {
      toast.warn('Stok tidak mencukupi');
      return;
    }
    // dispatch(addQuantity(product.productId));
  };
  const onMinusQuantity = () => {
    // dispatch(minusQuantity(product.productId));
  };

  return (
    <div className='my-8 flex'>
      <div className='flex w-1/2'>
        <div className='w-[110px] overflow-hidden rounded-l-3xl'>
          <NextImage
            useSkeleton
            src={cartItems.product.image}
            alt={cartItems.product.name}
            width={165}
            height={111}
            className='ml-[-30px]'
          />
        </div>
        <div className='ml-9 flex flex-col justify-center'>
          <p className='font-secondary text-xs'>{cartItems.product.name}</p>
          <p className='font-secondary font-extrabold'>
            Rp {thousandSeparator(cartItems.product.price)}
          </p>
        </div>
      </div>
      <div className='flex w-1/4 items-center justify-center'>
        <button className='text-2xl' onClick={onMinusQuantity}>
          <AiOutlineMinusCircle />
        </button>
        <p className='mx-8 font-secondary font-extrabold'>
          {cartItems.quantity}
        </p>
        <button className='text-2xl' onClick={onAddQuantity}>
          <AiOutlinePlusCircle />
        </button>
      </div>
      <div className='flex w-1/4 items-center justify-center'>
        <p className='font-secondary font-bold'>
          Rp {thousandSeparator(cartItems.total_price)}
        </p>
      </div>
    </div>
  );
}
