import React, { useState } from "react";
import * as Yup from "yup";
import Button from "carbon-react/lib/components/button";
import Switch from "carbon-react/lib/components/switch";
import ValidatedForm, {
  ValidatedTextbox,
  ValidatedTextarea,
  ValidatedPassword,
  ValidatedCheckbox,
  ValidatedDecimal,
  ValidatedNumber,
  ValidatedNumeralDate,
  ValidatedDateInput,
  ValidatedSwitch,
  ValidatedSelect,
  Option,
  ValidatedRadioButtonGroup,
  RadioButton,
} from "./index";

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
      errors.email = "Invalid email address";
    }
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

const ComplexForm = () => {
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
        description: "",
        agreeTerms: false,
        enableSpyware: false,
        color: "",
        accountType: "",
        pizzaToppingsPheasant: "",
        pizzaToppingsPineapple: "",
        pizzaToppingsAnchovies: "",
        personalDetails: {
          dob: "",
        },
      }}
    >
      <ValidatedTextbox
        label="First Name"
        labelInline
        name="firstName"
        required
        validate={Yup.string().required("First Name is required")}
        onBlur={(_, { validateField, setFieldTouched }) => {
          validateField("lastName");
          setFieldTouched("lastName");
        }}
      />
      <ValidatedTextbox
        label="Last Name"
        labelInline
        name="lastName"
        required
        validate={Yup.string().required("Last Name is required")}
      />
      <ValidatedTextbox
        label="Email"
        labelInline
        name="email"
        required
        validate={Yup.string()
          .email("Enter a valid email")
          .required("Email is required")}
      />
      <ValidatedTextarea
        label="Description"
        labelInline
        name="description"
        required
        validate={Yup.string().required("Description is required")}
      />
      <ValidatedCheckbox
        label="Agree to terms?"
        labelInline
        name="agreeTerms"
        required
        validate={Yup.boolean().oneOf(
          [true],
          "You must Accept Terms and Conditions"
        )}
      />
      <ValidatedSwitch
        label="Enable Spyware"
        labelInline
        name="enableSpyware"
        checked={false}
        required
        validate={Yup.boolean().oneOf([true], "You must enable spyware")}
      />

      <ValidatedRadioButtonGroup
        legend="Account Type"
        name="accountType"
        validate={Yup.string().required("Account Type is required")}
      >
        <RadioButton
          id="radio-one-1"
          value="super-manager"
          label="Super Manager"
        />
        <RadioButton id="radio-one-2" value="manager" label="Manager" />
        <RadioButton id="radio-one-3" value="employee" label="Employee" />
      </ValidatedRadioButtonGroup>
      <ValidatedSelect
        name="color"
        id="color"
        label="Color"
        labelInline
        required
        validate={Yup.string().required("Color is required")}
      >
        <Option text="Amber" value="1" />
        <Option text="Black" value="2" />
        <Option text="Blue" value="3" />
        <Option text="Brown" value="4" />
        <Option text="Green" value="5" />
        <Option text="Orange" value="6" />
        <Option text="Pink" value="7" />
        <Option text="Purple" value="8" />
        <Option text="Red" value="9" />
        <Option text="White" value="10" />
        <Option text="Yellow" value="11" />
      </ValidatedSelect>
      <ValidatedDateInput
        label="Date of Birth"
        labelInline
        name="personalDetails.dob"
        required
        validate={Yup.string().required("Date of Birth is required")}
      />
    </ValidatedForm>
  );
};

const ComplexYupSignup = () => {
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
        password: "",
      }}
    >
      <h2>Signup</h2>
      <ValidatedTextbox
        label="Username"
        name="username"
        validate={Yup.string()
          .required("Username is required")
          .min(2, "Username should be longer than 2 characters")
          .max(12, "Username should be less than 12 characters")
          .matches(/^[a-zA-Z]+$/, "Username should only contain letters")}
        required
      />
      <ValidatedPassword
        label="Password"
        name="password"
        validate={Yup.string()
          .required("Password is required")
          .min(12, "Username should be at least 12 characters")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$/,
            "Password should have at least one lowercase letter, at least one uppercase letter, at least one number and at least one special character."
          )}
        required
      />
    </ValidatedForm>
  );
};

