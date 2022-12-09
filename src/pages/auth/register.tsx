import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

import { useAppDispatch } from '@/hooks/redux';

import Button from '@/components/buttons/Button';
import withAuth from '@/components/hoc/withAuth';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import { register } from '@/redux/actions/User';

import Logo from '~/svg/pancake.svg';

export default withAuth(LoginPage, 'auth');
function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const usernameRef = React.createRef<HTMLInputElement>();
  const passwordRef = React.createRef<HTMLInputElement>();
  const nameRef = React.createRef<HTMLInputElement>();
  const ageRef = React.createRef<HTMLInputElement>();
  const emailRef = React.createRef<HTMLInputElement>();
  const phoneRef = React.createRef<HTMLInputElement>();
  const addressRef = React.createRef<HTMLInputElement>();

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const name = nameRef.current?.value;
    const age = ageRef.current?.value;
    const email = emailRef.current?.value;
    const phone = phoneRef.current?.value;
    const address = addressRef.current?.value;

    if (username && password && name && age && email && phone && address) {
      dispatch(
        register({
          username,
          password,
          name,
          age: Number(age),
          email,
          phone,
          address,
        })
      );
    }

    router.push('/auth/login');
  };

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <div className='layout min-h-main my-6 flex flex-row items-center'>
          <div className='relative hidden w-0 flex-1 lg:block'>
            <Logo className='h-full w-10/12' />
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
                  <form className='space-y-6' onSubmit={onFormSubmit}>
                    <div>
                      <label
                        htmlFor='username'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Username
                      </label>
                      <div className='mt-1'>
                        <input
                          ref={usernameRef}
                          id='username'
                          autoComplete='username'
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
                          ref={passwordRef}
                          id='password'
                          type='password'
                          className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-50 focus:outline-none focus:ring-primary-50 sm:text-sm'
                        />
                      </div>
                    </div>

                    <div className='space-y-1'>
                      <label
                        htmlFor='name'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Nama
                      </label>
                      <div className='mt-1'>
                        <input
                          ref={nameRef}
                          id='name'
                          type='text'
                          className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-50 focus:outline-none focus:ring-primary-50 sm:text-sm'
                        />
                      </div>
                    </div>

                    <div className='space-y-1'>
                      <label
                        htmlFor='age'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Umur
                      </label>
                      <div className='mt-1'>
                        <input
                          ref={ageRef}
                          id='age'
                          type='number'
                          className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-50 focus:outline-none focus:ring-primary-50 sm:text-sm'
                        />
                      </div>
                    </div>

                    <div className='space-y-1'>
                      <label
                        htmlFor='email'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Email
                      </label>
                      <div className='mt-1'>
                        <input
                          ref={emailRef}
                          id='email'
                          type='email'
                          className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-50 focus:outline-none focus:ring-primary-50 sm:text-sm'
                        />
                      </div>
                    </div>

                    <div className='space-y-1'>
                      <label
                        htmlFor='phone'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Nomor Telepon
                      </label>
                      <div className='mt-1'>
                        <input
                          ref={phoneRef}
                          id='phone'
                          type='number'
                          className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-50 focus:outline-none focus:ring-primary-50 sm:text-sm'
                        />
                      </div>
                    </div>

                    <div className='space-y-1'>
                      <label
                        htmlFor='address'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Alamat
                      </label>
                      <div className='mt-1'>
                        <input
                          ref={addressRef}
                          id='address'
                          type='text'
                          className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary-50 focus:outline-none focus:ring-primary-50 sm:text-sm'
                        />
                      </div>
                    </div>

                    <div className='flex justify-end'>
                      <Button type='submit' className='rounded-2xl py-3 px-20'>
                        Daftar
                      </Button>
                    </div>
                  </form>
                </div>

                <p className='text-xs text-gray-500'>
                  Dilindungi dan bagian dari{' '}
                  <span className='text-blue-400'>Privacy Policy</span> dan{' '}
                  <span className='text-blue-400'>Terms of Service</span>{' '}
                  SiBaBe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
