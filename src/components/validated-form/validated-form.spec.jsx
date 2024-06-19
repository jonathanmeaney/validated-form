import React, { useState } from "react";
import { render, screen, act, within } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import * as Yup from "yup";
import CarbonProvider from "carbon-react/lib/components/carbon-provider";
import sageTheme from "carbon-react/lib/style/themes/sage";

import Button from "carbon-react/lib/components/button";
import Switch from "carbon-react/lib/components/switch";

import ValidatedForm, {
  ValidatedTextbox,
  Textbox,
  RadioButton,
  ValidatedRadioButtonGroup,
} from "./index.jsx";

const mockScrollIntoView = jest.fn();
window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

const customRender = async (ui) => {
  render(
    <CarbonProvider theme={sageTheme} validationRedesignOptIn>
      {ui}
    </CarbonProvider>
  );
};

const DynamicExample = ({ onSubmit }) => {
  const [includePhone, setIncludePhone] = useState(false);

  const handleSwitch = (e) => {
    setIncludePhone(e.target.checked);
  };

  const initialValues = () => {
    if (includePhone) {
      return { username: "", email: "", phone: "" };
    }

    return { username: "", email: "" };
  };

  return (
    <ValidatedForm
      validateOnBlur
      leftSideButtons={<Button buttonType="tertiary">Cancel</Button>}
      saveButton={
        <Button buttonType="primary" type="submit">
          Save
        </Button>
      }
      onSubmit={onSubmit}
      initialValues={initialValues()}
    >
      <ValidatedTextbox
        label="Username"
        labelInline
        name="username"
        required
        validate={Yup.string().required("Username is required")}
      />
      <ValidatedTextbox
        label="Email"
        labelInline
        name="email"
        required
        validate={Yup.string().required("Email is required")}
      />
      <Switch
        checked={includePhone}
        value={String(includePhone)}
        onChange={handleSwitch}
        label="include phone?"
      />
      {includePhone && (
        <ValidatedTextbox
          label="Phone"
          labelInline
          name="phone"
          required
          validate={Yup.string().required("Phone is required")}
        />
      )}
    </ValidatedForm>
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

  afterEach(() => {
    jest.clearAllMocks();
  });

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
        <Textbox label="Hint" name="hint" />
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
          expect(onSubmit).not.toHaveBeenCalled();
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
          expect(onSubmit).not.toHaveBeenCalled();
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
          expect(onSubmit).not.toHaveBeenCalled();
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
          expect(onSubmit).not.toHaveBeenCalled();
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
          expect(onSubmit).not.toHaveBeenCalled();
        });

        test("validations only run on submit", async () => {
          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();

          const username = screen.getByLabelText("Username");

          await act(async () => {
            await user.click(username);
            await user.type(username, "Jonathan");
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();

          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.queryByText("Username is required")).toBeNull();
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
          expect(onSubmit).not.toHaveBeenCalled();
        });

        test("validations only run on submit", async () => {
          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();

          const username = screen.getByLabelText("Username");

          await act(async () => {
            await user.click(username);
            await user.type(username, "Jonathan");
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();

          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.queryByText("Username is required")).toBeNull();
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
          expect(onSubmit).not.toHaveBeenCalled();
        });

        test("validations only run on submit", async () => {
          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();

          const username = screen.getByLabelText("Username");

          await act(async () => {
            await user.click(username);
            await user.type(username, "Jonathan");
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();

          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.queryByText("Username is required")).toBeNull();
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
          expect(onSubmit).not.toHaveBeenCalled();
        });

        test("validations only run on submit", async () => {
          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();

          const username = screen.getByLabelText("Username");

          await act(async () => {
            await user.click(username);
            await user.type(username, "Jonathan");
          });

          expect(screen.getByText("Username is required")).toBeInTheDocument();

          await act(async () => {
            const saveButton = screen.getByRole("button", { name: "Save" });
            await user.click(saveButton);
          });

          expect(screen.queryByText("Username is required")).toBeNull();
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
    let form, summary;
    beforeEach(() => {
      customRender(
        <ValidatedForm
          validateOnSubmit
          withSummary
          initialValues={initialValues}
          onSubmit={onSubmit}
          data-testid="test-form"
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

      form = screen.getByTestId("test-form");
    });

    test("not displaying validation errors when a field is touched and left empty", async () => {
      expect(within(form).queryByText("Username is required")).toBeNull();
      expect(within(form).queryByText("Email is required")).toBeNull();
      expect(within(form).queryByText("2 errors")).toBeNull();
      expect(screen.queryByTestId("validation-summary")).toBeNull();

      // Blur each field
      const username = within(form).getByLabelText("Username");
      const email = within(form).getByLabelText("Email");

      await act(async () => {
        await user.click(username);
        await user.click(email);
        await user.click(username);
      });

      expect(within(form).queryByText("Username is required")).toBeNull();
      expect(within(form).queryByText("Email is required")).toBeNull();
      expect(within(form).queryByText("2 errors")).toBeNull();
      expect(screen.queryByTestId("validation-summary")).toBeNull();
    });

    test("displaying validation errors on attempted submission", async () => {
      expect(within(form).queryByText("Username is required")).toBeNull();
      expect(within(form).queryByText("Email is required")).toBeNull();
      expect(within(form).queryByText("2 errors")).toBeNull();
      expect(screen.queryByTestId("validation-summary")).toBeNull();

      await act(async () => {
        const saveButton = screen.getByRole("button", { name: "Save" });
        await user.click(saveButton);
      });

      expect(
        within(form).getByText("Username is required")
      ).toBeInTheDocument();
      expect(within(form).getByText("Email is required")).toBeInTheDocument();
      expect(within(form).getByText("2 errors")).toBeInTheDocument();
      expect(screen.queryByTestId("validation-summary")).toBeInTheDocument();
    });

    test("displaying validation summary on attempted submission", async () => {
      expect(screen.queryByTestId("validation-summary")).toBeNull();

      await act(async () => {
        const saveButton = screen.getByRole("button", { name: "Save" });
        await user.click(saveButton);
      });

      summary = screen.queryByTestId("validation-summary");
      expect(summary).toBeInTheDocument();
      expect(
        within(summary).getByText("There are 2 errors")
      ).toBeInTheDocument();
      expect(
        within(summary).getByText("Username is required")
      ).toBeInTheDocument();
      expect(
        within(summary).getByText("Email is required")
      ).toBeInTheDocument();
    });

    test("clicking error to scroll to and focus field", async () => {
      expect(screen.queryByTestId("validation-summary")).toBeNull();

      await act(async () => {
        const saveButton = screen.getByRole("button", { name: "Save" });
        await user.click(saveButton);
      });

      summary = screen.queryByTestId("validation-summary");

      await act(async () => {
        const usernameLink = within(summary).getByText("Username is required");
        await user.click(usernameLink);
      });

      const username = within(form).getByLabelText("Username");
      expect(username).toHaveFocus();
      expect(mockScrollIntoView).toHaveBeenCalled();
    });
  });

  describe("when using a ValidatedRadioButtonGroup", () => {
    let form, summary;
    beforeEach(() => {
      customRender(
        <ValidatedForm
          validateOnSubmit
          withSummary
          initialValues={initialValues}
          onSubmit={onSubmit}
          data-testid="test-form"
          saveButton={
            <Button buttonType="primary" type="submit">
              Save
            </Button>
          }
        >
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
        </ValidatedForm>
      );

      form = screen.getByTestId("test-form");
    });

    test("clicking error to scroll to the field", async () => {
      expect(screen.queryByTestId("validation-summary")).toBeNull();

      await act(async () => {
        const saveButton = screen.getByRole("button", { name: "Save" });
        await user.click(saveButton);
      });

      summary = screen.queryByTestId("validation-summary");

      await act(async () => {
        const accountTypeLink = within(summary).getByText(
          "Account Type is required"
        );
        await user.click(accountTypeLink);
      });

      expect(mockScrollIntoView).toHaveBeenCalled();
    });
  });

  describe("when using a nested initialValues", () => {
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
        username: "Jonathan",
        personalDetails: {
          email: "jonathan.meaney@sage.com",
        },
      });
    });
  });

  describe("when using a dynamic initialValues and inputs", () => {
    beforeEach(() => {
      customRender(<DynamicExample onSubmit={onSubmit} />);
    });

    test("rendering the form with all fields", () => {
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByText("include phone?")).toBeInTheDocument();
      expect(screen.queryByLabelText("Phone Number")).toBeNull();
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    describe("when not including dynamic fields", () => {
      test("displaying validation errors when a field is touched and left empty", async () => {
        expect(screen.queryByText("Username is required")).toBeNull();
        expect(screen.queryByText("Email is required")).toBeNull();
        expect(screen.queryByText("Phone is required")).toBeNull();
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
        expect(screen.queryByText("Phone is required")).toBeNull();
        expect(screen.getByText("2 errors")).toBeInTheDocument();
      });

      test("displaying validation errors on attempted submission", async () => {
        expect(screen.queryByText("Username is required")).toBeNull();
        expect(screen.queryByText("Email is required")).toBeNull();
        expect(screen.queryByText("Phone is required")).toBeNull();
        expect(screen.queryByText("2 errors")).toBeNull();

        await act(async () => {
          const saveButton = screen.getByRole("button", { name: "Save" });
          await user.click(saveButton);
        });

        expect(screen.getByText("Username is required")).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.queryByText("Phone is required")).toBeNull();
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

    describe("when including dynamic fields", () => {
      beforeEach(async () => {
        const includePhone = screen.getByRole("switch");
        await act(async () => {
          await user.click(includePhone);
        });
      });

      test("displaying validation errors when a field is touched and left empty", async () => {
        expect(screen.queryByText("Username is required")).toBeNull();
        expect(screen.queryByText("Email is required")).toBeNull();
        expect(screen.queryByText("Phone is required")).toBeNull();
        expect(screen.queryByText("3 errors")).toBeNull();

        // Blur each field
        const username = screen.getByLabelText("Username");
        const email = screen.getByLabelText("Email");
        const phone = screen.getByLabelText("Phone");

        await act(async () => {
          await user.click(username);
          await user.click(email);
          await user.click(phone);
          await user.click(username);
        });

        expect(screen.getByText("Username is required")).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.getByText("Phone is required")).toBeInTheDocument();
        expect(screen.getByText("3 errors")).toBeInTheDocument();
      });

      test("displaying validation errors on attempted submission", async () => {
        expect(screen.queryByText("Username is required")).toBeNull();
        expect(screen.queryByText("Email is required")).toBeNull();
        expect(screen.queryByText("Phone is required")).toBeNull();
        expect(screen.queryByText("3 errors")).toBeNull();

        await act(async () => {
          const saveButton = screen.getByRole("button", { name: "Save" });
          await user.click(saveButton);
        });

        expect(screen.getByText("Username is required")).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.getByText("Phone is required")).toBeInTheDocument();
        expect(screen.getByText("3 errors")).toBeInTheDocument();
      });

      test("updating the form and submitting values", async () => {
        const username = screen.getByLabelText("Username");
        const email = screen.getByLabelText("Email");
        const phone = screen.getByLabelText("Phone");

        await act(async () => {
          await user.click(username);
          await user.type(username, "Jonathan");
          await user.click(email);
          await user.type(email, "jonathan.meaney@sage.com");
          await user.click(phone);
          await user.type(phone, "1234567");
          const saveButton = screen.getByRole("button", { name: "Save" });
          await user.click(saveButton);
        });

        expect(onSubmit).toHaveBeenCalledWith({
          email: "jonathan.meaney@sage.com",
          username: "Jonathan",
          phone: "1234567",
        });
      });
    });

    describe("when including dynamic fields validating and then removing dynamic fields", () => {
      test("displaying dynamic validation errors on changing dynamic inputs", async () => {
        // Include phone field
        let includePhone = screen.getByRole("switch");
        await act(async () => {
          await user.click(includePhone);
        });

        expect(screen.queryByText("Username is required")).toBeNull();
        expect(screen.queryByText("Email is required")).toBeNull();
        expect(screen.queryByText("Phone is required")).toBeNull();
        expect(screen.queryByText("3 errors")).toBeNull();

        // Trigger validation on 3 fields
        await act(async () => {
          const saveButton = screen.getByRole("button", { name: "Save" });
          await user.click(saveButton);
        });

        expect(screen.getByText("Username is required")).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.getByText("Phone is required")).toBeInTheDocument();
        expect(screen.getByText("3 errors")).toBeInTheDocument();

        // Exclude phone field
        includePhone = screen.getByRole("switch");
        await act(async () => {
          await user.click(includePhone);
        });

        // Errors update for 2 fields
        expect(screen.getByText("Username is required")).toBeInTheDocument();
        expect(screen.getByText("Email is required")).toBeInTheDocument();
        expect(screen.queryByText("Phone is required")).toBeNull();
        expect(screen.getByText("2 errors")).toBeInTheDocument();
      });
    });
  });
});
