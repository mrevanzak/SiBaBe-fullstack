import update from 'immutability-helper';
import { AnyAction } from 'redux';

import { Cart } from '@/types';

type CartState = {
  cart: Cart;
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
};

const initialState = {
  cart: {
    id: '123',
    items: {},
    total: 0,
  },
  loading: false,
} as CartState;

const CartReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'CART_ADD_ITEM':
      return update(state, {
        cart: {
          items: {
            $merge: {
              [action.payload.id]: { ...action.payload, quantity: 1 },
            },
          },
          total: {
            $set: state.cart.total + action.payload.price,
          },
        },
      });
    case 'CART_REMOVE_ITEM':
      return update(state, {
        cart: {
          items: {
            $unset: [action.payload.id],
          },
          total: {
            $set: state.cart.total - action.payload.price,
          },
        },
      });
    case 'CART_UPDATE_ITEM':
      return update(state, {
        cart: {
          items: {
            [action.payload.id]: {
              quantity: {
                $set: action.payload.quantity,
              },
            },
          },
          total: {
            $set:
              state.cart.total -
              state.cart.items[action.payload.id].price *
                state.cart.items[action.payload.id].quantity +
              state.cart.items[action.payload.id].price *
                action.payload.quantity,
          },
        },
      });
    case 'CART_SET_TOTAL':
      return update(state, {
        cart: {
          total: {
            $set: action.payload,
          },
        },
      });
    default:
      return state;
  }
};

export default CartReducer;
