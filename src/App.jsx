import React from "react";
import * as yup from "yup";

import Button from "carbon-react/lib/components/button";

import ValidatedForm, {
  ValidatedTextbox,
  ValidatedTextarea,
  ValidatedCheckbox,
  ValidatedDateInput,
  ValidatedSwitch,
  ValidatedRadioButtonGroup,
  ValidatedRadioButton,
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
        errorSchema={yup.string().required("Date of Birth is required")}
      />
      <ValidatedTextbox
        label="Address Line One"
        labelInline
        name="personalDetails.addressLineOne"
        required
        errorSchema={yup.string().required("Address Line One is required")}
      />
      <ValidatedTextbox
        label="Address Line Two"
        labelInline
        name="personalDetails.addressLineTwo"
        required
        errorSchema={yup.string().required("Address Line Two is required")}
      />
      <ValidatedTextbox
        label="Address Line Three"
        labelInline
        name="personalDetails.addressLineThree"
        required
        errorSchema={yup.string().required("Address Line Three is required")}
      />
    </>
  );
};

const App = () => {
  const handleSubmit = (values) => {
    console.log("Submitting", values);
  };

  return (
    <div className="app">
      <h1>Validated Form Example</h1>
      <ValidatedForm
        // validateOnSubmit
        // validateOnChange
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
          hotDogSize: "",
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
          errorSchema={yup.string().required("First Name is required")}
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
          errorSchema={yup.string().required("Last Name is required")}
        />
        <ValidatedTextbox
          label="Email"
          labelInline
          name="email"
          required
          errorSchema={yup
            .string()
            .required("Email is required")
            .email("Email should be a valid email address.")}
        />
        <ValidatedTextarea
          label="Description"
          labelInline
          name="description"
          required
          errorSchema={yup.string().required("Description is required")}
        />
        <ValidatedCheckbox
          label="Agree to terms?"
          labelInline
          name="agreeTerms"
          checked={false}
          required
          errorSchema={yup
            .boolean()
            .oneOf([true], "You must Accept Terms and Conditions")}
        />
        <ValidatedSwitch
          label="Enable Spyware"
          labelInline
          name="enableSpyware"
          checked={false}
          required
          errorSchema={yup.boolean().oneOf([true], "You must enable spyware")}
        />
        <ValidatedRadioButtonGroup
          legend="Hot dog size"
          name="hotDogSize"
          errorSchema={yup.string().required("Hot dog size is required")}
        >
          <ValidatedRadioButton id="radio-one-1" value="large" label="Large" />
          <ValidatedRadioButton
            id="radio-one-2"
            value="extra-large"
            label="Extra Large"
          />
          <ValidatedRadioButton
            id="radio-one-3"
            value="obscene"
            label="Obscene"
          />
        </ValidatedRadioButtonGroup>
        <PersonalDetails />
      </ValidatedForm>
    </div>
  );
};

export default App;
