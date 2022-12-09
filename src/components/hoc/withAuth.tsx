import { useRouter } from 'next/router';
import * as React from 'react';
import { ImSpinner8 } from 'react-icons/im';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';

import { httpClient } from '@/pages/api/products';
import { logout } from '@/redux/actions/User';

import { User } from '@/types';

export interface WithAuthProps {
  user: User;
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
    const { user, loading } = useAppSelector(({ user }) => user);
    //#endregion  //*======== STORE ===========

    React.useEffect(() => {
      if (!loading) {
        if (user) {
          if (routeRole === 'all') {
            httpClient.interceptors.response.use(
              (response) => response,
              (error) => {
                if (error.response.status === 401) {
                  dispatch(logout());
                  router.push(LOGIN_ROUTE);
                }
                return Promise.reject(error);
              }
            );
          }
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
    }, [loading, query, router, user]);

    if (
      // If unauthenticated user want to access protected pages
      (loading || !user) &&
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

    return <Component {...(props as T)} user={user} />;
  };

  return ComponentWithAuth;
}
