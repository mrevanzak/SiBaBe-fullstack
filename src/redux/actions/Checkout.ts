import { AppDispatch } from '@/redux';

export const checkout =
  (courier: string, address: string) => async (dispatch: AppDispatch) => {
    dispatch({
      url: '/checkout/confirm',
      method: 'POST',
      actionStart: 'CHECKOUT',
      actionSuccess: 'CHECKOUT_SUCCESS',
      actionError: 'CHECKOUT_ERROR',
      type: 'API',
      data: {
        courier,
        address,
      },
    });
  };

export const clearCheckoutMessage = () => (dispatch: AppDispatch) => {
  dispatch({
    type: 'CHECKOUT_CLEAR',
  });
};
