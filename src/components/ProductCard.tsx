/* eslint-disable unused-imports/no-unused-vars */
import { useUser } from '@clerk/nextjs';
import * as React from 'react';
import { FiEdit, FiShoppingCart, FiTrash2 } from 'react-icons/fi';

import NextImage from '@/components/NextImage';

import { Product } from '@/utils/api';
import useIsAdmin from '@/utils/isAdmin';
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
  // const { cart } = useAppSelector(({ cart }) => cart);
  const { user } = useUser();

  // const isInCart = (id: number) => {
  //   return cart?.product?.find((item) => item.productId === id);
  // };

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
        width={250}
        height={150}
        className='w-64'
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
        <FiEdit
          className='text-2xl transition-all duration-200 hover:text-primary-50'
          onClick={(e) => {
            e.stopPropagation();
            setOpened(true);
            setSelectedProduct(product);
          }}
        />
        {/* {isInCart(product.id) ? (
          <FiXCircle
            className='text-2xl transition-all duration-200 hover:text-primary-50'
            onClick={(e) => {
              e.stopPropagation();
              // dispatch(removeFromCart(product));
            }}
          />
        ) : (
          <FiShoppingCart
            className='text-2xl transition-all duration-200 hover:text-primary-50'
            onClick={(e) => {
              e.stopPropagation();
              dispatch(addToCart(product.id));
            }}
          />
        )} */}
        {!useIsAdmin() && user && (
          <FiShoppingCart
            className='text-2xl transition-all duration-200 hover:text-primary-50'
            onClick={(e) => {
              e.stopPropagation();
              // dispatch(addToCart(product.id));
            }}
          />
        )}
      </div>
    </div>
  );
}
