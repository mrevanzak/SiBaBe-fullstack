import { AxiosError } from 'axios';
import update from 'immutability-helper';
import { AnyAction } from 'redux';

import { UserCart } from '@/types';

type CartState = {
  cart?: UserCart;
  loading: boolean;
  error?: AxiosError;
};

const initialState = {
  loading: false,
} as CartState;

const CartReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'FETCH_CART':
      return update(state, {
        loading: { $set: true },
      });
    case 'FETCH_CART_SUCCESS':
      return update(state, {
        cart: { $set: action.payload.data },
        loading: { $set: false },
      });
    case 'FETCH_CART_ERROR':
      return update(state, {
        loading: { $set: false },
        error: { $set: action.payload.error },
      });
    case 'ADD_QUANTITY':
      return update(state, {
        loading: { $set: true },
      });
    case 'ADD_QUANTITY_SUCCESS':
      return update(state, {
        cart: { $set: action.payload.data },
        loading: { $set: false },
      });
    case 'ADD_QUANTITY_ERROR':
      return update(state, {
        loading: { $set: false },
        error: { $set: action.payload.error },
      });
    case 'MINUS_QUANTITY':
      return update(state, {
        loading: { $set: true },
      });
    case 'MINUS_QUANTITY_SUCCESS':
      return update(state, {
        cart: { $set: action.payload.data },
        loading: { $set: false },
      });
    case 'MINUS_QUANTITY_ERROR':
      return update(state, {
        loading: { $set: false },
        error: { $set: action.payload.error },
      });
    default:
      return state;
  }
};

export default CartReducer;
