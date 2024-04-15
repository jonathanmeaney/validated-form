import React, { useEffect, useRef } from "react";
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

const getValue = (e) => {
  const { value, type, checked } = e.target;

  let finalValue = value.formattedValue ? value.formattedValue : value;
  if (type === "checkbox") {
    finalValue = checked;
  }

  return finalValue;
};

const withFieldValidation = (Component) => {
  const ComponentWithRef = ({ innerRef, ...props }) => (
    <Component ref={innerRef} {...props} />
  );

  const ValidatedComponent = ({ errorSchema, ...otherProps }) => {
    const fieldProps = { ...otherProps };
    const inputRef = useRef(null);

    const {
      registerInputRef,
      validateOnBlur,
      validateOnChange,
      validateOnSubmit,
    } = useValidatedForm();
    const [validate, validationProps] = useFieldValidation(errorSchema);
    const { touched, values, setFieldValue, setFieldTouched, validateField } =
      useFormikContext();
    const fieldName = fieldProps.name;
    const fieldTouched = getObjectValue(touched, fieldName);

    useEffect(() => {
      registerInputRef(fieldName, inputRef);
    }, [inputRef]);

    if (Component === Checkbox || Component === Switch) {
      const value = values[fieldName];
      fieldProps.checked = value;
      fieldProps.value = String(value);
    }

    const canValidateOnBlur =
      (validateOnSubmit && fieldTouched) || validateOnBlur;
    const canValidateOnChange =
      (validateOnSubmit && fieldTouched) || validateOnChange;

    const formikOnChange = (e) => {
      setFieldValue(fieldName, getValue(e));

      if (canValidateOnChange) {
        // Call the incoming onChange function if specified on the component.
        const { onChange } = { ...fieldProps };
        if (onChange) {
          onChange(e);
        }
      }
    };

    const formikOnBlur = (e) => {
      setFieldValue(fieldName, getValue(e));
      setFieldTouched(fieldName);

      if (canValidateOnBlur) {
        validateField(fieldName);

        // Call the incoming onBlur function if specified on the component.
        const { onBlur } = { ...fieldProps };
        if (onBlur) {
          onBlur(e);
        }
      }
    };

    if (validate)
      return (
        <Field
          {...fieldProps}
          validate={validate}
          as={ComponentWithRef}
          {...(fieldTouched && validationProps)}
          innerRef={inputRef}
          onChange={formikOnChange}
          onBlur={formikOnBlur}
        />
      );
  };

  ValidatedComponent.propTypes = {
    name: PropTypes.string.isRequired,
    errorSchema: PropTypes.object,
  };

  return ValidatedComponent;
};

const areEqual = (prevProps, nextProps) => {
  // Using Lodash isEqual to perform the comparison.
  // https://lodash.com/docs/4.17.15#isEqual
  return isEqual(prevProps, nextProps);
};

export const ValidatedTextbox = React.memo(
  withFieldValidation(Textbox),
  areEqual
);
export const ValidatedTextarea = React.memo(
  withFieldValidation(Textarea),
  areEqual
);
export const ValidatedCheckbox = React.memo(
  withFieldValidation(Checkbox),
  areEqual
);
export const ValidatedCheckboxGroup = React.memo(
  withFieldValidation(CheckboxGroup),
  areEqual
);
export const ValidatedSwitch = React.memo(
  withFieldValidation(Switch),
  areEqual
);
export const ValidatedDecimal = React.memo(
  withFieldValidation(Decimal),
  areEqual
);
export const ValidatedNumber = React.memo(
  withFieldValidation(Number),
  areEqual
);
export const ValidatedSelect = React.memo(
  withFieldValidation(Select),
  areEqual
);
export { ValidatedOption };
export const ValidatedDateInput = React.memo(
  withFieldValidation(DateInput),
  areEqual
);
export const ValidatedNumeralDate = React.memo(
  withFieldValidation(NumeralDate),
  areEqual
);
export const ValidatedRadioButton = React.memo(
  withFieldValidation(RadioButton),
  areEqual
);
export const ValidatedRadioButtonGroup = React.memo(
  withFieldValidation(RadioButtonGroup),
  areEqual
);
