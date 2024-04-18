import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import * as Yup from "yup";
import CarbonProvider from "carbon-react/lib/components/carbon-provider";
import sageTheme from "carbon-react/lib/style/themes/sage";

import Button from "carbon-react/lib/components/button";

import ValidatedForm, { ValidatedTextbox } from "./index.jsx";

const customRender = (ui) => {
  return render(
    <CarbonProvider theme={sageTheme} validationRedesignOptIn>
      {ui}
    </CarbonProvider>
  );
};

describe("ValidatedForm", () => {
  const user = userEvent.setup();
  // Sample validation schema using Yup
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
  });

  const initialValues = {
    username: "",
    email: "",
  };

  const onSubmit = jest.fn();

  it("renders the form with all fields", () => {
    const { getByLabelText } = customRender(
      <ValidatedForm
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        saveButton={
          <Button buttonType="primary" type="submit">
            Save
          </Button>
        }
      >
        <ValidatedTextbox label="Username" name="username" />
        <ValidatedTextbox label="Email" name="email" />
      </ValidatedForm>
    );

    expect(getByLabelText("Username")).toBeInTheDocument();
    expect(getByLabelText("Email")).toBeInTheDocument();
  });

  describe("using validationSchema", () => {
    beforeEach(() => {
      customRender(
        <ValidatedForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          saveButton={
            <Button buttonType="primary" type="submit">
              Save
            </Button>
          }
        >
          <ValidatedTextbox label="Username" name="username" />
          <ValidatedTextbox label="Email" name="email" />
        </ValidatedForm>
      );
    });

    it("displays validation error when a field is touched and left empty", async () => {
      const username = screen.getByLabelText("Username");
      const saveButton = screen.getByText("Save");
      user.click(username);
      user.click(saveButton);

      const usernameError = await screen.findByText("Username is required");
      const emailError = await screen.findByText("Email is required");
      expect(usernameError).toBeInTheDocument();
      expect(emailError).toBeInTheDocument();
    });
  });
});
