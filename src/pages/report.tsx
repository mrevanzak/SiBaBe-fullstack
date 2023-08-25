import { Modal } from '@mantine/core';
import { LineChart } from '@tremor/react';
import * as React from 'react';

import { rspc } from '@/lib/rspc';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import AddProduction from '@/components/modals/AddProduction';
import Seo from '@/components/Seo';
import Separator from '@/components/Separator';

import thousandSeparator from '@/utils/thousandSeparator';

export default function ReportPage() {
  const { data } = rspc.useQuery(['reports.get']);
  const computedData = React.useMemo(() => {
    if (!data) return [];
    const month = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];
    const monthIndex = new Date().getMonth();

    return month.slice(0, monthIndex + 1).map((month, index) => {
      return {
        month,
        income: data[index]?.income ?? 0,
        expense: data[index]?.expense ?? 0,
      };
    });
  }, [data]);

  const [openAddProduction, setOpenAddProduction] = React.useState(false);

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <Modal
        opened={openAddProduction}
        onClose={() => setOpenAddProduction(false)}
        centered
        withCloseButton={false}
        padding={0}
        radius={50}
        size={500}
      >
        <AddProduction setOpened={setOpenAddProduction} />
      </Modal>
      <main>
        <div className='layout min-h-main mb-12 flex flex-col space-y-5'>
          <h2 className='text-center font-secondary'>Classification By</h2>
          <Separator width='30%' height={2} className='mx-auto' />
          <div className='mx-auto w-24'>
            <p className='mb-3 text-center font-secondary'>Month</p>
            <Separator width='100%' height={2} className='mx-auto' />
          </div>
          <div className='relative'>
            <LineChart
              className='mt-6'
              data={computedData}
              index='month'
              categories={['income', 'expense']}
              colors={['emerald', 'red']}
              valueFormatter={(value) => `Rp ${thousandSeparator(value)}`}
              showYAxis={false}
              curveType='monotone'
            />
          </div>

          <div className='mt-9 flex items-center justify-end gap-7'>
            <div>
              <Button
                className='rounded-3xl px-14 py-6 font-secondary'
                variant='outline'
                onClick={() => {
                  setOpenAddProduction(true);
                }}
              >
                Tambah Data Produksi
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
