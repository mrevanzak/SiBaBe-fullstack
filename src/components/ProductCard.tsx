/* eslint-disable unused-imports/no-unused-vars */
import { useUser } from '@clerk/nextjs';
import * as React from 'react';
import { FiEdit, FiShoppingCart, FiTrash2, FiXCircle } from 'react-icons/fi';

import useIsAdmin from '@/lib/isAdmin';
import { rspc } from '@/lib/rspc';

import NextImage from '@/components/NextImage';

import { Product } from '@/utils/api';
import thousandSeparator from '@/utils/thousandSeparator';

type ProductCardProps = {
  product: Product;
  setOpened: (opened: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
  setOpenConfirmRemove: (opened: boolean) => void;
};

export default function ProductCard({
  product,
  setOpened,
  setSelectedProduct,
  setOpenConfirmRemove,
}: ProductCardProps) {
  const { user } = useUser();
  const { mutate: add } = rspc.useMutation(['carts.update'], {
    meta: { message: 'Berhasil menambahkan ke keranjang' },
    onSuccess: () => setInCart(true),
  });
  const { mutate: remove } = rspc.useMutation(['carts.remove'], {
    meta: { message: 'Berhasil menghapus dari keranjang' },
    onSuccess: () => setInCart(false),
  });

  const [inCart, setInCart] = React.useState(false);

  return (
    <div
      className='relative h-56 w-64 cursor-pointer overflow-hidden rounded-[30px] bg-grey transition-all duration-200 hover:scale-95'
      onClick={() => {
        setOpened(true);
        setSelectedProduct(product);
      }}
    >
      <NextImage
        useSkeleton
        src={product.image}
        alt={product.name}
        fill
        className='relative h-40 w-64'
      />
      {useIsAdmin() && (
        <div
          className='absolute right-3 top-3 rounded-full bg-red-300 bg-auto bg-center bg-no-repeat p-1 transition-all duration-200 hover:text-primary-50'
          onClick={(e) => {
            e.stopPropagation();
            setOpenConfirmRemove(true);
            setSelectedProduct(product);
          }}
        >
          <FiTrash2 />
        </div>
      )}
      <div className='flex h-16 items-center justify-between px-5 py-3'>
        <div className=''>
          <p className='font-secondary text-xs'>{product.name}</p>
          <p className='font-secondary text-base font-extrabold'>
            Rp {thousandSeparator(product.price)}
          </p>
        </div>
        {useIsAdmin() && (
          <FiEdit
            className='text-2xl transition-all duration-200 hover:text-primary-50'
            onClick={(e) => {
              e.stopPropagation();
              setOpened(true);
              setSelectedProduct(product);
            }}
          />
        )}
        {!useIsAdmin() &&
          user &&
          (inCart ? (
            <FiXCircle
              className='text-2xl transition-all duration-200 hover:text-primary-50'
              onClick={(e) => {
                e.stopPropagation();
                remove(product.id);
              }}
            />
          ) : (
            <FiShoppingCart
              className='text-2xl transition-all duration-200 hover:text-primary-50'
              onClick={(e) => {
                e.stopPropagation();
                add({ product_id: product.id, quantity: 1 });
              }}
            />
          ))}
      </div>
    </div>
  );
}
