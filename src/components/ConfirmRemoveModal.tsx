import * as React from 'react';
import { RiCloseFill } from 'react-icons/ri';

import { rspc } from '@/lib/rspc';

import Button from '@/components/buttons/Button';

import { Product } from '@/utils/api';

type ConfirmRemoveProps = {
  product: Product;
  setOpened: (opened: boolean) => void;
};

export default function ConfirmRemoveModal({
  product,
  setOpened,
}: ConfirmRemoveProps) {
  const { mutate } = rspc.useMutation(['products.delete'], {
    meta: { message: 'Berhasil menghapus produk' },
    onSuccess: () => {
      setOpened(false);
    },
  });

  return (
    <div className='relative flex flex-row items-center justify-center gap-24 overflow-hidden rounded-[50px] bg-grey pb-8'>
      <div className='flex px-32 pt-24'>
        <RiCloseFill
          className='absolute right-7 top-7 cursor-pointer text-2xl'
          onClick={() => setOpened(false)}
        />
        <div className=''>
          <h3 className='mb-32 text-center'>
            Apakah Anda ingin menghapus produk {product.name} ?
          </h3>
          <Button
            className='absolute bottom-0 left-0 flex h-20 w-1/2 justify-center rounded-none bg-green-500 hover:bg-green-600'
            onClick={() => setOpened(false)}
          >
            NO
          </Button>
          <Button
            className='absolute bottom-0 right-0 flex h-20 w-1/2 justify-center rounded-none bg-red-500 hover:bg-red-600'
            onClick={() => mutate(product.id)}
          >
            YES
          </Button>
        </div>
      </div>
    </div>
  );
}
