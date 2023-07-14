import { produce } from 'immer';
import * as React from 'react';
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { rspc } from '@/lib/rspc';

import NextImage from '@/components/NextImage';

import { CartResponse, ProductCart } from '@/utils/api';
import thousandSeparator from '@/utils/thousandSeparator';

type CartRowProps = {
  cartItems: ProductCart;
};

export default function CartRow({ cartItems }: CartRowProps) {
  const queryClient = rspc.useContext().queryClient;
  const { mutate } = rspc.useMutation(['carts.update'], {
    meta: { message: 'Berhasil menambahkan jumlah produk' },
    onSuccess: (_, input) => {
      queryClient.setQueryData<CartResponse>(
        ['carts.get'],
        produce((draft) => {
          if (!draft) return;
          const cartIndex = draft.product_carts.findIndex(
            (cart) => cart.product_id === input.product_id
          );

          draft.product_carts[cartIndex].quantity += input.quantity;
          draft.product_carts[cartIndex].total_price +=
            input.quantity * draft.product_carts[cartIndex].product.price;
          draft.total_price +=
            input.quantity * draft.product_carts[cartIndex].product.price;

          if (draft.product_carts[cartIndex].quantity <= 0) {
            draft.product_carts.splice(cartIndex, 1);
          }
        })
      );
    },
  });

  const onAddQuantity = () => {
    if (cartItems.quantity >= cartItems.product.stock) {
      toast.warn('Stok tidak mencukupi');
      return;
    }
    mutate({
      product_id: cartItems.product_id,
      quantity: 1,
    });
  };
  const onMinusQuantity = () => {
    mutate({
      product_id: cartItems.product_id,
      quantity: -1,
    });
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
