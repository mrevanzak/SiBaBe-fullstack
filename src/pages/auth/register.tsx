import { Checkbox } from '@mantine/core';
import Link from 'next/link';
import * as React from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

import apiMock from '@/lib/axios-mock';
import logger from '@/lib/logger';

import withAuth from '@/components/hoc/withAuth';
import NextImage from '@/components/NextImage';

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type RegisterAPIRes = {
  message: string;
};

export default withAuth(RegisterPage, 'auth');
function RegisterPage() {
  const methods = useForm<RegisterData>({
    mode: 'onTouched',
    defaultValues: {
      email: 'me@email.com',
      name: 'Test',
      password: 'password',
    },
  });
  const { register, handleSubmit, reset } = methods;

  const onSubmit: SubmitHandler<RegisterData> = (data) => {
    logger({ data }, 'register.tsx line 21');

    apiMock
      .post<RegisterAPIRes>(`/user/add`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => {
        toast.success(`Akun berhasil terdaftar`);
        reset({
          name: '',
          email: '',
          password: '',
        });
      });
  };

  return (
    <div className='flex min-h-screen'>
      <Toaster />
      <div className='relative hidden w-0 flex-1 lg:block'>
        <NextImage
          imgClassName='absolute inset-0 h-full w-full object-cover'
          src='/images/cover.png'
          alt=''
          width={900}
          height={720}
        />
      </div>
      <div className='flex w-1/2 flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
        <div className='mx-auto w-full max-w-sm lg:w-96'>
          <div>
            <h2 className='mt-6 text-5xl font-medium text-gray-900'>
              Buat Akun
            </h2>
            <p className='mt-2 text-sm text-gray-600'>
              Sudah mempunyai akun?{' '}
              <Link href='/auth/login'>
                <span className='font-medium text-blue-400 hover:text-blue-300'>
                  Masuk
                </span>
              </Link>
            </p>
          </div>

          <div className='mt-8 space-y-6'>
            <div className='mt-6'>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <div>
                    <label
                      htmlFor='email'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Alamat Email
                    </label>
                    <div className='mt-1'>
                      <input
                        id='email'
                        {...register('email')}
                        type='email'
                        autoComplete='email'
                        required
                        className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-50 focus:outline-none focus:ring-primary-50 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor='name'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Nama
                    </label>
                    <div className='mt-1'>
                      <input
                        id='name'
                        {...register('name')}
                        type='text'
                        required
                        className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-50 focus:outline-none focus:ring-primary-50 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <label
                      htmlFor='password'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Password
                    </label>
                    <div className='mt-1'>
                      <input
                        id='password'
                        {...register('password')}
                        type='password'
                        autoComplete='current-password'
                        required
                        className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-50 focus:outline-none focus:ring-primary-50 sm:text-sm'
                      />
                    </div>
                  </div>

                  <Checkbox
                    color='yellow'
                    label={
                      <p className='text-xs text-gray-500'>
                        Dengan menekan Buat Akun, saya menyetujui bahwa saya
                        telah membaca dan menerima{' '}
                        <span className='text-blue-400'>Privacy Policy</span>{' '}
                        dan{' '}
                        <span className='text-blue-400'>Terms of Service</span>{' '}
                        Countract.
                      </p>
                    }
                  />

                  <button
                    type='submit'
                    className='flex w-full flex-1 justify-center rounded-md border border-transparent bg-primary-50 py-2 px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-50 focus:ring-offset-2'
                  >
                    Buat Akun
                  </button>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
