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
import {
  Select,
  Option as ValidatedOption,
} from "carbon-react/lib/components/select";

import { useValidatedForm } from "./validated-form-context";
import useFieldValidation from "./useFieldValidation";

const getObjectValue = (obj, path) => {
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
  const { setFieldValue, setFieldTouched, validateField, ...rest } =
    useFormikContext();
  // console.log(rest);
  const handleEvent = useCallback(
    (eventName, canValidate) => (e) => {
      setFieldValue(fieldName, getValue(e));
      setFieldTouched(fieldName, true);
      if (canValidate) {
        validateField(fieldName);
        fieldProps[eventName]?.(e, {
          validateField,
          setFieldValue,
          setFieldTouched,
        });
      }
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
      return <Component {...props} />;
    }

    return <Component ref={innerRef} {...props} />;
  };

  const ValidatedComponent = ({
    validate: validateFromInput,
    ...otherProps
  }) => {
    const fieldProps = { ...otherProps };
    const inputRef = useRef(null);

    const {
      registerInputRef,
      validateOnBlur,
      validateOnChange,
      validateOnSubmit,
    } = useValidatedForm();
    const [validate, validationProps] = useFieldValidation(validateFromInput);
    const { touched, errors, values } = useFormikContext();
    const fieldName = fieldProps.name;
    const fieldTouched = getObjectValue(touched, fieldName);
    const fieldError = getObjectValue(errors, fieldName);

    // Register the components inputRef with the context. Used to set focus
    // from the ValidationSummary.
    useEffect(() => {
      registerInputRef(fieldName, inputRef);
    }, [inputRef]);

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
        {...fieldProps}
        {...checkboxProps}
        validate={validate}
        as={ComponentWithRef}
        {...(fieldTouched && validationProps)}
        innerRef={inputRef}
        onChange={onChange}
        onBlur={onBlur}
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
export const ValidatedCheckboxGroup = withFieldValidation(CheckboxGroup);
export const ValidatedSwitch = withFieldValidation(Switch);
export const ValidatedDecimal = withFieldValidation(Decimal);
export const ValidatedNumber = withFieldValidation(Number);
export const ValidatedSelect = withFieldValidation(Select);
export { ValidatedOption };
export const ValidatedDateInput = withFieldValidation(DateInput);
export const ValidatedNumeralDate = withFieldValidation(NumeralDate);
export const ValidatedRadioButton = withFieldValidation(RadioButton);
export const ValidatedRadioButtonGroup = withFieldValidation(RadioButtonGroup);
