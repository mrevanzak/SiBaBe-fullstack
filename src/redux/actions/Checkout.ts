import { AppDispatch } from '@/redux';

export const checkout =
  (courier: string, address: string) => async (dispatch: AppDispatch) => {
    dispatch({
      url: '/checkout/confirm',
      method: 'POST',
      actionStart: 'CHECKOUT_START',
      actionSuccess: 'CHECKOUT_SUCCESS',
      actionError: 'CHECKOUT_ERROR',
      type: 'API',
      data: {
        courier,
        address,
      },
    });
  };
