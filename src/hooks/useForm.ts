import { useState, useCallback, ChangeEvent } from 'react';

type UseFormReturn<T> = {
  values: T;
  setValues: React.Dispatch<React.SetStateAction<T>>;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  resetForm: (newValues?: T) => void;
  isChanged: (compareValues: T) => boolean;
};

export function useForm<T extends Record<string, string>>(
  initialValues: T
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = useCallback(
    (newValues?: T) => {
      setValues(newValues ?? initialValues);
    },
    [initialValues]
  );

  const isChanged = (compareValues: T) =>
    Object.keys(values).some(
      (key) => values[key as keyof T] !== compareValues[key as keyof T]
    );

  return { values, setValues, handleChange, resetForm, isChanged };
}
