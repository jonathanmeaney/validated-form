import React, { useEffect, useCallback, useRef, memo } from "react";
import PropTypes from "prop-types";
import { isEqual, isEmpty, cloneDeep } from "lodash";

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

// Get the value from the object using dot notation e.g. 'a.b.c.d'
const getObjectValue = (obj, path) => {
  if (!path) {
    return undefined;
  }

  const parts = path.split(".");
  let current = obj;

  for (let part of parts) {
    if (current[part] === undefined) {
      return undefined;
    }
    current = current[part];
  }

  return current;
};

const setObjectValue = (obj, path, value) => {
  if (!path) {
    return undefined;
  }

  const parts = path.split(".");
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined) {
      current[part] = {};
    }
    current = current[part];
  }

  // Set the value to the last part of the path
  current[parts[parts.length - 1]] = value;
};

const removeObjectField = (obj, path) => {
  if (!path) {
    return obj;
  }

  const parts = path.split(".");
  const newObj = cloneDeep(obj);
  let current = newObj;

  // Navigate to the second to last part of the path
  for (let i = 0; i < parts.length - 1; i++) {
    let part = parts[i];
    if (current[part] === undefined) {
      return obj; // Return the original object if the path is invalid
    }
    // Make a shallow copy at each level
    current[part] = { ...current[part] };
    current = current[part];
  }

  // Delete the last part of the path if it exists
  const lastPart = parts[parts.length - 1];
  if (current[lastPart] !== undefined) {
    delete current[lastPart];
  }

  return newObj;
};

// Check if the path is present in the object
const hasKey = (obj, path) => {
  if (!path) {
    return false;
  }

  const parts = path.split(".");
  let current = obj;

  for (let part of parts) {
    if (current[part] === undefined) {
      return false;
    }
    current = current[part];
  }

  return true;
};

const omit = (obj, keyToOmit) => {
  const { [keyToOmit]: _, ...rest } = obj;
  return rest;
};

const getValue = ({ target: { value, type, checked } }) =>
  type === "checkbox"
    ? checked
    : value.formattedValue !== undefined
      ? value.formattedValue
      : value;

const useFieldHandlers = (
  fieldName,
  canValidateOnBlur,
  canValidateOnChange,
  fieldProps,
) => {
  const { setFieldValue, setFieldTouched, validateField } = useFormikContext();

  const handleEvent = useCallback(
    (eventName, canValidate) => (e) => {
      setFieldValue(fieldName, getValue(e));

      if (eventName === "onBlur") {
        setFieldTouched(fieldName, true);
      }

      if (canValidate) {
        validateField(fieldName);
      }

      fieldProps[eventName]?.(e, {
        validateField,
        setFieldValue,
        setFieldTouched,
      });
    },
    [fieldName, setFieldValue, setFieldTouched, validateField, fieldProps],
  );

  return {
    onChange: handleEvent("onChange", canValidateOnChange),
    onBlur: handleEvent("onBlur", canValidateOnBlur),
  };
};

const withFieldValidation = (Component) => {
  const ComponentWithRef = ({ innerRef, ...props }) => {
    if ([RadioButtonGroup, CheckboxGroup].includes(Component)) {
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

    const {
      registerInputRef,
      deregisterInputRef,
      validateOnBlur,
      validateOnChange,
      validateOnSubmit,
    } = useValidatedForm();
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
      setErrors,
      setTouched,
      validateField,
    } = useFormikContext();
    const fieldName = fieldProps.name;
    const fieldTouched = getObjectValue(touched, fieldName);
    const fieldError = getObjectValue(errors, fieldName);
    const fieldValue = getObjectValue(values, fieldName) || "";
    const error = fieldTouched && fieldError ? { error: fieldError } : {};

    // Register the components inputRef with the context. Used to set focus
    // from the ValidationSummary.
    useEffect(() => {
      if (fieldName) {
        registerInputRef(fieldName, inputRef);
      }

      // When unmounting deregister
      return () => {
        deregisterInputRef(fieldName);
      };
    }, [inputRef]);

    useEffect(() => {
      console.log("useeffect umounting");
      console.log({ values, touched, errors });
      if (!hasKey(values, fieldName)) setFieldValue(fieldName, fieldValue);

      // When unmounting deregister
      return () => {
        console.log("useeffect unmounting");
        console.log({ values, touched, errors });
        const updatedValues = removeObjectField(values, fieldName);
        setValues(updatedValues);

        const updatedErrors = removeObjectField(errors, fieldName);
        setErrors(updatedErrors);

        const updatedTouched = removeObjectField(touched, fieldName);
        setObjectValue(updatedTouched);
      };
    }, []);

    // Determine if and when you should be able to validate or revalidate a field
    const canValidateOnBlur =
      validateOnBlur && (!validateOnSubmit || (validateOnSubmit && fieldError));
    const canValidateOnChange =
      validateOnChange &&
      (!validateOnSubmit || (validateOnSubmit && fieldError));

    // Define the onChange and onBlur event handlers for the field
    const { onChange, onBlur } = useFieldHandlers(
      fieldName,
      canValidateOnBlur,
      canValidateOnChange,
      fieldProps,
    );

    // Checkbox type components need some additional fields set: checked and value
    const checkboxProps = [Checkbox, Switch].includes(Component)
      ? { checked: values[fieldName], value: String(values[fieldName]) }
      : {};

    return (
      <Field
        validate={validateCallback}
        as={ComponentWithRef}
        innerRef={inputRef}
        value={fieldValue}
        onChange={onChange}
        onBlur={onBlur}
        {...fieldProps}
        {...checkboxProps}
        {...error}
      />
    );
  };

  ValidatedComponent.propTypes = {
    name: PropTypes.string.isRequired,
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
