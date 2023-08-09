import { Listbox, Transition } from '@headlessui/react';
import { Modal } from '@mantine/core';
import { useRouter } from 'next/router';
import * as React from 'react';
import { CgCheck, CgSelect } from 'react-icons/cg';

import clsxm from '@/lib/clsxm';
import { rspc } from '@/lib/rspc';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import AddAddressModal from '@/components/modals/AddAddress';
import OrderRow from '@/components/OrderRow';
import Seo from '@/components/Seo';
import Separator from '@/components/Separator';

import { PaymentMethod } from '@/utils/api';
import thousandSeparator from '@/utils/thousandSeparator';

import Map from '~/svg/map.svg';
import Ninuninu from '~/svg/ninuninu.svg';

const courier = [
  { id: 1, name: 'ITS-JEK', price: 10000 },
  { id: 2, name: 'ITS-EXPRESS', price: 20000 },
];

const payment: { id: number; method: string; name: PaymentMethod }[] = [
  { id: 1, method: 'Transfer Bank', name: 'ITS_BANK' },
  { id: 2, method: 'COD', name: 'COD' },
];

export default function OrderPage() {
  const { data: cart, isLoading: isCartLoading } = rspc.useQuery(['carts.get']);
  const { data: user, isLoading: isUserLoading } = rspc.useQuery(['users.get']);
  const { mutate } = rspc.useMutation(['orders.checkout']);

  const [courierOptions, setcourierOptions] = React.useState(courier[0]);
  const [paymentOptions, setPaymentOptions] = React.useState(payment[0]);
  const [openAddAddressModal, setOpenAddAddressModal] = React.useState(false);

  const router = useRouter();
  const onConfirmOrder = () => {
    if (!user?.address) return;
    mutate(
      {
        courier: courierOptions.name,
        payment_method: paymentOptions.name,
        address: user?.address,
      },
      {
        onSuccess: (data) => {
          router.push(`history/${data.id}`);
        },
      }
    );
  };

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <Modal
        opened={openAddAddressModal}
        onClose={() => setOpenAddAddressModal(false)}
        centered
        withCloseButton={false}
        padding={0}
        radius={50}
        size='lg'
      >
        <AddAddressModal setOpened={setOpenAddAddressModal} />
      </Modal>

      <main className='bg-white pb-12'>
        <div className='layout min-h-main flex flex-col'>
          <p className='my-14 text-xl font-bold'>Pemesanan</p>
          <div className='mx-8 space-y-9 rounded-3xl bg-grey p-12'>
            <div className='flex flex-row'>
              <div className='flex w-8/12 flex-row items-center'>
                <Map className='mr-8 h-20 w-20 flex-shrink-0 self-center rounded-l-2xl border border-black' />
                <div className='space-y-3'>
                  {user?.address ? (
                    <p className='font-semibold'>{user?.address}</p>
                  ) : (
                    <>
                      <p className='font-semibold'>Alamat belum diisi</p>
                      <Button
                        className='rounded-xl bg-brown px-4 py-2 font-secondary'
                        onClick={() => setOpenAddAddressModal(true)}
                      >
                        Tambah Alamat
                      </Button>
                    </>
                  )}
                  {user?.phone && <p>Phone: {user?.phone}</p>}
                </div>
              </div>
              <Separator />
              <div className=' flex w-4/12 flex-col items-center justify-center'>
                <p className='font-semibold'>Penerima</p>
                <p>{user?.name}</p>
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
                        <Listbox.Options className='absolute z-10 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                          {courier.map((courier) => (
                            <Listbox.Option
                              key={courier.id}
                              className={({ active }) =>
                                clsxm(
                                  active
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-900',
                                  'relative cursor-default select-none px-3 py-2'
                                )
                              }
                              value={courier}
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
                                    {courier.name}
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
                          {payment.map((payment) => (
                            <Listbox.Option
                              key={payment.id}
                              className={({ active }) =>
                                clsxm(
                                  active
                                    ? 'bg-primary-600 text-white'
                                    : 'text-gray-900',
                                  'relative cursor-default select-none px-3 py-2'
                                )
                              }
                              value={payment}
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
                                    {payment.method}
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
            {cart?.product_carts.map((product) => (
              <div key={product.product_id} className='px-20'>
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
                Rp {cart && thousandSeparator(cart?.total_price)}
              </p>
            </div>
            <div>
              <Button
                className='rounded-3xl px-10 py-6 font-secondary'
                variant='outline'
                disabled={isCartLoading && isUserLoading}
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
