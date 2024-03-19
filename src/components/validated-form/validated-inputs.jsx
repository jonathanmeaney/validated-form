import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { Field, useFormikContext } from "formik";

import Textbox from "carbon-react/lib/components/textbox";
import Textarea from "carbon-react/lib/components/textarea";
import { Checkbox, CheckboxGroup } from "carbon-react/lib/components/checkbox";
import DateRange from "carbon-react/lib/components/date-range";
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

const withFieldValidation = (Component) => {
  const ValidatedComponent = ({
    errorSchema,
    warningSchema,
    infoSchema,
    ...otherProps
  }) => {
    const fieldProps = { ...otherProps };
    const { resetValidationProps, updateValidationProps } = useValidatedForm();
    const [validate, validationProps] = useFieldValidation(
      errorSchema,
      warningSchema,
      infoSchema,
    );
    const { touched, values } = useFormikContext();
    const fieldTouched = touched[fieldProps.name];

    useEffect(() => {
      if (fieldTouched) {
        if (!isEmpty(validationProps)) {
          updateValidationProps(fieldProps.name, validationProps);
        } else {
          resetValidationProps(fieldProps.name);
        }
      }
    }, [
      fieldProps.name,
      fieldTouched,
      resetValidationProps,
      updateValidationProps,
      validationProps,
    ]);

    if (Component === Checkbox) {
      const value = values[fieldProps.name];
      fieldProps.checked = value;
      fieldProps.value = String(value);
    }

    return (
      <Field
        {...fieldProps}
        validate={validate}
        as={Component}
        {...(fieldTouched && validationProps)}
      />
    );
  };

  ValidatedComponent.propTypes = {
    ...Component.propTypes,
    name: PropTypes.string.isRequired,
    errorSchema: PropTypes.object,
    warningSchema: PropTypes.object,
    infoSchema: PropTypes.object,
  };

  return ValidatedComponent;
};

import { isEqual } from "lodash";

const areEqual = (prevProps, nextProps) => {
  // Using Lodash isEqual to perform the comparison.
  // https://lodash.com/docs/4.17.15#isEqual
  return isEqual(prevProps, nextProps);
};

export const ValidatedTextbox = React.memo(
  withFieldValidation(Textbox),
  areEqual,
);
export const ValidatedTextarea = React.memo(
  withFieldValidation(Textarea),
  areEqual,
);
export const ValidatedCheckbox = React.memo(
  withFieldValidation(Checkbox),
  areEqual,
);
export const ValidatedCheckboxGroup = React.memo(
  withFieldValidation(CheckboxGroup),
  areEqual,
);
export const ValidatedDecimal = React.memo(
  withFieldValidation(Decimal),
  areEqual,
);
export const ValidatedNumber = React.memo(
  withFieldValidation(Number),
  areEqual,
);
export const ValidatedSelect = React.memo(
  withFieldValidation(Select),
  areEqual,
);
export { ValidatedOption };
export const ValidatedDateInput = React.memo(
  withFieldValidation(DateInput),
  areEqual,
);
export const ValidatedNumeralDate = React.memo(
  withFieldValidation(NumeralDate),
  areEqual,
);
export const ValidatedRadioButton = React.memo(
  withFieldValidation(RadioButton),
  areEqual,
);
export const ValidatedRadioButtonGroup = React.memo(
  withFieldValidation(RadioButtonGroup),
  areEqual,
);
