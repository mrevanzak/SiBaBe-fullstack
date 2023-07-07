import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import * as React from 'react';
import { ImSpinner8 } from 'react-icons/im';
import { toast } from 'react-toastify';

import { useAppDispatch } from '@/hooks/redux';

import { httpClient } from '@/pages/api/products';
import { logout } from '@/redux/actions/User';

export interface WithAuthProps {
  auth: boolean;
}

export const USER_ROUTE = '/';
const LOGIN_ROUTE = '/auth/login';

enum RouteRole {
  /**
   * For authentication pages
   * @example /login /register
   */
  auth,
  /**
   * Optional authentication
   * It doesn't push to login page if user is not authenticated
   */
  optional,
  /**
   * For all authenticated user
   * will push to login if user is not authenticated
   */
  all,
}

/**
 * Add role-based access control to a component
 *
 * @see https://react-typescript-cheatsheet.netlify.app/docs/hoc/full_example/
 * @see https://github.com/mxthevs/nextjs-auth/blob/main/src/components/withAuth.tsx
 */
export default function withAuth<T extends WithAuthProps = WithAuthProps>(
  Component: React.ComponentType<T>,
  routeRole: keyof typeof RouteRole
) {
  const ComponentWithAuth = (props: Omit<T, keyof WithAuthProps>) => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { query } = router;

    //#region  //*=========== STORE ===========
    const { isLoaded, isSignedIn, user } = useUser();
    //#endregion  //*======== STORE ===========

    React.useEffect(() => {
      if (isLoaded) {
        if (user) {
          httpClient.interceptors.response.use(
            (response) => response,
            (error) => {
              if (error.response.status === 401) {
                dispatch(logout());
                router.push(LOGIN_ROUTE);
                toast.warn('Your session has expired. Please login again.');
              }
              return Promise.reject(error);
            }
          );
          // Prevent authenticated user from accessing auth or other role pages
          if (routeRole === 'auth') {
            if (query?.redirect) {
              router.replace(query.redirect as string);
            } else {
              router.replace(USER_ROUTE);
            }
          }
        } else {
          // Prevent unauthenticated user from accessing protected pages
          if (routeRole !== 'auth' && routeRole !== 'optional') {
            router.replace(
              `${LOGIN_ROUTE}?redirect=${router.asPath}`,
              `${LOGIN_ROUTE}`
            );
          }
        }
      }
    }, [isLoaded, query, router]);

    if (
      // If unauthenticated user want to access protected pages
      (!isLoaded || !isSignedIn) &&
      // auth pages and optional pages are allowed to access without login
      routeRole !== 'auth' &&
      routeRole !== 'optional'
    ) {
      return (
        <div className='flex min-h-screen flex-col items-center justify-center text-gray-800'>
          <ImSpinner8 className='mb-4 animate-spin text-4xl' />
          <p>Loading...</p>
        </div>
      );
    }

    return <Component {...(props as T)} auth={isSignedIn} />;
  };

  return ComponentWithAuth;
}
