import { SignUp } from '@clerk/nextjs';
import * as React from 'react';

import withAuth from '@/components/hoc/withAuth';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import Logo from '~/svg/pancake.svg';

export default withAuth(LoginPage, 'auth');
function LoginPage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <div className='layout min-h-main my-6 flex flex-row items-center'>
          <div className='relative hidden w-0 flex-1 lg:block'>
            <Logo className='h-full w-10/12' />
          </div>
          <div className='flex w-1/2 flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
            <div className='mx-auto w-full max-w-sm lg:w-96'>


              <div className='mt-8 space-y-6'>
                <div className='mt-6'>
                  <SignUp appearance={
                    {
                      variables: {
                        colorPrimary: "#D6AD60",
                      },
                      elements: {
                        formButtonPrimary: "bg-primary-500 text-white border border-primary-600 hover:bg-primary-600 hover:text-white active:bg-primary-700 disabled:bg-primary-700",
                        footerActionLink: "text-blue-400 hover:text-blue-300",
                      }
                    }
                  } signInUrl="/auth/login" />
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
