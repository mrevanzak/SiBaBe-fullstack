import { AxiosError } from 'axios';
import update from 'immutability-helper';
import { AnyAction } from 'redux';

import { History } from '@/types';

type HistoryState = {
  history?: History;
  loading: boolean;
  error?: AxiosError;
};

const initialState = {
  loading: false,
} as HistoryState;

const HistoryReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'FETCH_HISTORY':
      return update(state, {
        loading: { $set: true },
      });
    case 'FETCH_HISTORY_SUCCESS':
      return update(state, {
        history: { $set: action.payload },
        loading: { $set: false },
      });
    case 'FETCH_HISTORY_ERROR':
      return update(state, {
        error: { $set: action.payload },
        loading: { $set: false },
      });
    default:
      return state;
  }
};

export default HistoryReducer;
