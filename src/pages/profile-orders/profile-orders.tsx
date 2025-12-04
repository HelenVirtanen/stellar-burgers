import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { fetchOrders, getOrders } from '../../slices/orders';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector(getOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrders());
  });

  return <ProfileOrdersUI orders={orders} />;
};
