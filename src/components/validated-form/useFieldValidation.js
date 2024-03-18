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

export const useDateRangeValidation = (
  errorSchema,
  warningSchema,
  infoSchema
) => {
  const VALIDATION_OPTIONS = { abortEarly: false };
  const [props, setValidationProps] = useState({ startdate: {}, enddate: {} });
  const validate = useCallback(
    (value) => {
      let newProps = {
        startdate: {},
        enddate: {},
      };
      try {
        if (errorSchema) {
          errorSchema.validateSync(value, VALIDATION_OPTIONS);
        }
      } catch (e) {
        for (let err of e.inner) {
          let propsObject = newProps[err.path];
          propsObject.error = err.message;
        }
      }

      try {
        if (warningSchema) {
          warningSchema.validateSync(value, VALIDATION_OPTIONS);
        }
      } catch (e) {
        for (let err of e.inner) {
          let propsObject = newProps[err.path];
          if (!propsObject.error) {
            propsObject.warning = err.message;
          }
        }
      }

      try {
        if (infoSchema) {
          infoSchema.validateSync(value, VALIDATION_OPTIONS);
        }
      } catch (e) {
        for (let err of e.inner) {
          let propsObject = newProps[err.path];
          if (!propsObject.error && !propsObject.warning) {
            propsObject.info = err.message;
          }
        }
      }

      setValidationProps(newProps);

      return newProps.startdate.error || newProps.enddate.error;
    },
    [setValidationProps, errorSchema, warningSchema, infoSchema]
  );
  return [validate, props];
};
