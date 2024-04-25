import React, { useState } from "react";
import * as Yup from "yup";

import Button from "carbon-react/lib/components/button";
import Switch from "carbon-react/lib/components/switch";

import ValidatedForm, {
  ValidatedTextbox,
  ValidatedTextarea,
  ValidatedCheckbox,
  ValidatedDateInput,
  ValidatedSwitch,
  ValidatedRadioButtonGroup,
  RadioButton,
  ValidatedSelect,
  Option,
} from "./components/validated-form";

import "./styles.scss";

const PersonalDetails = () => {
  return (
    <>
      <h4>Nested component</h4>
      <ValidatedDateInput
        label="Date of Birth"
        labelInline
        name="personalDetails.dob"
        required
        validate={Yup.string().required("Date of Birth is required")}
      />
      <ValidatedTextbox
        label="Address Line One"
        labelInline
        name="personalDetails.addressLineOne"
        required
        validate={Yup.string().required("Address Line One is required")}
      />
      <ValidatedTextbox
        label="Address Line Two"
        labelInline
        name="personalDetails.addressLineTwo"
        required
        validate={Yup.string().required("Address Line Two is required")}
      />
      <ValidatedTextbox
        label="Address Line Three"
        labelInline
        name="personalDetails.addressLineThree"
        required
        validate={Yup.string().required("Address Line Three is required")}
      />
    </>
  );
};

const App = () => {
  const [includeEmail, setIncludeEmail] = useState(false);
  const handleSubmit = (values) => {
    console.log("Submitting", values);
  };

  const validateFirstName = (value) => {
    let errorMessage;
    if (!value) {
      errorMessage = "First Name is required";
    }
    return errorMessage;
  };

  const validateLastName = (value) => {
    let errorMessage;
    if (!value) {
      errorMessage = "Last Name is required";
    }
    return errorMessage;
  };

  const validateEmail = (value) => {
    let errorMessage;
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      errorMessage = "Invalid email address";
    }
    return errorMessage;
  };

  const validate = (values) => {
    const errors = {};
    if (!values.firstName) {
      errors.firstName = "First Name is required";
    }
    if (!values.lastName) {
      errors.lastName = "Last Name is required";
    }
    return errors;
  };

  const initialValues = () => {
    if (includeEmail) {
      return { firstName: "", lastName: "", email: "" };
    }

    return { firstName: "", lastName: "" };
  };

  const values = initialValues();
  const handleSwitch = (e) => {
    setIncludeEmail(e.target.checked);
  };

  return (
    <div className="app">
      <h1>Validated Form Example - validation per input</h1>
      <ValidatedForm
        // validateOnSubmit
        validateOnChange
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
            addressLineOne: "",
            addressLineTwo: "",
            addressLineThree: "",
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
            .required("Last Name is required")}
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
      </ValidatedForm>
      <hr />
      <h1>
        Validated Form Example - validation per input with optional fields
      </h1>
      <ValidatedForm
        withSummary
        leftSideButtons={<Button buttonType="tertiary">Cancel</Button>}
        saveButton={
          <Button buttonType="primary" type="submit">
            Save
          </Button>
        }
        onSubmit={handleSubmit}
        initialValues={values}
      >
        <ValidatedTextbox
          label="First Name"
          labelInline
          name="firstName"
          required
          validate={Yup.string().required("First Name is required")}
        />
        <ValidatedTextbox
          label="Last Name"
          labelInline
          name="lastName"
          required
          validate={Yup.string().required("Last Name is required")}
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
      <hr />
      <h1>Validated Form Example - Yup validation schema</h1>
      <ValidatedForm
        withSummary
        validateOnSubmit
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
        <ValidatedTextbox
          label="First Name"
          labelInline
          name="firstName"
          required
        />
        <ValidatedTextbox
          label="Last Name"
          labelInline
          name="lastName"
          required
        />
        <ValidatedTextbox label="Email" labelInline name="email" required />
      </ValidatedForm>
      <hr />
      <h1>Validated Form Example - form validate</h1>
      <ValidatedForm
        validate={validate}
        leftSideButtons={<Button buttonType="tertiary">Cancel</Button>}
        saveButton={
          <Button
            buttonType="primary"
            type="submit"
            onClick={() => alert("hello")}
          >
            Save
          </Button>
        }
        onSubmit={handleSubmit}
        initialValues={{
          firstName: "",
          lastName: "",
        }}
      >
        <ValidatedTextbox
          label="First Name"
          labelInline
          name="firstName"
          required
        />
        <ValidatedTextbox
          label="Last Name"
          labelInline
          name="lastName"
          required
        />
      </ValidatedForm>
      <hr />
      <h1>Validated Form Example - js validate per input</h1>
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
        }}
      >
        <ValidatedTextbox
          label="First Name"
          labelInline
          name="firstName"
          validate={validateFirstName}
          required
        />
        <ValidatedTextbox
          label="Last Name"
          labelInline
          name="lastName"
          validate={validateLastName}
          required
        />
      </ValidatedForm>
    </div>
  );
};

export default App;
