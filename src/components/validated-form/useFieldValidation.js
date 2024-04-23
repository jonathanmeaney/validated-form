import { useCallback } from "react";

const useFieldValidation = (inputValidate) => {
  const validate = useCallback(
    (value) => {
      if (!inputValidate) return undefined;

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
          /* istanbul ignore next */
          console.error(err);
          /* istanbul ignore next */
          return undefined;
        }
      }

      return undefined;
    },
    [inputValidate]
  );
  return validate;
};

export default useFieldValidation;
