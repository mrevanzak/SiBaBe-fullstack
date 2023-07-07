import update from 'immutability-helper';
import { AnyAction } from 'redux';

import { ApiResponseType } from '@/types';

type ReviewState = {
  loading: boolean;
  error?: ApiResponseType;
};

const initialState = {
  loading: false,
} as ReviewState;

const ReviewReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'ADD_REVIEW':
      return update(state, {
        loading: { $set: true },
      });
    case 'ADD_REVIEW_SUCCESS':
      return update(state, {
        loading: { $set: false },
      });
    case 'ADD_REVIEW_ERROR':
      return update(state, {
        loading: { $set: false },
        error: { $set: action.error },
      });
    default:
      return state;
  }
};

export default ReviewReducer;
