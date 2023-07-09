import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  RiCloseFill,
  RiStarSFill,
  RiStarSLine,
  RiUser3Line,
} from 'react-icons/ri';

import { rspc } from '@/lib/rspc';

import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';
import TextArea from '@/components/forms/TextArea';
import NextImage from '@/components/NextImage';
import Separator from '@/components/Separator';

import { EditProduct, Product } from '@/utils/api';
import useIsAdmin from '@/utils/isAdmin';
import thousandSeparator from '@/utils/thousandSeparator';

type ProductDetailProps = {
  product: Product;
  setOpened: (opened: boolean) => void;
};

export default function ProductDetailModal({
  product,
  setOpened,
}: ProductDetailProps) {
  const { mutate } = rspc.useMutation(['products.update'], {
    meta: { message: 'Berhasil mengubah produk' },
  });
  //#region  //*=========== Form ===========
  const methods = useForm<EditProduct>({
    mode: 'onTouched',
    defaultValues: {
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description,
    },
  });
  const { handleSubmit } = methods;
  //#endregion  //*======== Form ===========

  //#region  //*=========== Form Submit ===========
  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        id: product.id,
        name: data.name,
        price: data.price,
        stock: Number(data.stock),
        description: data.description,
      },
      {
        onSuccess: () => {
          setOpened(false);
        },
      }
    );
    // mutate(data);
  });
  //#endregion  //*======== Form Submit ===========

  return (
    <div className='overflow-hidden rounded-[50px] bg-grey'>
      {useIsAdmin() ? (
        <div className='mb-8'>
          <RiCloseFill
            className='absolute right-7 top-7 z-10 cursor-pointer text-4xl'
            onClick={() => setOpened(false)}
          />
          <NextImage
            useSkeleton
            src={product.image}
            alt={product.name}
            width={1024}
            height={320}
            imgClassName='object-none'
          />
          <Separator height={1.5} width='50%' className='mx-auto' />
          <div className='mx-14 my-7 flex flex-col items-center space-y-5'>
            <h3 className='text-center font-secondary'>Deskripsi Produk</h3>
            <FormProvider {...methods}>
              <form onSubmit={onSubmit} className='flex w-full flex-col'>
                <div className='space-y-2'>
                  <Input
                    id='name'
                    label='Nama'
                    validation={{ required: 'Nama produk harus diisi' }}
                  />
                  <Input
                    id='price'
                    label='Harga'
                    validation={{ required: 'Harga produk harus diisi' }}
                  />
                  <Input
                    id='stock'
                    label='Stok'
                    validation={{ required: 'Stok produk harus diisi' }}
                  />
                  <TextArea
                    id='description'
                    label='Deskripsi'
                    rows={4}
                    validation={{ required: 'Deskripsi produk harus diisi' }}
                  />
                </div>
                <Button
                  type='submit'
                  className='mt-6 w-64 flex-none self-center rounded-full bg-brown px-24 py-4 font-secondary font-bold'
                >
                  Simpan
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      ) : (
        <div className='flex flex-row gap-24 pb-8 '>
          <div className='flex-1'>
            <NextImage
              useSkeleton
              src={product.image}
              alt={product.name}
              width={482}
              height={320}
            />
            <div className='ml-14 mt-7'>
              <p className='font-secondary text-2xl'>{product.name}</p>
              <p className='font-secondary text-4xl font-bold'>
                Rp {thousandSeparator(product.price)}
              </p>
              <Separator width={400} color='#D6AD60' className='my-8' />
              <p className='font-secondary'>{product.description}</p>
            </div>
          </div>
          <div className='mr-14 mt-16 w-full'>
            <RiCloseFill
              className='absolute right-7 top-7 cursor-pointer text-4xl'
              onClick={() => setOpened(false)}
            />
            <p className='font-secondary'>Rating dan Ulasan</p>
            <Separator width={136} color='#D6AD60' />
            {product.reviews &&
              product.reviews.map((review, i) => (
                <div key={i} className='my-7'>
                  <div className='mb-4 flex justify-between'>
                    <div className='flex items-center gap-3'>
                      <RiUser3Line className='text-2xl' />
                      <p className='ml-2 font-secondary text-sm'>
                        {review.username}
                      </p>
                    </div>
                    <div className='flex items-center'>
                      {[...Array(review.rating)].map((_, i) => (
                        <RiStarSFill key={i} className='' />
                      ))}
                      {[...Array(5 - review.rating)].map((_, i) => (
                        <RiStarSLine key={i} className='' />
                      ))}
                    </div>
                  </div>
                  <p className='font-secondary text-xs'>{review.feedback}</p>
                  {i !== product.reviews.length - 1 && (
                    <Separator width='100%' color='#B3B3B3' className='my-6' />
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
