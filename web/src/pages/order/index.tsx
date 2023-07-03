import { Listbox, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import * as React from 'react';
import { CgCheck, CgSelect } from 'react-icons/cg';

import clsxm from '@/lib/clsxm';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';

import Button from '@/components/buttons/Button';
import withAuth from '@/components/hoc/withAuth';
import Layout from '@/components/layout/Layout';
import OrderRow from '@/components/OrderRow';
import Seo from '@/components/Seo';
import Separator from '@/components/Separator';

import { checkout } from '@/redux/actions/Checkout';
import { fetchUser } from '@/redux/actions/User';
import thousandSeparator from '@/utils/thousandSeparator';

import Map from '~/svg/map.svg';
import Ninuninu from '~/svg/ninuninu.svg';

const courier = [{ id: 1, name: 'ITS-JEK', price: 10000 }];

const payment = [{ id: 1, method: 'Transfer Bank', name: 'ITS-BANK' }];

export default withAuth(OrderPage, 'all');
function OrderPage() {
  const { cart } = useAppSelector(({ cart }) => cart);
  const { user } = useAppSelector(({ user }) => user);
  const { status } = useAppSelector(({ checkout }) => checkout);
  const dispatch = useAppDispatch();
  const [courierOptions, setcourierOptions] = React.useState(courier[0]);
  const [paymentOptions, setPaymentOptions] = React.useState(payment[0]);
  const router = useRouter();

  React.useEffect(() => {
    if (user && !user.data) {
      dispatch(fetchUser());
    }
    if (status === 'Success confirm checkout') router.push('/order/confirm');
  }, [status]);

  const onConfirmOrder = () => {
    if (user?.data) {
      dispatch(checkout(courierOptions.name, user.data.address));
    }
  };

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <main className='bg-white pb-12'>
        <div className='layout min-h-main flex flex-col'>
          <p className='my-14 text-xl font-bold'>Pemesanan</p>
          <div className='mx-8 space-y-9 rounded-3xl bg-grey p-12'>
            <div className='flex flex-row'>
              <div className='flex w-8/12 flex-row items-center'>
                <Map className='mr-8 h-20 w-20 flex-shrink-0 self-center rounded-l-2xl border border-black' />
                <div className='space-y-3'>
                  <p className='font-semibold'>{user?.data?.address}</p>
                  <p>Phone: {user?.data?.phone}</p>
                </div>
              </div>
              <Separator />
              <div className=' flex w-4/12 flex-col items-center justify-center'>
                <p className='font-semibold'>Penerima</p>
                <p>{user?.data?.name}</p>
              </div>
            </div>
            <Ninuninu className='w-full' />
            <div className='flex flex-row items-center px-20'>
              <p>Jasa Pengiriman</p>
              <Listbox value={courierOptions} onChange={setcourierOptions}>
                {({ open }) => (
                  <>
                    <div className='relative mx-auto mt-1'>
                      <Listbox.Button className='relative w-full cursor-default rounded-md bg-transparent py-2 pl-3 pr-10 text-left focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm'>
                        <span className='block truncate font-semibold'>
                          {courierOptions.name}
                        </span>
                        <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                          <CgSelect
                            className='h-5 w-5 text-gray-400'
                            aria-hidden='true'
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={React.Fragment}
                        leave='transition ease-in duration-100'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                      >
                        <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                          {courier.map((person) => (
                            <Listbox.Option
                              key={person.id}
                              className={({ active }) =>
                                clsxm(
                                  active
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-900',
                                  'relative cursor-default select-none py-2 pl-3 pr-9'
                                )
                              }
                              value={person}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={clsxm(
                                      selected
                                        ? 'font-semibold'
                                        : 'font-normal',
                                      'block truncate'
                                    )}
                                  >
                                    {person.name}
                                  </span>

                                  {courierOptions ? (
                                    <span
                                      className={clsxm(
                                        active
                                          ? 'text-white'
                                          : 'text-primary-600',
                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                      )}
                                    >
                                      <CgCheck
                                        className='h-5 w-5'
                                        aria-hidden='true'
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
              <p className='font-semibold'>
                Rp {thousandSeparator(courierOptions.price)}
              </p>
            </div>
            <div className='flex flex-row items-center px-20'>
              <p>Metode Pembayaran</p>
              <Listbox value={paymentOptions} onChange={setPaymentOptions}>
                {({ open }) => (
                  <>
                    <div className='relative mx-auto mt-1'>
                      <Listbox.Button className='relative w-full cursor-default rounded-md bg-transparent py-2 pl-3 pr-10 text-left focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm'>
                        <span className='block truncate font-semibold'>
                          {paymentOptions.method}
                        </span>
                        <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                          <CgSelect
                            className='h-5 w-5 text-gray-400'
                            aria-hidden='true'
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={React.Fragment}
                        leave='transition ease-in duration-100'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                      >
                        <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                          {payment.map((person) => (
                            <Listbox.Option
                              key={person.id}
                              className={({ active }) =>
                                clsxm(
                                  active
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-900',
                                  'relative cursor-default select-none py-2 pl-3 pr-9'
                                )
                              }
                              value={person}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={clsxm(
                                      selected
                                        ? 'font-semibold'
                                        : 'font-normal',
                                      'block truncate'
                                    )}
                                  >
                                    {person.method}
                                  </span>

                                  {selected ? (
                                    <span
                                      className={clsxm(
                                        active
                                          ? 'text-white'
                                          : 'text-primary-600',
                                        'absolute inset-y-0 right-0 flex items-center pr-4'
                                      )}
                                    >
                                      <CgCheck
                                        className='h-5 w-5'
                                        aria-hidden='true'
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
              <p className='font-semibold'>{paymentOptions.name}</p>
            </div>
            <Separator width='70%' className='mx-auto' height={1.5} />
            {cart &&
              cart.product &&
              cart.product.map((product) => (
                <div key={product.productId} className='px-20'>
                  <OrderRow product={product} />
                </div>
              ))}
          </div>
          <div className='mt-9 flex items-center justify-end gap-7'>
            <div className='text-end'>
              <p className='font-secondary text-sm font-semibold'>
                Total Harga
              </p>
              <p className='font-secondary text-2xl font-bold'>
                Rp {cart?.totalPrice && thousandSeparator(cart?.totalPrice)}
              </p>
            </div>
            <div>
              <Button
                className='rounded-3xl px-10 py-6 font-secondary'
                variant='outline'
                onClick={onConfirmOrder}
              >
                Lanjutkan Pemesanan
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
