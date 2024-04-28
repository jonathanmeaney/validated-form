# Overview

The `ValidatedForm` component is a new and improved version of the `Form` component. The underlying approach is still using [Formik](https://formik.org/docs/overview) to handle form state and validation.

## Improvements

- No more recursion and cloning to replace children with validation adapted inputs.
- Improved performance.
- Allow direct use of Yup schema functions, per input or per form.
- Allows use of standard Javascript validation functions, per input or per form.
- Allows inputs in nested components to be validated without the need for additional changes.
- Provides a `withSummary` prop to display a validation summary upon submitting the form. The validation summary contains the errors from the form each of which link to and focus the corresponding input when clicked.
- Provides validated form components to use when you need an input to be validated.
- All imports from one location.

## ValidatedForm

### Props

| Prop               | Type   | Required | Default | Description                                                                                                                                                                                                                                                                                                                                   |
| ------------------ | ------ | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| initialValues      | object | Yes      | -       | initialValues is a required object that has a key value pair for each input that supports validation. The key must equal the name of the input. The initialValues object supports subjects with the corresponding name on the input using dot notation. For example: `{ firstName: '', lastName: '', address: { addressOne: '', city: '' } }` |
| enableReinitialize | bool   | No       | false   | when set to true then Formik will reset the form's values and errors whenever the initialValues object changes.                                                                                                                                                                                                                               |
| onSubmit           | func   | Yes      | -       | The required onSumit function is called when the the form is submitted and the form validates successfully. The values from the form which match the initialObject are passed into this function.                                                                                                                                             |
| children           | node   | Yes      | -       | The children are required. Any input that is to be validated by the form should be a child whether direct or indirect (through a nested component).                                                                                                                                                                                           |
| validationSchema   | object | No       | -       | A Yup validation schema can be provided which defines validation for each input in the form. This can be used instead of per input validations.                                                                                                                                                                                               |
| validateOnChange   | bool   | No       | true    | One of Formiks props. By default set to true.                                                                                                                                                                                                                                                                                                 |
| validateOnBlur     | bool   | No       | true    | One of Formiks props. By default set to true.                                                                                                                                                                                                                                                                                                 |
| validateOnMount    | bool   | No       | false   | One of Formiks props. By default set to false.                                                                                                                                                                                                                                                                                                |
| validateOnSubmit   | bool   | No       | false   | If validateOnSubmit is true then validateOnChange and validateOnBlur will be automatically set to false. This allows for validations to only occur after submitting the form, not before. After submitting then validation errors will be displayed and any input in error will support re-validation.                                        |
| validate           | func   | No       | -       | Similar to the validationSchema this is a Javascript function that defines Javascript validation for each input in the form. This can be used instead of per input validations.                                                                                                                                                               |
| withSummary        | bool   | No       | false   | The withSummary prop determines whether to show the validation summary after submitting the form. If the form contains errors then the validation summary will show. The summary lists all of the errors in the form in a list. Clicking any of the errors will scroll to that field in the form and focus the input.                         |
| summaryTitle       | string | No       | -       | The title message displayed on the validation summary is customisable. The default title is 'There are %{count} errors'                                                                                                                                                                                                                       |

## Validated components

Currently these are the supported validated components. If you want to add validation to one of these components then import the validated version from the `validated-form` component and use them in your form.

| Component          | Validated variant           |
| ------------------ | --------------------------- |
| `Textbox`          | `ValidatedTextbox`          |
| `Textarea`         | `ValidatedTextarea`         |
| `Checkbox`         | `ValidatedCheckbox`         |
| `Switch`           | `ValidatedSwitch`           |
| `Decimal`          | `ValidatedDecimal`          |
| `Number`           | `ValidatedNumber`           |
| `Select`           | `ValidatedSelect`           |
| `DateInput`        | `ValidatedDateInput`        |
| `NumeralDate`      | `ValidatedNumeralDate`      |
| `RadioButtonGroup` | `ValidatedRadioButtonGroup` |

## Props

| Prop     | Type               | Required | Default | Description                                                                                                           |
| -------- | ------------------ | -------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| name     | string             | yes      | -       | Every validated compoment needs to have a unique name. The name must correspond to a key value pair in InitialValues. |
| validate | schema or function | no       | -       | The validate prop specifes the schema or function to use to validate the value of the input.                          |

> Note: Any other props available to the standard unvalidated component are also applicable to the validated component.

### Other exported components

For convenience to use with the above validated variants the following are also exported for use.

- `Option`
- `RadioButton`

### TODO

The following validated variants still need to be created.

- `ValidatedCheckboxGroup`

# Examples

`ValidatedForm` is the default export and any additional validated variants are imported as named imports. For example:

```javascript
import ValidatedForm, {
  ValidatedTextbox,
  ValidatedTextarea,
} from "components/validated-form";
```

## Examples Using [Yup](https://github.com/jquense/yup) validations

The [Yup](https://github.com/jquense/yup) documentation is details all of the options available for use. Build up your desired schema for the input.

### Per input validations

Each validated variant component accepts a `validate` prop. The `validate` prop is the `Yup` schema to use to validate the input value with.

The example below uses individual `validate` props for each validated component using `Yup`.

```javascript
import React from "react";
import * as Yup from "yup";
import Button from "carbon-react/lib/components/button";
import ValidatedForm, { ValidatedTextbox } from "components/validated-form";

const YupPerInput = () => {
  const handleSubmit = (values) => {
    console.log("Submitting", values);
  };

  return (
    <ValidatedForm
      leftSideButtons={<Button buttonType="tertiary">Cancel</Button>}
      saveButton={
        <Button buttonType="primary" type="submit">
          Save
        </Button>
      }
      onSubmit={handleSubmit}
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
      }}
    >
      <ValidatedTextbox
        label="First Name"
        name="firstName"
        validate={Yup.string().required("First Name is required")}
        required
      />
      <ValidatedTextbox
        label="Last Name"
        name="lastName"
        validate={Yup.string().required("Last Name is required")}
        required
      />
      <ValidatedTextbox
        label="Email"
        name="email"
        required
        validate={Yup.string()
          .email("Enter a valid email")
          .required("Email is required")}
      />
    </ValidatedForm>
  );
};

export default YupPerInput;
```

### Per form validation

Using the `validationSchema` prop with a `Yup` object defining validations for each field in the form. When using `validationSchema` there is no need to supply individual validate props to the input components.

```javascript
import React from "react";
import * as Yup from "yup";
import Button from "carbon-react/lib/components/button";
import ValidatedForm, { ValidatedTextbox } from "components/validated-form";

const YupPerForm = () => {
  const handleSubmit = (values) => {
    console.log("Submitting", values);
  };

  return (
    <ValidatedForm
      validationSchema={Yup.object({
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        email: Yup.string()
          .email("Enter a valid email")
          .required("Email is required"),
      })}
      leftSideButtons={<Button buttonType="tertiary">Cancel</Button>}
      saveButton={
        <Button buttonType="primary" type="submit">
          Save
        </Button>
      }
      onSubmit={handleSubmit}
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
      }}
    >
      <ValidatedTextbox label="First Name" name="firstName" required />
      <ValidatedTextbox label="Last Name" name="lastName" required />
      <ValidatedTextbox label="Email" name="email" required />
    </ValidatedForm>
  );
};

export default YupPerForm;
```

## Examples Using Javascript validations

the `ValiatedForm` also supports using stanard Javascript functions as validators.

### Per input validations

Each validated variant component accepts a `validate` prop. The `validate` prop is the function to use to validate the input value with.

The example below uses individual `validate` props for each validated component using `Yup`.

```javascript
import React from "react";
import Button from "carbon-react/lib/components/button";
import ValidatedForm, { ValidatedTextbox } from "components/validated-form";

const JavascriptPerInput = () => {
  const handleSubmit = (values) => {
    console.log("Submitting", values);
  };

  const validateFirstName = (value) => {
    if (!value) {
      return "First Name is required";
    }
    return undefined;
  };

  const validateLastName = (value) => {
    if (!value) {
      return "Last Name is required";
    }
    return undefined;
  };

  const validateEmail = (value) => {
    if (!value) {
      return "Email is required";
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      return "Invalid email address";
    }
    return undefined;
  };

  return (
    <ValidatedForm
      leftSideButtons={<Button buttonType="tertiary">Cancel</Button>}
      saveButton={
        <Button buttonType="primary" type="submit">
          Save
        </Button>
      }
      onSubmit={handleSubmit}
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
      }}
    >
      <ValidatedTextbox
        label="First Name"
        name="firstName"
        validate={validateFirstName}
        required
      />
      <ValidatedTextbox
        label="Last Name"
        name="lastName"
        validate={validateLastName}
        required
      />
      <ValidatedTextbox
        label="Email"
        name="email"
        required
        validate={validateEmail}
      />
    </ValidatedForm>
  );
};

export default JavascriptPerInput;
```

### Per form validation

The `ValidatedForm` component has a `validate` prop. The prop accepts a Javascript function which is used to validate all the values of the form. When using `validate` on the `ValidatedForm` there is no need to use `validate` on each validated input.

```javascript
import React from "react";
import Button from "carbon-react/lib/components/button";
import ValidatedForm, { ValidatedTextbox } from "components/validated-form";

const JavascriptPerForm = () => {
  const handleSubmit = (values) => {
    console.log("Submitting", values);
  };

  const validate = (values) => {
    const errors = {};
    if (!values.firstName) {
      errors.firstName = "First Name is required";
    }
    if (!values.lastName) {
      errors.lastName = "Last Name is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    }
    if (
      values.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
    return errors;
  };

  return (
    <ValidatedForm
      validate={validate}
      leftSideButtons={<Button buttonType="tertiary">Cancel</Button>}
      saveButton={
        <Button buttonType="primary" type="submit">
          Save
        </Button>
      }
      onSubmit={handleSubmit}
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
      }}
    >
      <ValidatedTextbox label="First Name" name="firstName" required />
      <ValidatedTextbox label="Last Name" name="lastName" required />
      <ValidatedTextbox label="Email" name="email" required />
    </ValidatedForm>
  );
};

export default JavascriptPerForm;
```

## Other examples

### With nested form components

No matter where the validated variant is in the children it will automatically connect to the form for validation functionality.

In the example below a separate component `Address` is mounted within the form. The `Address` component contains address fields which are required. The `initialValues` object is updated to include a sub object for `address`. The inputs in the `Address` component use dot notation in their names which correspond to their keys in the `initialValues`.

```javascript
import React from "react";
import * as Yup from "yup";
import Button from "carbon-react/lib/components/button";
import ValidatedForm, { ValidatedTextbox } from "components/validated-form";

const Address = () => {
  return (
    <>
      <ValidatedTextbox
        label="Address One"
        name="address.addressOne"
        validate={Yup.string().required("Address One is required")}
        required
      />
      <ValidatedTextbox
        label="City"
        name="address.city"
        validate={Yup.string().required("City is required")}
        required
      />
    </>
  );
};

const NestedInputs = () => {
  const handleSubmit = (values) => {
    console.log("Submitting", values);
  };

  return (
    <ValidatedForm
      leftSideButtons={<Button buttonType="tertiary">Cancel</Button>}
      saveButton={
        <Button buttonType="primary" type="submit">
          Save
        </Button>
      }
      onSubmit={handleSubmit}
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        address: {
          addressOne: "",
          city: "",
        },
      }}
    >
      <ValidatedTextbox
        label="First Name"
        name="firstName"
        validate={Yup.string().required("First Name is required")}
        required
      />
      <ValidatedTextbox
        label="Last Name"
        name="lastName"
        validate={Yup.string().required("Last Name is required")}
        required
      />
      <ValidatedTextbox
        label="Email"
        name="email"
        required
        validate={Yup.string()
          .email("Enter a valid email")
          .required("Email is required")}
      />
      {/* Component containing nested inputs. */}
      <Address />
    </ValidatedForm>
  );
};

export default NestedInputs;
```

### With dynamic form components

When using a dynamic form where inputs may or may not be included the `initialValues` should update accordingly when adding or removing inputs.

The example below contains a switch to decide whether to include the email or not. When including the email the `initialValues` updates with an `email` key value. The form also updates to show the `Email` input.

When removing a field the form errors will be re-evaluated as to not include errors for fields not currently present. So for example below if you choose to include email and click submit the form will validate with 3 errors. Then choose to not include email, the email field will disappear and the error count will update to 2.

```javascript
import React, { useState } from "react";
import * as Yup from "yup";
import Button from "carbon-react/lib/components/button";
import Switch from "carbon-react/lib/components/switch";
import ValidatedForm, { ValidatedTextbox } from "components/validated-form";

const WithDynamic = () => {
  const [includeEmail, setIncludeEmail] = useState(false);

  const handleSubmit = (values) => {
    console.log("Submitting", values);
  };

  const handleSwitch = (e) => {
    setIncludeEmail(e.target.checked);
  };

  const initialValues = () => {
    if (includeEmail) {
      return { firstName: "", lastName: "", email: "" };
    }

    return { firstName: "", lastName: "" };
  };

  return (
    <ValidatedForm
      leftSideButtons={<Button buttonType="tertiary">Cancel</Button>}
      saveButton={
        <Button buttonType="primary" type="submit">
          Save
        </Button>
      }
      onSubmit={handleSubmit}
      initialValues={initialValues()}
    >
      <ValidatedTextbox
        label="First Name"
        name="firstName"
        validate={Yup.string().required("First Name is required")}
        required
      />
      <ValidatedTextbox
        label="Last Name"
        name="lastName"
        validate={Yup.string().required("Last Name is required")}
        required
      />
      <Switch
        checked={includeEmail}
        value={String(includeEmail)}
        onChange={handleSwitch}
        label="include email?"
      />
      {includeEmail && (
        <ValidatedTextbox
          label="Email"
          labelInline
          name="email"
          required
          validate={Yup.string()
            .email("Enter a valid email")
            .required("Email is required")}
        />
      )}
    </ValidatedForm>
  );
};

export default WithDynamic;
```

### With validationOnSubmit

When `validateOnSubmit` is true then the inputs will not validate until the form is submitted. After submitting any inputs that have an error can be re-validated.

```javascript
import React from "react";
import * as Yup from "yup";
import Button from "carbon-react/lib/components/button";
import ValidatedForm, { ValidatedTextbox } from "components/validated-form";

const WithValidateOnSubmit = () => {
  const handleSubmit = (values) => {
    console.log("Submitting", values);
  };

  return (
    <ValidatedForm
      validateOnSubmit
      leftSideButtons={<Button buttonType="tertiary">Cancel</Button>}
      saveButton={
        <Button buttonType="primary" type="submit">
          Save
        </Button>
      }
      onSubmit={handleSubmit}
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
      }}
    >
      <ValidatedTextbox
        label="First Name"
        name="firstName"
        validate={Yup.string().required("First Name is required")}
        required
      />
      <ValidatedTextbox
        label="Last Name"
        name="lastName"
        validate={Yup.string().required("Last Name is required")}
        required
      />
      <ValidatedTextbox
        label="Email"
        name="email"
        required
        validate={Yup.string()
          .email("Enter a valid email")
          .required("Email is required")}
      />
    </ValidatedForm>
  );
};

export default WithValidateOnSubmit;
```

### With validation summary

To display the validation summary add the `withSummary` prop to the `ValidatedForm` component. Then when the form is submitted you will get a validation summary over the form. The summary contains the errors from the form as links. Clicking one of the links will scroll to the input and give it focus.

```javascript
import React from "react";
import * as Yup from "yup";
import Button from "carbon-react/lib/components/button";
import ValidatedForm, { ValidatedTextbox } from "components/validated-form";

const WithSummary = () => {
  const handleSubmit = (values) => {
    console.log("Submitting", values);
  };

  return (
    <ValidatedForm
      withSummary
      leftSideButtons={<Button buttonType="tertiary">Cancel</Button>}
      saveButton={
        <Button buttonType="primary" type="submit">
          Save
        </Button>
      }
      onSubmit={handleSubmit}
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
      }}
    >
      <ValidatedTextbox
        label="First Name"
        name="firstName"
        validate={Yup.string().required("First Name is required")}
        required
      />
      <ValidatedTextbox
        label="Last Name"
        name="lastName"
        validate={Yup.string().required("Last Name is required")}
        required
      />
      <ValidatedTextbox
        label="Email"
        name="email"
        required
        validate={Yup.string()
          .email("Enter a valid email")
          .required("Email is required")}
      />
    </ValidatedForm>
  );
};

export default WithSummary;
```

### With other exports

The `ValidatedSelect` and `ValidatedRadioButtonGroup` rely on other components to function, namely `Option` and `RadioButton`. These are also exported as named imports from the `ValdatedComponent` for convenience.

> One thing to note when using the validation summary and clicking on an error relating tot he `ValidatedRadioButtonGroup` the input is scrolled to but there is no focus applied to the radio buttons, this is something the user should choose themselves.

```javascript
import React from "react";
import * as Yup from "yup";
import Button from "carbon-react/lib/components/button";
import ValidatedForm, {
  ValidatedTextbox,
  ValidatedSelect,
  Option,
  ValidatedRadioButtonGroup,
  RadioButton,
} from "components/validated-form";

const WithOtherExports = () => {
  const handleSubmit = (values) => {
    console.log("Submitting", values);
  };

  return (
    <ValidatedForm
      withSummary
      leftSideButtons={<Button buttonType="tertiary">Cancel</Button>}
      saveButton={
        <Button buttonType="primary" type="submit">
          Save
        </Button>
      }
      onSubmit={handleSubmit}
      initialValues={{
        username: "",
        location: "",
        subscriptionType: "",
      }}
    >
      <ValidatedTextbox
        label="Username"
        name="username"
        validate={Yup.string().required("Username is required")}
        required
      />
      <ValidatedSelect
        name="location"
        id="location"
        label="Location"
        required
        validate={Yup.string().required("Location is required")}
      >
        <Option text="Europe" value="1" />
        <Option text="Asia" value="2" />
        <Option text="America" value="3" />
      </ValidatedSelect>
      <ValidatedRadioButtonGroup
        legend="Subscription Type"
        name="supscriptionType"
        validate={Yup.string().required("Subscription Type is required")}
      >
        <RadioButton id="subscription-1" value="monthly" label="Monthly" />
        <RadioButton id="subscription-2" value="yearly" label="Yearly" />
      </ValidatedRadioButtonGroup>
    </ValidatedForm>
  );
};

export default WithOtherExports;
```

### With tiggering other input validation

Adding a custom `onBlur` or `onChange` prop to a validated component will give it access not only to the event but also several Formik functions which can be used to trigger validations on other fields or the form iself. The Formik method functions provided are: `validateForm, validateField, setFieldValue, setFieldTouched,`. These can be destructered from the second param provided to the `onBlur` and `onChange`

This is useful if you would like to trigger one inputs validation from another, for example if two inputs were related.

The example below has a custom `onBlur` on the `First Name` field. When `First Name` is blurred then the `Last Name` field is validated.

```javascript
import React from "react";
import * as Yup from "yup";
import Button from "carbon-react/lib/components/button";
import ValidatedForm, { ValidatedTextbox } from "components/validated-form";

const WithOtherInputValidation = () => {
  const handleSubmit = (values) => {
    console.log("Submitting", values);
  };

  return (
    <ValidatedForm
      leftSideButtons={<Button buttonType="tertiary">Cancel</Button>}
      saveButton={
        <Button buttonType="primary" type="submit">
          Save
        </Button>
      }
      onSubmit={handleSubmit}
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
      }}
    >
      <ValidatedTextbox
        label="First Name"
        name="firstName"
        validate={Yup.string().required("First Name is required")}
        onBlur={(_, { validateField, setFieldTouched }) => {
          validateField("lastName");
          setFieldTouched("lastName");
        }}
        required
      />
      <ValidatedTextbox
        label="Last Name"
        name="lastName"
        validate={Yup.string().required("Last Name is required")}
        required
      />
      <ValidatedTextbox
        label="Email"
        name="email"
        required
        validate={Yup.string()
          .email("Enter a valid email")
          .required("Email is required")}
      />
    </ValidatedForm>
  );
};

export default WithOtherInputValidation;
```
