import { AppDispatch } from '@/redux';

import { Product, ProductWithQuantity } from '@/types';

export const addToCart = (product: Product) => (dispatch: AppDispatch) => {
  dispatch({
    type: 'CART_ADD_ITEM',
    payload: product,
  });
};

export const removeFromCart = (product: Product) => (dispatch: AppDispatch) => {
  dispatch({
    type: 'CART_REMOVE_ITEM',
    payload: product,
  });
};

export const addQuantity =
  (product: ProductWithQuantity) => (dispatch: AppDispatch) => {
    dispatch({
      type: 'CART_UPDATE_ITEM',
      payload: {
        id: product.id,
        quantity: product.quantity + 1,
      },
    });
  };

export const minusQuantity =
  (product: ProductWithQuantity) => (dispatch: AppDispatch) => {
    if (product.quantity > 1) {
      return dispatch({
        type: 'CART_UPDATE_ITEM',
        payload: {
          id: product.id,
          quantity: product.quantity - 1,
        },
      });
    }
    dispatch({
      type: 'CART_REMOVE_ITEM',
      payload: product,
    });
  };

export const setTotal = (total: number) => (dispatch: AppDispatch) => {
  dispatch({
    type: 'CART_SET_TOTAL',
    payload: total,
  });
};
