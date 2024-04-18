import { useCallback } from "react";

const useFieldValidation = (inputValidate) => {
  const validate = useCallback(
    (value) => {
      if (!inputValidate) return;

      if (inputValidate.validateSync) {
        try {
          inputValidate.validateSync(value);
        } catch (err) {
          return err.message;
        }
      } else {
        try {
          return inputValidate(value);
        } catch (err) {
          console.error(err);
          return;
        }
      }
    },
    [inputValidate]
  );
  return validate;
};

export default useFieldValidation;
