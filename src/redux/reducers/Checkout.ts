import { AxiosError } from 'axios';
import update from 'immutability-helper';
import { AnyAction } from 'redux';

type CheckoutState = {
  status?: string;
  invoice?: string;
  loading: boolean;
  error?: AxiosError;
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
        error: { $set: action.payload.error },
      });
    case 'CHECKOUT_CLEAR':
      return update(state, {
        status: { $set: undefined },
      });
    default:
      return state;
  }
};

export default CheckoutReducer;
