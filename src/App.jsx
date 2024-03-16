import React, { useState } from "react";
import * as yup from "yup";

import Button from "carbon-react/lib/components/button";

import ValidatedForm, {
  ValidatedTextbox,
  ValidatedTextarea,
  ValidatedCheckbox,
} from "./components/validated-form";

import "./styles.scss";

export default function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    description: "",
    agreeTerms: false,
  });

  const updateFormData = (e) => {
    const { name, value, type } = e.target;

    let updatedValue = value.formattedValue ? value.formattedValue : value;
    if (type && type === "checkbox") {
      const currentValue = formData[name];
      updatedValue = !Boolean(currentValue);
    }

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: updatedValue,
      };
    });
  };

  const handleSubmit = (values) => {
    console.log("Submitting", values);
  };

  return (
    <div className="app">
      <h1>Validated Form Example</h1>
      <ValidatedForm
        validateOnBlur
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
        }}
      >
        <ValidatedTextbox
          label="First Name"
          labelInline
          name="firstName"
          errorSchema={yup
            .string()
            .required("You have to pick one of the animals")}
        />
        <ValidatedTextbox
          label="Last Name"
          labelInline
          name="lastName"
          errorSchema={yup
            .string()
            .required("You have to pick one of the animals")}
        />

        <ValidatedTextbox
          label="Email"
          labelInline
          name="email"
          errorSchema={yup
            .string()
            .email("You need to provide an email address.")}
        />
        <ValidatedTextarea label="Description" labelInline name="description" />
        <ValidatedCheckbox
          label="Agree to terms?"
          labelInline
          name="agreeTerms"
        />
      </ValidatedForm>
    </div>
  );
}
