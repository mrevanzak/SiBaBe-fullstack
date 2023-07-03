import update from 'immutability-helper';
import { AnyAction } from 'redux';

import { ApiResponseType } from '@/types';

type CheckoutState = {
  status?: string;
  invoice?: string;
  loading: boolean;
  error?: ApiResponseType;
};

const initialState = {
  loading: false,
} as CheckoutState;

const CheckoutReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'CHECKOUT':
      return update(state, {
        loading: { $set: true },
      });
    case 'CHECKOUT_SUCCESS':
      return update(state, {
        status: { $set: action.payload.message },
        invoice: { $set: action.payload.data.invoice },
        loading: { $set: false },
      });
    case 'CHECKOUT_ERROR':
      return update(state, {
        loading: { $set: false },
        error: { $set: action.error },
      });
    case 'CHECKOUT_CLEAR':
      return update(state, {
        status: { $set: undefined },
      });
    case 'PAYMENT':
      return update(state, {
        loading: { $set: true },
      });
    case 'PAYMENT_SUCCESS':
      return update(state, {
        loading: { $set: false },
      });
    case 'PAYMENT_ERROR':
      return update(state, {
        loading: { $set: false },
        error: { $set: action.error },
      });
    default:
      return state;
  }
};

export default CheckoutReducer;
