import * as React from 'react';
import { FiShoppingCart } from 'react-icons/fi';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';

import NextImage from '@/components/NextImage';

import { addToCart } from '@/redux/actions/Cart';
import { Product } from '@/utils/api';
import thousandSeparator from '@/utils/thousandSeparator';

type ProductCardProps = {
  product: Product;
  setOpened: (opened: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
};

export default function ProductCard({
  product,
  setOpened,
  setSelectedProduct,
}: ProductCardProps) {
  // const { cart } = useAppSelector(({ cart }) => cart);
  const { user } = useAppSelector(({ user }) => user);
  const dispatch = useAppDispatch();

  // const isInCart = (id: number) => {
  //   return cart?.product?.find((item) => item.productId === id);
  // };

  return (
    <div
      className='h-56 w-64 cursor-pointer overflow-hidden rounded-[30px] bg-grey transition-all duration-200 hover:scale-95'
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
      <div className='flex h-16 items-center justify-between px-5 py-3'>
        <div className=''>
          <p className='font-secondary text-xs'>{product.name}</p>
          <p className='font-secondary text-base font-extrabold'>
            Rp {thousandSeparator(product.price)}
          </p>
        </div>
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
        {user && (
          <FiShoppingCart
            className='text-2xl transition-all duration-200 hover:text-primary-50'
            onClick={(e) => {
              e.stopPropagation();
              dispatch(addToCart(product.id));
            }}
          />
        )}
      </div>
    </div>
  );
}
