import React, { useEffect, useCallback, useRef, memo } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

import { Field, useFormikContext } from "formik";

import Textbox from "carbon-react/lib/components/textbox";
import Textarea from "carbon-react/lib/components/textarea";
import { Checkbox, CheckboxGroup } from "carbon-react/lib/components/checkbox";
import Switch from "carbon-react/lib/components/switch";
import DateInput from "carbon-react/lib/components/date";
import Decimal from "carbon-react/lib/components/decimal";
import Number from "carbon-react/lib/components/number";
import NumeralDate from "carbon-react/lib/components/numeral-date";
import {
  RadioButton,
  RadioButtonGroup,
} from "carbon-react/lib/components/radio-button";
import { Select, Option } from "carbon-react/lib/components/select";

import { useValidatedForm } from "./validated-form-context";
import useFieldValidation from "./useFieldValidation";
import { getObjectValue, removeObjectField, hasKey, getValue } from "./utils";

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

const withFieldValidation = (Component) => {
  // Custom component to take a ref and apply it to the
  // component itself or to a div surrounding.
  const ComponentWithRef = ({ innerRef, ...props }) => {
    if (["RadioButtonGroup", "CheckboxGroup"].includes(Component.displayName)) {
      return (
        <div ref={innerRef}>
          <Component {...props} />
        </div>
      );
    }

    return <Component ref={innerRef} {...props} />;
  };

  const ValidatedComponent = ({ validate, ...otherProps }) => {
    const fieldProps = { ...otherProps };
    const inputRef = useRef(null);

    const { registerInputRef, deregisterInputRef } = useValidatedForm();
    // Generate the validate function for the Field using the validate passed
    // into the component directly (if present)
    const validateCallback = useFieldValidation(validate);
    const {
      touched,
      errors,
      values,
      setFieldValue,
      setFieldTouched,
      setValues,
    } = useFormikContext();
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

    // Checkbox type components need some additional fields set: checked and value
    const checkboxProps = ["Checkbox", "Switch"].includes(Component.displayName)
      ? { checked: values[fieldName], value: String(values[fieldName]) }
      : {};

    return (
      <Field
        validate={validateCallback}
        as={ComponentWithRef}
        innerRef={inputRef}
        value={fieldValue}
        {...fieldProps}
        {...checkboxProps}
        {...error}
        onChange={onChange}
        onBlur={onBlur}
      />
    );
  };

  ValidatedComponent.propTypes = {
    name: PropTypes.string.isRequired,
    validate: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  };

  return memo(ValidatedComponent, isEqual);
};

export const ValidatedTextbox = withFieldValidation(Textbox);
export const ValidatedTextarea = withFieldValidation(Textarea);
export const ValidatedCheckbox = withFieldValidation(Checkbox);
// TODO: Add support for CheckboxGroup
// export const ValidatedCheckboxGroup = withFieldValidation(CheckboxGroup);
export const ValidatedSwitch = withFieldValidation(Switch);
export const ValidatedDecimal = withFieldValidation(Decimal);
export const ValidatedNumber = withFieldValidation(Number);
export const ValidatedSelect = withFieldValidation(Select);
export { Option };
export const ValidatedDateInput = withFieldValidation(DateInput);
export const ValidatedNumeralDate = withFieldValidation(NumeralDate);
export { RadioButton };
export const ValidatedRadioButtonGroup = withFieldValidation(RadioButtonGroup);
