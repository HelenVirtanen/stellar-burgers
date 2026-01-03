import {
  userSlice,
  initialState,
  loginUser,
  registerUser,
  fetchUser,
  updateUser,
  logoutUser
} from './user';
import { TUser } from '@utils-types';

const reducer = userSlice.reducer;

describe('Обработка экшенов user slice', () => {
  const mockUser: TUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  it('loginUser Request', () => {
    const state = reducer(
      initialState,
      loginUser.pending('req', { email: '', password: '' })
    );
    expect(state.loading).toBe(true);
    expect(state.loginUserError).toBeNull();
  });

  it('loginUser Success', () => {
    const state = reducer(
      { ...initialState, loading: true },
      loginUser.fulfilled(mockUser, 'req', { email: '', password: '' })
    );
    expect(state.data).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  it('loginUser Failed', () => {
    const state = reducer(
      { ...initialState, loading: true },
      loginUser.rejected(
        new Error('fail'),
        'req',
        { email: '', password: '' },
        'Ошибка авторизации'
      )
    );
    expect(state.loading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.loginUserError).toBe('Ошибка авторизации');
  });

  it('registerUser Request', () => {
    const state = reducer(
      initialState,
      registerUser.pending('req', { email: '', password: '', name: '' })
    );
    expect(state.loading).toBe(true);
  });

  it('registerUser Success', () => {
    const state = reducer(
      { ...initialState, loading: true },
      registerUser.fulfilled(mockUser, 'req', {
        email: '',
        password: '',
        name: ''
      })
    );
    expect(state.data).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  it('registerUser Failed', () => {
    const state = reducer(
      { ...initialState, loading: true },
      registerUser.rejected(
        new Error('fail'),
        'req',
        { email: '', password: '', name: '' },
        'Ошибка регистрации'
      )
    );
    expect(state.loading).toBe(false);
    expect(state.loginUserError).toBe('Ошибка регистрации');
  });

  it('fetchUser Request', () => {
    const state = reducer(initialState, fetchUser.pending('req'));
    expect(state.loading).toBe(true);
  });

  it('fetchUser Success', () => {
    const state = reducer(
      { ...initialState, loading: true },
      fetchUser.fulfilled(mockUser, 'req')
    );
    expect(state.data).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isAuthChecked).toBe(true);
  });

  it('fetchUser Failed', () => {
    const state = reducer(
      { ...initialState, loading: true },
      fetchUser.rejected(
        new Error('fail'),
        'req',
        undefined,
        'Ошибка получения данных о пользователе'
      )
    );
    expect(state.loading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.loginUserError).toBe('Ошибка получения данных о пользователе');
  });

  it('updateUser Request', () => {
    const state = reducer(
      initialState,
      updateUser.pending('req', { name: 'New' })
    );
    expect(state.loading).toBe(true);
  });

  it('updateUser Success', () => {
    const state = reducer(
      { ...initialState, loading: true },
      updateUser.fulfilled(mockUser, 'req', { name: 'New' })
    );
    expect(state.data).toEqual(mockUser);
    expect(state.loading).toBe(false);
  });

  it('updateUser Failed', () => {
    const state = reducer(
      { ...initialState, loading: true },
      updateUser.rejected(
        new Error('fail'),
        'req',
        { name: 'New' },
        'Ошибка обновления пользователя'
      )
    );
    expect(state.loading).toBe(false);
    expect(state.loginUserError).toBe('Ошибка обновления пользователя');
  });

  it('logoutUser Request', () => {
    const state = reducer(initialState, logoutUser.pending('req'));
    expect(state.loading).toBe(true);
  });

  it('logoutUser Success', () => {
    const state = reducer(
      { ...initialState, loading: true, data: mockUser, isAuthenticated: true },
      logoutUser.fulfilled(undefined, 'req')
    );
    expect(state.data).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.loading).toBe(false);
  });

  it('logoutUser Failed', () => {
    const state = reducer(
      { ...initialState, loading: true },
      logoutUser.rejected(
        new Error('fail'),
        'req',
        undefined,
        'Неизвестная ошибка выхода пользователя'
      )
    );
    expect(state.loading).toBe(false);
    expect(state.loginUserError).toBe('Неизвестная ошибка выхода пользователя');
  });

  it('authChecked устанавливает isAuthChecked = true', () => {
    const state = reducer(initialState, userSlice.actions.authChecked());
    expect(state.isAuthChecked).toBe(true);
  });

  it('setUser устанавливает данные', () => {
    const state = reducer(initialState, userSlice.actions.setUser(mockUser));
    expect(state.data).toEqual(mockUser);
  });

  it('userLogout очищает данные', () => {
    const state = reducer(
      { ...initialState, data: mockUser },
      userSlice.actions.userLogout()
    );
    expect(state.data).toBeNull();
  });
});
