import * as React from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';

import HistoryRow from '@/components/HistoryRow';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Separator from '@/components/Separator';

import { fetchHistory } from '@/redux/actions/History';

export default function HistoryPage() {
  const { history } = useAppSelector(({ history }) => history);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchHistory());
  }, []);

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <div className='layout min-h-main mb-12 flex flex-col'>
          <p className='text-xl font-bold'>Riwayat</p>
          <Separator
            width='100%'
            height={2}
            color='#D6AD60BF'
            className='mt-8'
          />
          {history &&
            history.order &&
            history.order.map((history) => (
              <HistoryRow key={history.id} history={history} />
            ))}
        </div>
      </main>
    </Layout>
  );
}
