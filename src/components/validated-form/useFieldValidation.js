import { useCallback, useState } from "react";

const useFieldValidation = (errorSchema) => {
  const [validationProps, setValidationProps] = useState({});
  const validate = useCallback(
    (value) => {
      try {
        if (errorSchema) {
          errorSchema.validateSync(value);
        }
      } catch (err) {
        setValidationProps({ error: err.message });
        return err.message;
      }

      setValidationProps({});
    },
    [setValidationProps, errorSchema]
  );
  return [validate, validationProps];
};

export default useFieldValidation;
