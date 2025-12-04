import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  changeIngredientsOrder,
  removeIngredient
} from '../../slices/burger-constructor';
import { useDispatch } from '../../services/store';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(changeIngredientsOrder({ from: index, to: ++index }));
    };

    const handleMoveUp = () => {
      dispatch(changeIngredientsOrder({ from: index, to: --index }));
    };

    const handleClose = () => {
      dispatch(removeIngredient(+ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
