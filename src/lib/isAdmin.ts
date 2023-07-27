import { useUser } from '@clerk/nextjs';

export default function useIsAdmin(): boolean {
  const { user } = useUser();
  return user?.publicMetadata.role === 'admin';
}
