import { rootReducer } from './rootReducer';
import { ingredientsSlice } from '../slices/ingredients';
import { constructorSlice } from '../slices/burger-constructor';
import { orderSlice } from '../slices/orders';
import { feedSlice } from '../slices/feeds';
import { userSlice } from '../slices/user';

describe('rootReducer', () => {
  it('Проверка инициализации rootReducer с undefined состоянием и unknown экшеном', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const initialState = rootReducer(undefined, unknownAction);

    // Проверка ключей
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('orders');
    expect(initialState).toHaveProperty('feeds');
    expect(initialState).toHaveProperty('user');

    // Проверка дефолтных состояний
    expect(initialState.ingredients).toEqual(
      ingredientsSlice.getInitialState()
    );
    expect(initialState.burgerConstructor).toEqual(
      constructorSlice.getInitialState()
    );
    expect(initialState.orders).toEqual(orderSlice.getInitialState());
    expect(initialState.feeds).toEqual(feedSlice.getInitialState());
    expect(initialState.user).toEqual(userSlice.getInitialState());
  });
});
