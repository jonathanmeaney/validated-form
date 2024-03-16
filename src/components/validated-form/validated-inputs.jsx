import React, { useEffect } from "react";
import PropTypes from "prop-types";
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
import { Select } from "carbon-react/lib/components/select";

import useFieldValidation from "./useFieldValidation";

const withValidation = (Component) => {
  const ValidatedComponent = ({
    errorSchema,
    warningSchema,
    infoSchema,
    ...otherProps
  }) => {
    let fieldProps = { ...otherProps };
    const [validate, validationProps] = useFieldValidation({
      errorSchema,
      warningSchema,
      infoSchema,
    });
    const { touched, values } = useFormikContext();

    if (Component === Checkbox) {
      fieldProps.checked = values[fieldProps.name];
    }
    console.log({ validationProps });
    return (
      <Field
        {...fieldProps}
        validate={validate}
        as={Component}
        {...(touched[name] && validationProps)}
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

export const ValidatedTextbox = withValidation(Textbox);
export const ValidatedTextarea = withValidation(Textarea);
export const ValidatedCheckbox = withValidation(Checkbox);
export const ValidatedDecimal = withValidation(Decimal);
export const ValidatedNumber = withValidation(Number);
export const ValidatedSelect = withValidation(Select);
