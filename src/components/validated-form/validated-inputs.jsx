import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

import { Field, useFormikContext } from "formik";

import Textbox from "carbon-react/lib/components/textbox";
import Textarea from "carbon-react/lib/components/textarea";
import { Checkbox, CheckboxGroup } from "carbon-react/lib/components/checkbox";
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

const withFieldValidation = (Component) => {
  const ComponentWithRef = ({ innerRef, ...props }) => (
    <Component ref={innerRef} {...props} />
  );

  const ValidatedComponent = ({ errorSchema, ...otherProps }) => {
    const fieldProps = { ...otherProps };
    const inputRef = useRef(null);

    const { registerInputRef } = useValidatedForm();
    const [validate, validationProps] = useFieldValidation(errorSchema);
    const { touched, values, setFieldValue } = useFormikContext();
    const fieldName = fieldProps.name;
    const fieldTouched = getObjectValue(touched, fieldName);

    useEffect(() => {
      registerInputRef(fieldName, inputRef);
    }, [inputRef]);

    if (Component === Checkbox) {
      const value = values[fieldName];
      fieldProps.checked = value;
      fieldProps.value = String(value);
    }

    if (Component === DateInput) {
      const originalOnChange = fieldProps.onChange;
      const onChange = (e) => {
        setFieldValue(fieldName, e.target.value.formattedValue);
        if (originalOnChange) {
          originalOnChange();
        }
      };
      fieldProps.onChange = onChange;
    }

    return (
      <Field
        {...fieldProps}
        validate={validate}
        as={ComponentWithRef}
        {...(fieldTouched && validationProps)}
        innerRef={inputRef}
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
