import React, { memo } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

import { useFormikContext } from "formik";

import Textbox from "carbon-react/lib/components/textbox";
import Textarea from "carbon-react/lib/components/textarea";
import { Checkbox } from "carbon-react/lib/components/checkbox";
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
import Password from "carbon-react/lib/components/password";

import useValidatedField from "./useValidatedField";

// Modified components to handle a ref
/* istanbul ignore next */
const TextboxWithRef = ({ innerRef, ...props }) => {
  return <Textbox ref={innerRef} {...props} />;
};

TextboxWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
};

/* istanbul ignore next */
const TextareaWithRef = ({ innerRef, ...props }) => {
  return <Textarea ref={innerRef} {...props} />;
};

TextareaWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
};

/* istanbul ignore next */
const DecimalWithRef = ({ innerRef, ...props }) => {
  return <Decimal ref={innerRef} {...props} />;
};

DecimalWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
};

/* istanbul ignore next */
const NumberWithRef = ({ innerRef, ...props }) => {
  return <Number ref={innerRef} {...props} />;
};

NumberWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
};

/* istanbul ignore next */
const PasswordWithRef = ({ innerRef, ...props }) => {
  return <Password ref={innerRef} {...props} />;
};

PasswordWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
};

/* istanbul ignore next */
const CheckboxWithRef = ({ innerRef, ...props }) => {
  const { values } = useFormikContext();
  const checkboxProps = {
    checked: values[props.name],
    value: String(values[props.name]),
  };

  return <Checkbox ref={innerRef} {...props} {...checkboxProps} />;
};

CheckboxWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
  name: PropTypes.string,
};

/* istanbul ignore next */
const SwitchWithRef = ({ innerRef, ...props }) => {
  const { values } = useFormikContext();
  const switchProps = {
    checked: values[props.name],
    value: String(values[props.name]),
  };

  return <Switch ref={innerRef} {...props} {...switchProps} />;
};

SwitchWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
  name: PropTypes.string,
};

/* istanbul ignore next */
const RadioButtonGroupWithRef = ({ innerRef, children, ...props }) => {
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (index === 0) {
      return React.cloneElement(child, { ref: innerRef });
    }
    return child;
  });
  return <RadioButtonGroup {...props}>{enhancedChildren}</RadioButtonGroup>;
};

RadioButtonGroupWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
  children: PropTypes.node,
};

/* istanbul ignore next */
const SelectWithRef = ({ innerRef, ...props }) => {
  return <Select ref={innerRef} {...props} />;
};

SelectWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
};

/* istanbul ignore next */
const DateInputWithRef = ({ innerRef, ...props }) => {
  return <DateInput ref={innerRef} {...props} />;
};

DateInputWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
};

/* istanbul ignore next */
const NumeralDateWithRef = ({ innerRef, ...props }) => {
  const { values } = useFormikContext();
  const value = values[props.name] || {};
  let dayRef, monthRef, yearRef;

  if (!value.dd) {
    dayRef = innerRef;
  } else if (!value.mm) {
    monthRef = innerRef;
  } else if (!value.yyyy) {
    yearRef = innerRef;
  }

  return (
    <NumeralDate
      {...props}
      dayRef={dayRef}
      monthRef={monthRef}
      yearRef={yearRef}
    />
  );
};

NumeralDateWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
  name: PropTypes.string,
};

// Factory function for creating HOCs with validation
const withFieldValidation = (ComponentWithRef) => {
  const ValidatedComponent = (props) => {
    return useValidatedField(ComponentWithRef, props);
  };

  ValidatedComponent.propTypes = {
    name: PropTypes.string.isRequired,
    validate: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  };
  return memo(ValidatedComponent, isEqual);
};

export const ValidatedTextbox = withFieldValidation(TextboxWithRef);
export const ValidatedTextarea = withFieldValidation(TextareaWithRef);
export const ValidatedPassword = withFieldValidation(PasswordWithRef);
export const ValidatedCheckbox = withFieldValidation(CheckboxWithRef);
// TODO: Add support for CheckboxGroup
// export const ValidatedCheckboxGroup = withFieldValidation(CheckboxGroup);
export const ValidatedSwitch = withFieldValidation(SwitchWithRef);
export const ValidatedDecimal = withFieldValidation(DecimalWithRef);
export const ValidatedNumber = withFieldValidation(NumberWithRef);
export const ValidatedSelect = withFieldValidation(SelectWithRef);
export { Option };
export const ValidatedDateInput = withFieldValidation(DateInputWithRef);
export const ValidatedNumeralDate = withFieldValidation(NumeralDateWithRef);
export { RadioButton };
export const ValidatedRadioButtonGroup = withFieldValidation(
  RadioButtonGroupWithRef
);
