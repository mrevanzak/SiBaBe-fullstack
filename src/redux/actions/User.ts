import { AppDispatch } from '@/redux';

export const login =
  (username: string, password: string) => (dispatch: AppDispatch) => {
    dispatch({
      url: '/login',
      method: 'POST',
      meta: { username, password },
      actionStart: 'USER_LOGIN',
      actionSuccess: 'USER_LOGIN_SUCCESS',
      actionError: 'USER_LOGIN_ERROR',
      type: 'API',
      data: {
        username,
        password,
      },
    });
  };

export const setTotal = () => (dispatch: AppDispatch) => {
  dispatch({
    type: 'USER_LOGOUT',
    payload: {},
  });
};
