import { AxiosError } from 'axios';
import update from 'immutability-helper';
import { AnyAction } from 'redux';

import { History, HistoryDetail } from '@/types';

type HistoryState = {
  historyById?: HistoryDetail;
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
        history: { $set: action.payload.data },
        loading: { $set: false },
      });
    case 'FETCH_HISTORY_ERROR':
      return update(state, {
        error: { $set: action.payload.error },
        loading: { $set: false },
      });
    case 'FETCH_HISTORY_BY_ID':
      return update(state, {
        loading: { $set: true },
      });
    case 'FETCH_HISTORY_BY_ID_SUCCESS':
      return update(state, {
        historyById: { $set: action.payload.data },
        loading: { $set: false },
      });
    case 'FETCH_HISTORY_BY_ID_ERROR':
      return update(state, {
        error: { $set: action.payload.error },
        loading: { $set: false },
      });
    default:
      return state;
  }
};

export default HistoryReducer;
