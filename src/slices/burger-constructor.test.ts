import reducer, {
  addIngredient,
  removeIngredient,
  changeIngredientsOrder,
  resetConstructor,
  initialState,
  TConstructorState
} from './burger-constructor';
import { TIngredient } from '@utils-types';

describe('burgerConstructor slice', () => {
  const bunIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  const mainIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  };

  it('Добавление булки', () => {
    const state: TConstructorState = initialState;
    const nextState = reducer(state, addIngredient(bunIngredient));
    expect(nextState.bun).toMatchObject(bunIngredient);
    expect(nextState.ingredients).toHaveLength(0);
  });
  it('Добавление ингредиента (начинки)', () => {
    const state: TConstructorState = initialState;
    const nextState = reducer(state, addIngredient(mainIngredient));
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toMatchObject({
      ...mainIngredient
    });
    expect(nextState.ingredients[0].id).toBeDefined();
    expect(nextState.bun).toBeNull();
  });

  it('Удаление ингредиента по индексу', () => {
    const state: TConstructorState = {
      bun: null,
      ingredients: [
        { ...mainIngredient, id: '1' },
        { ...mainIngredient, id: '2' }
      ]
    };
    const nextState = reducer(state, removeIngredient(0));
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0].id).toBe('2');
  });

  it('Изменение порядка ингредиентов', () => {
    const state: TConstructorState = {
      bun: null,
      ingredients: [
        { ...mainIngredient, id: '1' },
        { ...mainIngredient, id: '2' },
        { ...mainIngredient, id: '3' }
      ]
    };
    const nextState = reducer(
      state,
      changeIngredientsOrder({ from: 0, to: 2 })
    );
    expect(nextState.ingredients.map((ingredient) => ingredient.id)).toEqual(['2', '3', '1']);
  });

  it('Сброс конструктора в начальное состояние', () => {
    const state: TConstructorState = {
      bun: bunIngredient,
      ingredients: [{ ...mainIngredient, id: '1' }]
    };
    const nextState = reducer(state, resetConstructor());
    expect(nextState).toEqual(initialState);
  });
});
