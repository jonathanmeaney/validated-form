import React, { memo } from "react";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

import { useFormikContext } from "formik";

import CarbonTextbox from "carbon-react/lib/components/textbox";
import CarbonTextarea from "carbon-react/lib/components/textarea";
import { Checkbox as CarbonCheckbox } from "carbon-react/lib/components/checkbox";
import CarbonSwitch from "carbon-react/lib/components/switch";
import CarbonDateInput from "carbon-react/lib/components/date";
import CarbonDecimal from "carbon-react/lib/components/decimal";
import CarbonNumber from "carbon-react/lib/components/number";
import CarbonNumeralDate from "carbon-react/lib/components/numeral-date";
import {
  RadioButton,
  RadioButtonGroup as CarbonRadioButtonGroup,
} from "carbon-react/lib/components/radio-button";
import {
  Select as CarbonSelect,
  Option,
} from "carbon-react/lib/components/select";
import CarbonPassword from "carbon-react/lib/components/password";

import useValidatedField from "./useValidatedField";
import useField from "./useField";

// Modified components to handle a ref
/* istanbul ignore next */
const TextboxWithRef = ({ innerRef, ...props }) => {
  return <CarbonTextbox ref={innerRef} {...props} />;
};

TextboxWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
};

/* istanbul ignore next */
const TextareaWithRef = ({ innerRef, ...props }) => {
  return <CarbonTextarea ref={innerRef} {...props} />;
};

TextareaWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
};

/* istanbul ignore next */
const DecimalWithRef = ({ innerRef, ...props }) => {
  return <CarbonDecimal ref={innerRef} {...props} />;
};

DecimalWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
};

/* istanbul ignore next */
const NumberWithRef = ({ innerRef, ...props }) => {
  return <CarbonNumber ref={innerRef} {...props} />;
};

NumberWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
};

/* istanbul ignore next */
const PasswordWithRef = ({ innerRef, ...props }) => {
  return <CarbonPassword ref={innerRef} {...props} />;
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

  return <CarbonCheckbox ref={innerRef} {...props} {...checkboxProps} />;
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

  return <CarbonSwitch ref={innerRef} {...props} {...switchProps} />;
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
  return (
    <CarbonRadioButtonGroup {...props}>
      {enhancedChildren}
    </CarbonRadioButtonGroup>
  );
};

RadioButtonGroupWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
  children: PropTypes.node,
};

/* istanbul ignore next */
const SelectWithRef = ({ innerRef, ...props }) => {
  return <CarbonSelect ref={innerRef} {...props} />;
};

SelectWithRef.propTypes = {
  innerRef: PropTypes.shape({ current: PropTypes.any }),
};

/* istanbul ignore next */
const DateInputWithRef = ({ innerRef, ...props }) => {
  return <CarbonDateInput ref={innerRef} {...props} />;
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
    <CarbonNumeralDate
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

// Factory function for creating HOCs without validation
// but still compatible with Formik.
const withField = (Component) => {
  const ValidatedComponent = (props) => {
    return useField(Component, props);
  };

  ValidatedComponent.propTypes = {
    name: PropTypes.string.isRequired,
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

export const Textbox = withField(CarbonTextbox);
export const Textarea = withField(CarbonTextarea);
export const Password = withField(CarbonPassword);
export const Checkbox = withField(CarbonCheckbox);
export const Switch = withField(CarbonSwitch);
export const Decimal = withField(CarbonDecimal);
export const Number = withField(CarbonNumber);
export const Select = withField(CarbonSelect);
export const DateInput = withField(CarbonDateInput);
export const NumeralDate = withField(CarbonNumeralDate);
export const RadioButtonGroup = withField(CarbonRadioButtonGroup);
