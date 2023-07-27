import { toast } from 'react-toastify';

export default function LoadingHandler(isLoading: boolean, meta: string) {
  if (isLoading) {
    toast.loading(`Memuat ${meta}...`, {
      toastId: 'fetching',
    });
  }

  if (!isLoading) {
    toast.update('fetching', {
      render: `${meta.charAt(0).toUpperCase() + meta.slice(1)} berhasil dimuat`,
      type: 'success',
      isLoading: false,
      autoClose: 2000,
    });
  }
}
