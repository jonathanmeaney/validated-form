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

  const yupValidateUsername = Yup.string().required("Username is required");
  const yupValidateEmail = Yup.string().required("Email is required");
  // Sample validation schema using Yup
  const validationSchema = Yup.object({
    username: yupValidateUsername,
    email: yupValidateEmail,
  });

  const jsValidateUsername = (value) => {
    let errorMessage;
    if (!value) {
      errorMessage = "Username is required";
    }
    return errorMessage;
  };

  const jsValidateEmail = (value) => {
    let errorMessage;
    if (!value) {
      errorMessage = "Email is required";
    }
    return errorMessage;
  };

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = "Username is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    }
    return errors;
  };

  const initialValues = {
    username: "",
    email: "",
  };

  const nestedInitialValues = {
    username: "",
    personalDetails: {
      email: "",
    },
  };

  const onSubmit = jest.fn();

  test("rendering the form with all fields", () => {
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
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  describe("when validateOnBlur", () => {
    describe("with per input validation", () => {
      describe("and using Yup validations", () => {
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
                validate={yupValidateUsername}
              />
              <ValidatedTextbox
                label="Email"
                name="email"
                validate={yupValidateEmail}
              />
            </ValidatedForm>
          );
        });

        test("displaying validation errors when a field is touched and left empty", async () => {
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

        test("displaying validation errors on attempted submission", async () => {
          expect(screen.queryByText("Username is required")).toBeNull();
          expect(screen.queryByText("Email is required")).toBeNull();
          expect(screen.queryByText("2 errors")).toBeNull();

          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();
          expect(screen.getByText("Email is required")).toBeInTheDocument();
          expect(screen.getByText("2 errors")).toBeInTheDocument();
        });

        test("updating the form and submitting values", async () => {
          const username = screen.getByLabelText("Username");
          const email = screen.getByLabelText("Email");

          await act(async () => {
            await user.click(username);
            await user.type(username, "Jonathan");
            await user.click(email);
            await user.type(email, "jonathan.meaney@sage.com");
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(onSubmit).toHaveBeenCalledWith({
            email: "jonathan.meaney@sage.com",
            username: "Jonathan",
          });
        });
      });

      describe("and using Javascript validations", () => {
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
                validate={jsValidateUsername}
              />
              <ValidatedTextbox
                label="Email"
                name="email"
                validate={jsValidateEmail}
              />
            </ValidatedForm>
          );
        });

        test("displaying validation errors when a field is touched and left empty", async () => {
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

        test("displaying validation errors on attempted submission", async () => {
          expect(screen.queryByText("Username is required")).toBeNull();
          expect(screen.queryByText("Email is required")).toBeNull();
          expect(screen.queryByText("2 errors")).toBeNull();

          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();
          expect(screen.getByText("Email is required")).toBeInTheDocument();
          expect(screen.getByText("2 errors")).toBeInTheDocument();
        });

        test("updating the form and submitting values", async () => {
          const username = screen.getByLabelText("Username");
          const email = screen.getByLabelText("Email");

          await act(async () => {
            await user.click(username);
            await user.type(username, "Jonathan");
            await user.click(email);
            await user.type(email, "jonathan.meaney@sage.com");
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(onSubmit).toHaveBeenCalledWith({
            email: "jonathan.meaney@sage.com",
            username: "Jonathan",
          });
        });
      });
    });

    describe("with form validation", () => {
      describe("and using Yup validationSchema", () => {
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

        test("displaying validation errors when a field is touched and left empty", async () => {
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

        test("displaying validation errors on attempted submission", async () => {
          expect(screen.queryByText("Username is required")).toBeNull();
          expect(screen.queryByText("Email is required")).toBeNull();
          expect(screen.queryByText("2 errors")).toBeNull();

          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();
          expect(screen.getByText("Email is required")).toBeInTheDocument();
          expect(screen.getByText("2 errors")).toBeInTheDocument();
        });

        test("updating the form and submitting values", async () => {
          const username = screen.getByLabelText("Username");
          const email = screen.getByLabelText("Email");

          await act(async () => {
            await user.click(username);
            await user.type(username, "Jonathan");
            await user.click(email);
            await user.type(email, "jonathan.meaney@sage.com");
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(onSubmit).toHaveBeenCalledWith({
            email: "jonathan.meaney@sage.com",
            username: "Jonathan",
          });
        });
      });

      describe("and using Javascript validate", () => {
        beforeEach(() => {
          customRender(
            <ValidatedForm
              validateOnBlur
              initialValues={initialValues}
              validate={validate}
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

        test("displaying validation errors when a field is touched and left empty", async () => {
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

        test("displaying validation errors on attempted submission", async () => {
          expect(screen.queryByText("Username is required")).toBeNull();
          expect(screen.queryByText("Email is required")).toBeNull();
          expect(screen.queryByText("2 errors")).toBeNull();

          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();
          expect(screen.getByText("Email is required")).toBeInTheDocument();
          expect(screen.getByText("2 errors")).toBeInTheDocument();
        });

        test("updating the form and submitting values", async () => {
          const username = screen.getByLabelText("Username");
          const email = screen.getByLabelText("Email");

          await act(async () => {
            await user.click(username);
            await user.type(username, "Jonathan");
            await user.click(email);
            await user.type(email, "jonathan.meaney@sage.com");
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(onSubmit).toHaveBeenCalledWith({
            email: "jonathan.meaney@sage.com",
            username: "Jonathan",
          });
        });
      });
    });
  });

  describe("when validateOnSubmit", () => {
    describe("with per input validation", () => {
      describe("and using Yup validations", () => {
        beforeEach(() => {
          customRender(
            <ValidatedForm
              validateOnSubmit
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
                validate={yupValidateUsername}
              />
              <ValidatedTextbox
                label="Email"
                name="email"
                validate={yupValidateEmail}
              />
            </ValidatedForm>
          );
        });

        test("not displaying validation errors when a field is touched and left empty", async () => {
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

          expect(screen.queryByText("Username is required")).toBeNull();
          expect(screen.queryByText("Email is required")).toBeNull();
          expect(screen.queryByText("2 errors")).toBeNull();
        });

        test("displaying validation errors on attempted submission", async () => {
          expect(screen.queryByText("Username is required")).toBeNull();
          expect(screen.queryByText("Email is required")).toBeNull();
          expect(screen.queryByText("2 errors")).toBeNull();

          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();
          expect(screen.getByText("Email is required")).toBeInTheDocument();
          expect(screen.getByText("2 errors")).toBeInTheDocument();
        });

        test("updating the form and submitting values", async () => {
          const username = screen.getByLabelText("Username");
          const email = screen.getByLabelText("Email");

          await act(async () => {
            await user.click(username);
            await user.type(username, "Jonathan");
            await user.click(email);
            await user.type(email, "jonathan.meaney@sage.com");
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(onSubmit).toHaveBeenCalledWith({
            email: "jonathan.meaney@sage.com",
            username: "Jonathan",
          });
        });
      });

      describe("and using Javascript validations", () => {
        beforeEach(() => {
          customRender(
            <ValidatedForm
              validateOnSubmit
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
                validate={jsValidateUsername}
              />
              <ValidatedTextbox
                label="Email"
                name="email"
                validate={jsValidateEmail}
              />
            </ValidatedForm>
          );
        });

        test("not displaying validation errors when a field is touched and left empty", async () => {
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

          expect(screen.queryByText("Username is required")).toBeNull();
          expect(screen.queryByText("Email is required")).toBeNull();
          expect(screen.queryByText("2 errors")).toBeNull();
        });

        test("displaying validation errors on attempted submission", async () => {
          expect(screen.queryByText("Username is required")).toBeNull();
          expect(screen.queryByText("Email is required")).toBeNull();
          expect(screen.queryByText("2 errors")).toBeNull();

          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();
          expect(screen.getByText("Email is required")).toBeInTheDocument();
          expect(screen.getByText("2 errors")).toBeInTheDocument();
        });

        test("updating the form and submitting values", async () => {
          const username = screen.getByLabelText("Username");
          const email = screen.getByLabelText("Email");

          await act(async () => {
            await user.click(username);
            await user.type(username, "Jonathan");
            await user.click(email);
            await user.type(email, "jonathan.meaney@sage.com");
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(onSubmit).toHaveBeenCalledWith({
            email: "jonathan.meaney@sage.com",
            username: "Jonathan",
          });
        });
      });
    });

    describe("with form validation", () => {
      describe("and using Yup validationSchema", () => {
        beforeEach(() => {
          customRender(
            <ValidatedForm
              validateOnSubmit
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

        test("not displaying validation errors when a field is touched and left empty", async () => {
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

          expect(screen.queryByText("Username is required")).toBeNull();
          expect(screen.queryByText("Email is required")).toBeNull();
          expect(screen.queryByText("2 errors")).toBeNull();
        });

        test("displaying validation errors on attempted submission", async () => {
          expect(screen.queryByText("Username is required")).toBeNull();
          expect(screen.queryByText("Email is required")).toBeNull();
          expect(screen.queryByText("2 errors")).toBeNull();

          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();
          expect(screen.getByText("Email is required")).toBeInTheDocument();
          expect(screen.getByText("2 errors")).toBeInTheDocument();
        });

        test("updating the form and submitting values", async () => {
          const username = screen.getByLabelText("Username");
          const email = screen.getByLabelText("Email");

          await act(async () => {
            await user.click(username);
            await user.type(username, "Jonathan");
            await user.click(email);
            await user.type(email, "jonathan.meaney@sage.com");
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(onSubmit).toHaveBeenCalledWith({
            email: "jonathan.meaney@sage.com",
            username: "Jonathan",
          });
        });
      });

      describe("and using Javascript validate", () => {
        beforeEach(() => {
          customRender(
            <ValidatedForm
              validateOnSubmit
              initialValues={initialValues}
              validate={validate}
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

        test("not displaying validation errors when a field is touched and left empty", async () => {
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

          expect(screen.queryByText("Username is required")).toBeNull();
          expect(screen.queryByText("Email is required")).toBeNull();
          expect(screen.queryByText("2 errors")).toBeNull();
        });

        test("displaying validation errors on attempted submission", async () => {
          expect(screen.queryByText("Username is required")).toBeNull();
          expect(screen.queryByText("Email is required")).toBeNull();
          expect(screen.queryByText("2 errors")).toBeNull();

          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();
          expect(screen.getByText("Email is required")).toBeInTheDocument();
          expect(screen.getByText("2 errors")).toBeInTheDocument();
        });

        test("updating the form and submitting values", async () => {
          const username = screen.getByLabelText("Username");
          const email = screen.getByLabelText("Email");

          await act(async () => {
            await user.click(username);
            await user.type(username, "Jonathan");
            await user.click(email);
            await user.type(email, "jonathan.meaney@sage.com");
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(onSubmit).toHaveBeenCalledWith({
            email: "jonathan.meaney@sage.com",
            username: "Jonathan",
          });
        });
      });
    });
  });

  describe("when validateOnSubmit using withSummary", () => {
    beforeEach(() => {
      customRender(
        <ValidatedForm
          validateOnSubmit
          withSummary
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
            validate={yupValidateUsername}
          />
          <ValidatedTextbox
            label="Email"
            name="email"
            validate={yupValidateEmail}
          />
        </ValidatedForm>
      );
    });

    test("not displaying validation errors when a field is touched and left empty", async () => {
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

      expect(screen.queryByText("Username is required")).toBeNull();
      expect(screen.queryByText("Email is required")).toBeNull();
      expect(screen.queryByText("2 errors")).toBeNull();
    });

    test("displaying validation errors on attempted submission", async () => {
      expect(screen.queryByText("Username is required")).toBeNull();
      expect(screen.queryByText("Email is required")).toBeNull();
      expect(screen.queryByText("2 errors")).toBeNull();

      await act(async () => {
        const saveButton = screen.getByRole("button", { name: "Save" });
        await user.click(saveButton);
      });

      expect(screen.getByText("Username is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("2 errors")).toBeInTheDocument();
    });

    test("displaying validation summary on attempted submission", async () => {
      await act(async () => {
        const saveButton = screen.getByRole("button", { name: "Save" });
        await user.click(saveButton);
      });
      screen.debug();
    });
  });

  describe("when validateOnBlur with nested initialValues", () => {
    beforeEach(() => {
      customRender(
        <ValidatedForm
          validateOnBlur
          initialValues={nestedInitialValues}
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
            validate={yupValidateUsername}
          />
          <ValidatedTextbox
            label="Email"
            name="personalDetails.email"
            validate={yupValidateEmail}
          />
        </ValidatedForm>
      );
    });

    test("displaying validation errors when a field is touched and left empty", async () => {
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

    test("updating the form and submitting values", async () => {
      const username = screen.getByLabelText("Username");
      const email = screen.getByLabelText("Email");

      await act(async () => {
        await user.click(username);
        await user.type(username, "Jonathan");
        await user.click(email);
        await user.type(email, "jonathan.meaney@sage.com");
        const saveButton = screen.getByRole("button", { name: "Save" });
        await user.click(saveButton);
      });

      expect(onSubmit).toHaveBeenCalledWith({
        email: "jonathan.meaney@sage.com",
        username: "Jonathan",
      });
    });
  });
});
