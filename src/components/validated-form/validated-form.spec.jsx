import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import * as Yup from "yup";
import CarbonProvider from "carbon-react/lib/components/carbon-provider";
import sageTheme from "carbon-react/lib/style/themes/sage";

import Button from "carbon-react/lib/components/button";

import ValidatedForm, { ValidatedTextbox } from "./index.jsx";

const customRender = async (ui) => {
  render(
    <CarbonProvider theme={sageTheme} validationRedesignOptIn>
      {ui}
    </CarbonProvider>
  );
};

describe("ValidatedForm", () => {
  const user = userEvent.setup();

  const validateUsername = Yup.string().required("Username is required");
  const validateEmail = Yup.string().required("Email is required");
  // Sample validation schema using Yup
  const validationSchema = Yup.object({
    username: validateUsername,
    email: validateEmail,
  });

  const initialValues = {
    username: "",
    email: "",
  };

  const onSubmit = jest.fn();

  it("renders the form with all fields", () => {
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

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  describe("when using Yup validations", () => {
    describe("and validating onBlur", () => {
      describe("with per input validation", () => {
        beforeEach(() => {
          customRender(
            <ValidatedForm
              validateOnBlur
              initialValues={initialValues}
              onSubmit={onSubmit}
              saveButton={
                <Button buttonType="primary" type="submit">
                  Save
                </Button>
              }
            >
              <ValidatedTextbox
                label="Username"
                name="username"
                validate={validateUsername}
              />
              <ValidatedTextbox
                label="Email"
                name="email"
                validate={validateEmail}
              />
            </ValidatedForm>
          );
        });

        it("displays validation error when a field is touched and left empty", async () => {
          expect(screen.queryByText("Username is required")).toBeNull();
          expect(screen.queryByText("Email is required")).toBeNull();
          expect(screen.queryByText("2 errors")).toBeNull();

          // Blur each field
          const username = screen.getByLabelText("Username");
          const email = screen.getByLabelText("Email");
          await act(async () => {
            await user.click(username);
            await user.click(email);
            await user.click(username);
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();
          expect(screen.getByText("Email is required")).toBeInTheDocument();
          expect(screen.getByText("2 errors")).toBeInTheDocument();
        });
      });

      describe("with validationSchema", () => {
        beforeEach(() => {
          customRender(
            <ValidatedForm
              validateOnBlur
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
          expect(screen.queryByText("Username is required")).toBeNull();
          expect(screen.queryByText("Email is required")).toBeNull();
          expect(screen.queryByText("2 errors")).toBeNull();

          // Blur each field
          const username = screen.getByLabelText("Username");
          const email = screen.getByLabelText("Email");
          await act(async () => {
            await user.click(username);
            await user.click(email);
            await user.click(username);
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();
          expect(screen.getByText("Email is required")).toBeInTheDocument();
          expect(screen.getByText("2 errors")).toBeInTheDocument();
        });
      });
    });
  });
});
