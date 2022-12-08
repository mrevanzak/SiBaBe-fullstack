import { AxiosError } from 'axios';
import update from 'immutability-helper';
import { AnyAction } from 'redux';

import { UserCart } from '@/types';

type CheckoutState = {
  checkout?: UserCart;
  loading: boolean;
  error?: AxiosError;
};

const initialState = {
  loading: false,
} as CheckoutState;

const CheckoutReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'FETCH_CHECKOUT':
      return update(state, {
        loading: { $set: true },
      });
    case 'FETCH_CHECKOUT_SUCCESS':
      return update(state, {
        checkout: { $set: action.payload.data },
        loading: { $set: false },
      });
    case 'FETCH_CHECKOUT_ERROR':
      return update(state, {
        loading: { $set: false },
        error: { $set: action.payload.error },
      });
    default:
      return state;
  }
};

export default CheckoutReducer;
