import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { updateUser } from '../../slices/user';
import { useForm } from '../../hooks/useForm';

type FormState = {
  name: string;
  email: string;
  password: string;
};

export const Profile: FC = () => {
  const dispatch = useDispatch();
  /** DONE: взять переменную из стора */
  const user = useSelector((store) => store.user.data);

  const {
    values: formValue,
    handleChange,
    resetForm,
    isChanged
  } = useForm<FormState>({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    resetForm({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  }, []);

  const isFormChanged = isChanged({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue));
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    resetForm({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleChange}
    />
  );
};
