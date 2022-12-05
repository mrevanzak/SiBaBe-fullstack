import { AxiosError } from 'axios';
import update from 'immutability-helper';
import { AnyAction } from 'redux';

import { User } from '@/types';

type UserState = {
  user?: User;
  loading: boolean;
  error?: AxiosError;
};

const initialState = {
  loading: false,
} as UserState;

const ProductReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return update(state, {
        loading: { $set: true },
      });
    case 'USER_LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.data.token);
      return update(state, {
        user: { $set: action.payload.data },
        loading: { $set: false },
      });
    case 'USER_LOGIN_ERROR':
      return update(state, {
        loading: { $set: false },
        error: { $set: action.payload.error },
      });
    case 'USER_LOGOUT':
      return update(state, {
        loading: { $set: true },
        user: { $set: undefined },
      });
    default:
      return state;
  }
};

export default ProductReducer;
