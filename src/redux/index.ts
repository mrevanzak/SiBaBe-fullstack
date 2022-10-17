import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import type { Middleware } from 'redux';
import thunk from 'redux-thunk';

import { httpClient } from '@/pages/api/products';

import rootReducer from './reducers';

const apiMiddleware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    next(action);

    if (action.type !== 'API') {
      return;
    }

    const {
      dataChecker,
      meta,
      url,
      method,
      data,
      actionStart,
      actionSuccess,
      actionError,
      upload,
    } = action;

    if (!dataChecker()) {
      return;
    }

    // Adds support to POST and PUT requests with data
    const dataOrParams = ['GET'].includes(method) ? 'params' : 'data';

    // start action
    dispatch({ type: actionStart, meta });
    if (method === 'POST' && upload) {
      httpClient
        .post(url, upload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
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

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: [thunk, apiMiddleware],
    devTools: process.env.APP_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof setupStore>;
export type AppState = ReturnType<AppStore['getState']>;

export const wrapper = createWrapper<AppStore>(setupStore, { debug: false });

// FIXME: remove type any in the future
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppDispatch = AppStore['dispatch'] & ((action: any) => any);
export type { RootState } from './reducers';
