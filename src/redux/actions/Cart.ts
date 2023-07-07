import { AppDispatch } from '@/redux';

export const fetchCart = () => async (dispatch: AppDispatch) => {
  dispatch({
    url: '/cart',
    method: 'GET',
    actionStart: 'FETCH_CART',
    actionSuccess: 'FETCH_CART_SUCCESS',
    actionError: 'FETCH_CART_ERROR',
    type: 'API',
  });
};

export const addToCart = (productId: number) => (dispatch: AppDispatch) => {
  dispatch({
    url: `/products/add/${productId}`,
    method: 'GET',
    actionStart: 'ADD_TO_CART',
    actionSuccess: 'ADD_TO_CART_SUCCESS',
    actionError: 'ADD_TO_CART_ERROR',
    type: 'API',
  });
};

export const addQuantity = (productId: number) => (dispatch: AppDispatch) => {
  dispatch({
    url: `/cart/plus/${productId}`,
    method: 'GET',
    actionStart: 'ADD_QUANTITY',
    actionSuccess: 'ADD_QUANTITY_SUCCESS',
    actionError: 'ADD_QUANTITY_ERROR',
    type: 'API',
  });
};

export const minusQuantity = (productId: number) => (dispatch: AppDispatch) => {
  dispatch({
    url: `/cart/minus/${productId}`,
    method: 'GET',
    actionStart: 'MINUS_QUANTITY',
    actionSuccess: 'MINUS_QUANTITY_SUCCESS',
    actionError: 'MINUS_QUANTITY_ERROR',
    type: 'API',
  });
};

// export const removeFromCart = (productId: string) => (dispatch: AppDispatch) => {
//   dispatch({
//     url: `/product-to-cart/${productId}`,
//     method: 'DELETE',
//     actionStart: 'REMOVE_FROM_CART',
//     actionSuccess: 'REMOVE_FROM_CART_SUCCESS',
//     actionError: 'REMOVE_FROM_CART_ERROR',
//     type: 'API',
//   });
// }