const EveryInput = () => {
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
        password: "",
        description: "",
        agreeTerms: false,
        enableSpyware: false,
        temperature: "",
        number: "",
        color: "",
        supscriptionType: "",
        dob: "",
        dobNum: { dd: "", mm: "", yyyy: "" },
      }}
    >
      <ValidatedTextbox
        label="Username"
        name="username"
        validate={Yup.string().required("Username is required")}
        required
      />
      <ValidatedPassword
        label="Password"
        name="password"
        validate={Yup.string().required("Password is required")}
        required
      />
      <ValidatedTextarea
        label="Description"
        name="description"
        validate={Yup.string().required("Description is required")}
        required
      />
      <ValidatedCheckbox
        label="Agree To Terms"
        name="agreeTerms"
        validate={Yup.boolean().oneOf(
          [true],
          "You must Accept Terms and Conditions"
        )}
        required
      />
      <ValidatedSwitch
        label="Enable Spyware"
        labelInline
        name="enableSpyware"
        checked={false}
        required
        validate={Yup.boolean().oneOf([true], "You must enable spyware")}
      />
      <ValidatedDecimal
        label="Temperature"
        name="temperature"
        validate={Yup.string().required("Temperature is required")}
        required
      />
      <ValidatedNumber
        label="Number"
        name="number"
        validate={Yup.string().required("Number is required")}
        required
      />
      <ValidatedSelect
        name="color"
        id="color"
        label="Color"
        labelInline
        required
        validate={Yup.string().required("Color is required")}
      >
        <Option text="Amber" value="1" />
        <Option text="Black" value="2" />
        <Option text="Blue" value="3" />
        <Option text="Brown" value="4" />
        <Option text="Green" value="5" />
        <Option text="Orange" value="6" />
        <Option text="Pink" value="7" />
        <Option text="Purple" value="8" />
        <Option text="Red" value="9" />
        <Option text="White" value="10" />
        <Option text="Yellow" value="11" />
      </ValidatedSelect>
      <ValidatedRadioButtonGroup
        legend="Subscription Type"
        name="supscriptionType"
        validate={Yup.string().required("Subscription Type is required")}
      >
        <RadioButton id="subscription-1" value="monthly" label="Monthly" />
        <RadioButton id="subscription-2" value="yearly" label="Yearly" />
      </ValidatedRadioButtonGroup>
      <ValidatedDateInput
        label="Date of Birth"
        labelInline
        name="dob"
        required
        validate={Yup.string().required("Date of Birth is required")}
      />
      <ValidatedNumeralDate
        label="Date of Birth Numeral"
        labelInline
        name="dobNum"
        required
        validate={Yup.object({
          yyyy: Yup.string().required("Please enter a year"),
          mm: Yup.string().required("Please enter a month"),
          dd: Yup.string().required("Please enter a day"),
        })}
      />
    </ValidatedForm>
  );
};

const Examples = () => {
  return (
    <>
      {/* <h1>YupPerInput</h1>
      <YupPerInput />
      <hr />
      <h1>YupPerForm</h1>
      <YupPerForm />
      <hr />
      <h1>JavascriptPerInput</h1>
      <JavascriptPerInput />
      <hr />
      <h1>JavascriptPerForm</h1>
      <JavascriptPerForm />
      <hr />
      <h1>NestedInputs</h1>
      <NestedInputs />
      <hr />
      <h1>WithDynamic</h1>
      <WithDynamic />
      <hr />
      <h1>WithValidateOnSubmit</h1>
      <WithValidateOnSubmit />
      <hr />
      <h1>WithSummary</h1>
      <WithSummary />
      <hr />
      <h1>WithOtherExports</h1>
      <WithOtherExports />
      <hr />
      <h1>WithOtherInputValidation</h1>
      <WithOtherInputValidation />
      <hr />
      <h1>ComplexForm</h1>
      <ComplexForm />
      <hr />
      <h1>ComplexYupSignup</h1>
      <ComplexYupSignup /> */}
      <hr />
      <h1>EveryInput</h1>
      <EveryInput />
    </>
  );
};

export default Examples;
