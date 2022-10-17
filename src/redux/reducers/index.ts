import { AnyAction, combineReducers } from 'redux';

import CartReducer from '@/redux/reducers/Cart';
import ProductReducer from '@/redux/reducers/Products';

const appReducer = combineReducers({
  products: ProductReducer,
  cart: CartReducer,
});

export type RootState = ReturnType<typeof appReducer>;

const createRootReducer = (state: RootState | undefined, action: AnyAction) => {
  // if (action.type === USER_SIGNOUT) {
  //   return appReducer(undefined, action);
  // }
  return appReducer(state, action);
};

export default createRootReducer;
