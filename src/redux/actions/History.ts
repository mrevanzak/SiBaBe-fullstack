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
