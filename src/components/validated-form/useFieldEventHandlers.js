import { useCallback } from "react";
import { useValidatedForm } from "./validated-form-context";
import { useFormikContext } from "formik";
import { getValue } from "./utils";

// Custom Hook to generate event handlers for the validated Field
const useFieldEventHandlers = (fieldName, fieldProps, fieldError) => {
  const {
    validateOnBlur,
    validateOnChange,
    validateOnSubmit,
    hasValidationSchema,
    hasValidate,
  } = useValidatedForm();
  const { setFieldValue, setFieldTouched, validateField, validateForm } =
    useFormikContext();

  // Determine if and when you should be able to validate or revalidate a field
  const canValidateOnBlur =
    validateOnBlur &&
    (!validateOnSubmit || (validateOnSubmit && fieldError !== undefined));
  const canValidateOnChange =
    validateOnChange &&
    (!validateOnSubmit || (validateOnSubmit && fieldError !== undefined));

  const handleEvent = useCallback(
    (eventName, canValidate) => async (e) => {
      await setFieldValue(fieldName, getValue(e));

      if (eventName === "onBlur") {
        await setFieldTouched(fieldName, true);
      }

      if (canValidate) {
        // If the form has a validationSchema or a validate prop
        // the the form  has no per input validation, validate the form
        // to trigger field revalidation. Otherwise trigger field validation.
        if (hasValidationSchema || hasValidate) {
          await validateForm();
        } else {
          await validateField(fieldName);
        }
      }

      // If given a custom onChange or onBlur event then call it
      // now passing in e and formik methods for field validations
      fieldProps[eventName]?.(e, {
        validateForm,
        validateField,
        setFieldValue,
        setFieldTouched,
      });
    },
    [fieldName, setFieldValue, setFieldTouched, validateField, fieldProps]
  );

  return {
    onChange: handleEvent("onChange", canValidateOnChange),
    onBlur: handleEvent("onBlur", canValidateOnBlur),
  };
};

export default useFieldEventHandlers;
