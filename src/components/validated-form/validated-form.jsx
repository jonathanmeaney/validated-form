import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";

import Form from "carbon-react/lib/components/form";

import { touchedErrors } from "./utils";
import ValidationSummary from "./validation-summary";
import { ValidatedFormContextProvider } from "./validated-form-context";

const withContext = (Component) => {
  return (props) => {
    return (
      <ValidatedFormContextProvider>
        <Component {...props} />
      </ValidatedFormContextProvider>
    );
  };
};

const ValidatedForm = ({
  initialValues,
  validationSchema,
  validateOnChange,
  validateOnBlur,
  validateOnMount,
  validateOnSubmit,
  onSubmit,
  children,
  withSummary,
  saveButton,
  ...formProps
}) => {
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const customSaveButton = () => {
    const originalOnClick = saveButton.props.onClick;

    const combinedOnClick = (e) => {
      setAttemptedSubmit(true);

      if (originalOnClick) {
        originalOnClick(e);
      }
    };

    return React.cloneElement(saveButton, {
      disabled: attemptedSubmit,
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, { validateForm }) => {
        console.log("submitting");
        // Validate the form one last time
        if (await validateForm()) {
          onSubmit(values);
        }
      }}
      validationSchema={validationSchema}
      validateOnChange={!validateOnSubmit && validateOnChange}
      validateOnBlur={!validateOnSubmit && validateOnBlur}
      validateOnMount={!validateOnSubmit && validateOnMount}
    >
      {({ handleSubmit, touched, errors }) => {
        const { errorCount, errorMessages } = touchedErrors(touched, errors);
        return (
          <>
            {withSummary && (
              <ValidationSummary
                errorCount={errorCount}
                errorMessages={errorMessages}
              />
            )}
            <Form
              {...formProps}
              saveButton={customSaveButton()}
              onSubmit={handleSubmit}
              errorCount={errorCount}
            >
              {children}
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

ValidatedForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  validationSchema: PropTypes.object,
  validateOnChange: PropTypes.bool,
  validateOnBlur: PropTypes.bool,
  validateOnMount: PropTypes.bool,
  validateOnSubmit: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  withSummary: PropTypes.bool,
};

ValidatedForm.defaultProps = {
  validateOnChange: false,
  validateOnBlur: true,
  validateOnMount: false,
  validateOnSubmit: false,
  withSummary: false,
};

ValidatedForm.displayName = "ValidatedForm";

export default withContext(ValidatedForm);
