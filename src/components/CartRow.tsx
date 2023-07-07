import * as React from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { useAppDispatch } from '@/hooks/redux';

import NextImage from '@/components/NextImage';

import { addQuantity, minusQuantity } from '@/redux/actions/Cart';
import thousandSeparator from '@/utils/thousandSeparator';

import { Cart } from '@/types';

type CartRowProps = {
  product: Cart;
};

export default function CartRow({ product }: CartRowProps) {
  const dispatch = useAppDispatch();

  const onAddQuantity = () => {
    if (product.quantity >= product.product.stock) {
      toast.warn('Stok tidak mencukupi');
      return;
    }
    dispatch(addQuantity(product.productId));
  };
  const onMinusQuantity = () => {
    dispatch(minusQuantity(product.productId));
  };

  return (
    <div className='my-8 flex'>
      <div className='flex w-1/2'>
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
            Rp {thousandSeparator(product.product.price)}
          </p>
        </div>
      </div>
      <div className='flex w-1/4 items-center justify-center'>
        <button className='text-2xl' onClick={onMinusQuantity}>
          <AiOutlineMinusCircle />
        </button>
        <p className='mx-8 font-secondary font-extrabold'>{product.quantity}</p>
        <button className='text-2xl' onClick={onAddQuantity}>
          <AiOutlinePlusCircle />
        </button>
      </div>
      <div className='flex w-1/4 items-center justify-center'>
        <p className='font-secondary font-bold'>
          Rp {thousandSeparator(product.totalPrice)}
        </p>
      </div>
    </div>
  );
}
