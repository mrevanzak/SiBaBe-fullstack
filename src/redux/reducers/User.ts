import update from 'immutability-helper';
import { AnyAction } from 'redux';

import { ApiResponseType, User } from '@/types';

type UserState = {
  user?: User;
  loading: boolean;
  error?: ApiResponseType;
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
      return update(state, {
        user: { $set: action.payload.data },
        loading: { $set: false },
      });
    case 'USER_LOGIN_ERROR':
      return update(state, {
        loading: { $set: false },
        error: { $set: action.error },
      });
    case 'USER_LOGOUT':
      return update(state, {
        loading: { $set: false },
        user: { $set: undefined },
      });
    case 'FETCH_USER':
      return update(state, {
        loading: { $set: true },
      });
    case 'FETCH_USER_SUCCESS':
      return update(state, {
        user: { data: { $set: action.payload.data } },
        loading: { $set: false },
      });
    case 'FETCH_USER_ERROR':
      return update(state, {
        error: { $set: action.error },
        loading: { $set: false },
      });
    default:
      return state;
  }
};

export default ProductReducer;
