import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import type { Middleware } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';

import { API_URL, httpClient } from '@/pages/api/products';

import rootReducer from './reducers';

const apiMiddleware: Middleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    next(action);

    if (action.type !== 'API') {
      return;
    }

    const {
      meta,
      url,
      method,
      data,
      actionStart,
      actionSuccess,
      actionError,
      upload,
    } = action;

    // Adds support to POST and PUT requests with data
    const dataOrParams = ['GET'].includes(method) ? 'params' : 'data';

    if (getState().user?.user?.token) {
      httpClient.defaults.headers.Authorization = `Bearer ${
        getState().user?.user?.token
      }`;
      httpClient.defaults.baseURL = API_URL + '/jwt';
    } else {
      httpClient.defaults.baseURL = API_URL;
      httpClient.defaults.headers.Authorization = null;
    }

    // start action
    dispatch({ type: actionStart, meta });
    if (method === 'POST' && upload) {
      httpClient
        .post(url, upload)
        .then((payload) => {
          dispatch({ type: actionSuccess, meta, payload: payload.data });
        })
        .catch((error) => {
          dispatch({
            type: actionError,
            meta,
            error: error?.response?.data?.metadata,
            errorHttp: error,
          });
        });
    } else {
      httpClient
        .request({
          url,
          method,
          [dataOrParams]: data,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((payload) => {
          dispatch({
            type: actionSuccess,
            meta,
            payload: payload.data,
            method,
          });
        })
        .catch((error) => {
          dispatch({
            type: actionError,
            meta,
            error: error?.response?.data,
            errorHttp: error,
          });
        });
    }
  };

const persistConfig = {
  key: 'root',
  storage,
};

const persistedRootReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedRootReducer,
  middleware: [thunk, apiMiddleware],
  devTools: process.env.APP_ENV !== 'production',
});

export const setupStore = () => store;

export type AppStore = ReturnType<typeof setupStore>;
export type AppState = ReturnType<AppStore['getState']>;

export const wrapper = createWrapper<AppStore>(setupStore, { debug: false });
export const persistor = persistStore(store);

// FIXME: remove type any in the future
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppDispatch = AppStore['dispatch'] & ((action: any) => any);
export type { RootState } from './reducers';
