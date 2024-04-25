/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";

import Form from "carbon-react/lib/components/form";

import { touchedErrors } from "./utils";
import ValidationSummary from "./validation-summary";
import { ValidatedFormContextProvider } from "./validated-form-context";

const ValidatedForm = ({
  initialValues,
  validationSchema,
  validateOnChange = true,
  validateOnBlur = true,
  validateOnMount = false,
  validateOnSubmit = false,
  validate,
  onSubmit,
  children,
  withSummary = false,
  summaryTitle,
  ...formProps
}) => {
  const key = JSON.stringify(initialValues);

  let canValidateOnChange = validateOnChange;
  if (validateOnSubmit) {
    canValidateOnChange = false;
  }

  let canValidateOnBlur = validateOnBlur;
  if (validateOnSubmit) {
    canValidateOnBlur = false;
  }

  let canValidateOnMount = validateOnMount;
  if (validateOnSubmit) {
    canValidateOnMount = false;
  }

  return (
    <ValidatedFormContextProvider
      validateOnMount={canValidateOnMount}
      validateOnBlur={canValidateOnChange}
      validateOnChange={canValidateOnChange}
      validateOnSubmit={validateOnSubmit}
    >
      <Formik
        // This prop will cause the fields to update if the initialValues change.
        // enableReinitialize
        // Add key to ensure rerendering if initialValues changes
        // key={key}
        initialValues={initialValues}
        onSubmit={async (values, { validateForm }) => {
          // Validate the form one last time
          const isValid = await validateForm();
          /* istanbul ignore next */
          if (isValid) onSubmit(values);
        }}
        validationSchema={validationSchema}
        validateOnChange={canValidateOnChange}
        validateOnBlur={canValidateOnBlur}
        validateOnMount={canValidateOnMount}
        validate={validate}
      >
        {({ handleSubmit, touched, errors, submitCount }) => {
          const canShowValidationSummary = submitCount > 0 && withSummary;
          const { errorCount, errorMessages } = touchedErrors(touched, errors);
          return (
            <>
              {canShowValidationSummary && (
                <ValidationSummary
                  errorCount={errorCount}
                  errorMessages={errorMessages}
                  summaryTitle={summaryTitle}
                />
              )}
              <Form
                {...formProps}
                onSubmit={handleSubmit}
                errorCount={errorCount}
              >
                {children}
              </Form>
            </>
          );
        }}
      </Formik>
    </ValidatedFormContextProvider>
  );
};

ValidatedForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  validationSchema: PropTypes.object,
  validateOnChange: PropTypes.bool,
  validateOnBlur: PropTypes.bool,
  validateOnMount: PropTypes.bool,
  validateOnSubmit: PropTypes.bool,
  validate: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  saveButton: PropTypes.node,
  withSummary: PropTypes.bool,
  summaryTitle: PropTypes.string,
};

ValidatedForm.displayName = "ValidatedForm";

export default ValidatedForm;
