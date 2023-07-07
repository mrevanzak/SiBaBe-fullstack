import { AppDispatch } from '@/redux';

export const fetchHistory = () => async (dispatch: AppDispatch) => {
  dispatch({
    url: '/history',
    method: 'GET',
    actionStart: 'FETCH_HISTORY',
    actionSuccess: 'FETCH_HISTORY_SUCCESS',
    actionError: 'FETCH_HISTORY_ERROR',
    type: 'API',
  });
};

export const fetchHistoryById =
  (id: number) => async (dispatch: AppDispatch) => {
    dispatch({
      url: `/history/${id}`,
      method: 'GET',
      actionStart: 'FETCH_HISTORY_BY_ID',
      actionSuccess: 'FETCH_HISTORY_BY_ID_SUCCESS',
      actionError: 'FETCH_HISTORY_BY_ID_ERROR',
      type: 'API',
    });
  };
