import { useState } from "react";

type FormFields = {
  postCode: string;
  houseNumber: string;
  firstName: string;
  lastName: string;
  selectedAddress: string;
};

const useFormFields = (initialValues: FormFields) => {
  const [fields, setFields] = useState<FormFields>(initialValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const setField = <K extends keyof FormFields>(key: K, value: FormFields[K]) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const resetFields = () => setFields(initialValues);

  return {
    fields,
    handleChange,
    setField,
    resetFields,
  };
};

export default useFormFields;