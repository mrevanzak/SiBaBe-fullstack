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

export const logout = () => (dispatch: AppDispatch) => {
  dispatch({
    type: 'USER_LOGOUT',
    payload: {},
  });
};

export const register =
  (
    username: string,
    password: string,
    name: string,
    age: string,
    email: string,
    phone: string,
    address: string
  ) =>
  (dispatch: AppDispatch) => {
    dispatch({
      url: '/register',
      method: 'POST',
      meta: { username, password, name, age, email, phone, address },
      actionStart: 'USER_REGISTER',
      actionSuccess: 'USER_REGISTER_SUCCESS',
      actionError: 'USER_REGISTER_ERROR',
      type: 'API',
      data: {
        username,
        password,
        name,
        age,
        email,
        phone,
        address,
      },
    });
  };
