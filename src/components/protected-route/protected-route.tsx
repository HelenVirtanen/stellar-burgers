import React from 'react';
import { getUserData, isAuthChecked } from '../../slices/user';
import { useSelector } from '../../services/store';
import { useLocation, Navigate } from 'react-router-dom';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const user = useSelector(getUserData);
  const isAuth = useSelector(isAuthChecked);
  const location = useLocation();

  if (!isAuth) {
    return <Preloader />;
  }

  if (!user && !onlyUnAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (user && onlyUnAuth) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate replace to={from} />;
  }

  return children;
};
