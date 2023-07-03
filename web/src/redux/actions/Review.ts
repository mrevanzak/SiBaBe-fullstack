import { AppDispatch } from '@/redux';

export const addReview =
  (feedback: string, rating: number, historyId: string, productId: number) =>
  (dispatch: AppDispatch) => {
    dispatch({
      url: `/history/${historyId}/feedback/${productId}`,
      method: 'POST',
      meta: { feedback, rating, historyId, productId },
      actionStart: 'ADD_REVIEW',
      actionSuccess: 'ADD_REVIEW_SUCCESS',
      actionError: 'ADD_REVIEW_ERROR',
      type: 'API',
      data: {
        feedback,
        rating,
      },
    });
  };
