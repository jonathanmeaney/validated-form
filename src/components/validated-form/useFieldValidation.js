import { useCallback, useState } from "react";

const useFieldValidation = (validateFunction) => {
  const [validationProps, setValidationProps] = useState({});
  const validate = useCallback(
    (value) => {
      if (validateFunction) {
        if (validateFunction.validateSync) {
          try {
            validateFunction.validateSync(value);
          } catch (err) {
            setValidationProps({ error: err.message });
            return err.message;
          }
          setValidationProps({});
        } else {
          const result = validateFunction(value);
          console.log("vallated", result);
          if (result) {
            setValidationProps({ error: result });
            return result;
          }
        }
      }
    },
    [setValidationProps, validateFunction],
  );
  return [validate, validationProps];
};

export default useFieldValidation;
