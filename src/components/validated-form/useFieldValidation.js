import { useCallback, useState } from "react";

const useFieldValidation = (errorSchema, warningSchema, infoSchema) => {
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

      try {
        if (warningSchema) {
          warningSchema.validateSync(value);
        }
      } catch (err) {
        setValidationProps({ warning: err.message });
        return;
      }

      try {
        if (infoSchema) {
          infoSchema.validateSync(value);
        }
      } catch (err) {
        setValidationProps({ info: err.message });
        return;
      }

      setValidationProps({});
    },
    [setValidationProps, errorSchema, warningSchema, infoSchema]
  );
  return [validate, validationProps];
};

export default useFieldValidation;
