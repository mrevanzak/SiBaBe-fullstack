import { FC } from 'react';
import { FiSearch } from 'react-icons/fi';

type SearchProps = {
  search: string;
  setSearch: (search: string) => void;
};

const Search: FC<SearchProps> = ({ search, setSearch }) => {
  return (
    <div className='mb-12 w-full max-w-[410px] flex-1 self-center'>
      <label htmlFor='search' className='sr-only' />
      <div className='relative text-gray-400 focus-within:text-gray-400'>
        <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center rounded-full bg-brown'>
          <FiSearch className='w-14 text-black' aria-hidden='true' />
        </div>
        <input
          id='search'
          name='search'
          className='text-grey-900 placeholder-grey-700 block w-full rounded-full border border-transparent bg-slate-300 bg-opacity-25 py-2 pl-3 pr-3 leading-5 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-sm'
          placeholder='Cari produk...'
          type='search'
          value={search}
          onChange={(e) => {
            const filter = e.target.value;
            setSearch(filter);
          }}
        />
      </div>
    </div>
  );
};

export default Search;
