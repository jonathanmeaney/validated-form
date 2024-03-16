import { useCallback, useState } from "react";

const useFieldValidation = (errorSchema, warningSchema, infoSchema) => {
  const [props, setProps] = useState({});
  const validate = useCallback(
    (value) => {
      console.log("validating", value);
      try {
        if (errorSchema) {
          errorSchema.validateSync(value);
        }
      } catch (err) {
        setProps({ error: err.message });
        return err.message;
      }

      try {
        if (warningSchema) {
          warningSchema.validateSync(value);
        }
      } catch (err) {
        setProps({ warning: err.message });
        return;
      }

      try {
        if (infoSchema) {
          infoSchema.validateSync(value);
        }
      } catch (err) {
        setProps({ info: err.message });
        return;
      }

      setProps({});
    },
    [setProps, errorSchema, warningSchema, infoSchema],
  );
  return [validate, props];
};

export default useFieldValidation;

export const useDateRangeValidation = (
  errorSchema,
  warningSchema,
  infoSchema,
) => {
  const VALIDATION_OPTIONS = { abortEarly: false };
  const [props, setProps] = useState({ startdate: {}, enddate: {} });
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

      setProps(newProps);

      return newProps.startdate.error || newProps.enddate.error;
    },
    [setProps, errorSchema, warningSchema, infoSchema],
  );
  return [validate, props];
};
