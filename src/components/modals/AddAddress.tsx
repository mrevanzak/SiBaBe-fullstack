import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RiCloseFill } from 'react-icons/ri';

import { rspc } from '@/lib/rspc';

import Button from '@/components/buttons/Button';
import Input from '@/components/forms/Input';
import TextArea from '@/components/forms/TextArea';

import { AddAddressArgs } from '@/utils/api';

type AddAddressModalProps = {
  setOpened: (opened: boolean) => void;
};

export default function AddAddressModal({ setOpened }: AddAddressModalProps) {
  const queryClient = rspc.useContext().queryClient;
  const { mutate } = rspc.useMutation(['users.add.address'], {
    onSuccess: () => {
      queryClient.invalidateQueries(['users.get']);
    },
  });
  //#region  //*=========== Form ===========
  const methods = useForm<AddAddressArgs>({
    mode: 'onTouched',
  });
  const { handleSubmit } = methods;
  //#endregion  //*======== Form ===========

  //#region  //*=========== Form Submit ===========
  const onSubmit = handleSubmit(async (data) => {
    mutate(data, {
      onSuccess: () => setOpened(false),
    });
  });
  //#endregion  //*======== Form Submit ===========

  return (
    <div className='overflow-hidden rounded-[50px] bg-grey px-12 pt-12'>
      <div className='flex flex-col'>
        <FormProvider {...methods}>
          <form
            className='flex w-full flex-col space-y-2'
            id='form'
            onSubmit={onSubmit}
          >
            <Input
              id='phone'
              label='Nomor Telepon'
              placeholder='Isi nomor telepon'
              validation={{
                required: 'Nomor telepon harus diisi',
              }}
            />
            <TextArea
              id='address'
              label='Alamat'
              placeholder='Isi alamat'
              validation={{
                required: 'Alamat harus diisi',
              }}
              rows={4}
            />
          </form>
        </FormProvider>
        <Button
          className='my-6 self-end rounded-xl px-4 py-2 font-secondary'
          variant='outline'
          type='submit'
          form='form'
        >
          Simpan
        </Button>
      </div>
      <RiCloseFill
        className='absolute right-7 top-7 cursor-pointer text-4xl'
        onClick={() => setOpened(false)}
      />
    </div>
  );
}
