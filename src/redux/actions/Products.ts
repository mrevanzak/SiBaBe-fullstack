import { AppDispatch } from '@/redux';

export const getProducts = () => (dispatch: AppDispatch) => {
  dispatch({
    url: '/products',
    method: 'GET',
    actionStart: 'PRODUCTS_FETCH',
    actionSuccess: 'PRODUCTS_FETCH_SUCCESS',
    actionError: 'PRODUCTS_FETCH_ERROR',
    type: 'API',
    dataChecker: () => true,
  });
};
