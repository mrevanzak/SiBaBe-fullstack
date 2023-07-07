import { AnyAction, combineReducers } from 'redux';

import CartReducer from '@/redux/reducers/Cart';
import CheckoutReducer from '@/redux/reducers/Checkout';
import HistoryReducer from '@/redux/reducers/History';
import ProductReducer from '@/redux/reducers/Products';
import ReviewReducer from '@/redux/reducers/Review';
import UserReducer from '@/redux/reducers/User';

const appReducer = combineReducers({
  products: ProductReducer,
  cart: CartReducer,
  user: UserReducer,
  history: HistoryReducer,
  checkout: CheckoutReducer,
  review: ReviewReducer,
});

export type RootState = ReturnType<typeof appReducer>;

const createRootReducer = (state: RootState | undefined, action: AnyAction) => {
  if (action.type === 'USER_LOGOUT') {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default createRootReducer;
