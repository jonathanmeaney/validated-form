import React, { useEffect, useRef } from "react";

import { Field, useFormikContext } from "formik";

import { useValidatedForm } from "./validated-form-context";
import useFieldValidation from "./useFieldValidation";
import useFieldEventHandlers from "./useFieldEventHandlers";
import { getObjectValue, removeObjectField, hasKey } from "./utils";

const useValidatedField = (Component, { validate, ...otherProps }) => {
  const fieldProps = { ...otherProps };
  const inputRef = useRef(null);

  const { registerInputRef, deregisterInputRef } = useValidatedForm();
  // Generate the validate function for the Field using the validate passed
  // into the component directly (if present)
  const validateCallback = useFieldValidation(validate);
  const { touched, errors, values, setFieldValue, setFieldTouched, setValues } =
    useFormikContext();
  const { name: fieldName } = fieldProps;
  const fieldTouched = getObjectValue(touched, fieldName);
  const fieldError = getObjectValue(errors, fieldName);
  const fieldValue = getObjectValue(values, fieldName) || "";
  const error = fieldTouched && fieldError ? { error: fieldError } : {};

  // Register the components inputRef with the context. Used to set focus
  // from the ValidationSummary.
  useEffect(() => {
    if (fieldName) {
      registerInputRef(fieldName, inputRef);
      if (!hasKey(values, fieldName)) setFieldValue(fieldName, fieldValue);
    }

    // When unmounting deregister
    return () => {
      deregisterInputRef(fieldName);
      setValues((prev) => removeObjectField(prev, fieldName));
      setFieldTouched(fieldName, false);
    };
  }, [inputRef]);

  // Define the onChange and onBlur event handlers for the field
  const { onChange, onBlur } = useFieldEventHandlers(
    fieldName,
    fieldProps,
    fieldError
  );

  return (
    <Field
      validate={validateCallback}
      as={Component}
      innerRef={inputRef}
      value={fieldValue}
      {...fieldProps}
      {...error}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

export default useValidatedField;
