import React from "react";
import * as yup from "yup";

import Button from "carbon-react/lib/components/button";

import ValidatedForm, {
  ValidatedTextbox,
  ValidatedTextarea,
  ValidatedCheckbox,
  ValidatedDateInput,
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
        errorSchema={yup.string().required("Please enter a date of birth")}
      />
      <ValidatedTextbox
        label="Address Line One"
        labelInline
        name="personalDetails.addressLineOne"
        required
        errorSchema={yup.string().required("Please enter address line")}
      />
      <ValidatedTextbox
        label="Address Line Two"
        labelInline
        name="personalDetails.addressLineTwo"
        required
        errorSchema={yup.string().required("Please enter address line")}
      />
      <ValidatedTextbox
        label="Address Line Three"
        labelInline
        name="personalDetails.addressLineThree"
        required
        errorSchema={yup.string().required("Please enter address line")}
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
          errorSchema={yup.string().required("Please enter a first name")}
          warningSchema={yup.string().min(2, "Please enter a longer name")}
        />
        <ValidatedTextbox
          label="Last Name"
          labelInline
          name="lastName"
          required
          errorSchema={yup.string().required("Please enter a last name")}
        />
        <ValidatedTextbox
          label="Email"
          labelInline
          name="email"
          errorSchema={yup
            .string()
            .required("Please enter an email address")
            .email("Please enter a valid email address.")}
        />
        <ValidatedTextarea
          label="Description"
          labelInline
          name="description"
          errorSchema={yup.string().required("Please enter a description")}
        />
        <ValidatedCheckbox
          label="Agree to terms?"
          labelInline
          name="agreeTerms"
          checked={false}
          errorSchema={yup
            .boolean()
            .oneOf([true], "You must Accept Terms and Conditions")}
        />
        <PersonalDetails />
      </ValidatedForm>
    </div>
  );
};

export default App;
