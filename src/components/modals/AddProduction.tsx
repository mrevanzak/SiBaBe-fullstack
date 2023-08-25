import * as React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RiCloseFill } from 'react-icons/ri';

import { rspc } from '@/lib/rspc';

import Button from '@/components/buttons/Button';
import Separator from '@/components/Separator';

import DatePicker from '../forms/DatePicker';
import Input from '../forms/Input';

type AddProductionProps = {
  setOpened: (opened: boolean) => void;
};

export default function AddProduction({ setOpened }: AddProductionProps) {
  const queryClient = rspc.useContext().queryClient;
  const { mutate } = rspc.useMutation(['reports.create'], {
    meta: {
      message: 'Data produksi berhasil ditambahkan',
    },
    onSuccess: () => {
      setOpened(false);
      queryClient.invalidateQueries(['reports.get']);
    },
  });
  //#region  //*=========== Form ===========
  const methods = useForm({
    mode: 'onTouched',
  });
  const { handleSubmit } = methods;
  //#endregion  //*======== Form ===========

  //#region  //*=========== Form Submit ===========
  const onSubmit = handleSubmit((data) => {
    mutate({
      date: data.date.toUTCString(),
      total_cost: Number(data.total_cost),
    });
  });
  //#endregion  //*======== Form Submit ===========

  return (
    <div className='overflow-hidden rounded-[50px] bg-grey'>
      <div className='gap-24 pb-8'>
        <div>
          <RiCloseFill
            className='absolute right-7 top-7 z-10 cursor-pointer text-4xl'
            onClick={() => setOpened(false)}
          />
          <div className='mx-14 mt-7 space-y-4'>
            <h3 className='text-center font-secondary'>
              Data Produksi Tambahan
            </h3>
            <FormProvider {...methods}>
              <form className='flex flex-col' onSubmit={onSubmit}>
                <DatePicker
                  id='date'
                  label='Tanggal'
                  placeholder='Isi tanggal produksi'
                  validation={{
                    required: 'Tanggal harus diisi',
                  }}
                />
                <Separator width='30%' height={1} className='mx-auto my-1' />
                <div className='my-2 flex flex-col space-y-1'>
                  <Input
                    id='total_cost'
                    label='Harga'
                    type='number'
                    placeholder='Isi harga produksi'
                    validation={{
                      required: 'Harga harus diisi',
                    }}
                  />
                </div>
                <Button
                  className='mt-4 self-center rounded-full border-none bg-brown px-24 py-4 font-secondary font-bold'
                  type='submit'
                >
                  Simpan
                </Button>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
