/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";

import Form from "carbon-react/lib/components/form";

import { touchedErrors } from "./utils";
import ValidationSummary from "./validation-summary";
import { ValidatedFormContextProvider } from "./validated-form-context";

const ValidatedForm = ({
  enableReinitialize = false,
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
  const canValidateOnChange = validateOnSubmit ? false : validateOnChange;
  const canValidateOnBlur = validateOnSubmit ? false : validateOnBlur;
  const canValidateOnMount = validateOnSubmit ? false : validateOnMount;

  return (
    <ValidatedFormContextProvider
      validateOnMount={validateOnMount}
      validateOnBlur={validateOnBlur}
      validateOnChange={validateOnChange}
      validateOnSubmit={validateOnSubmit}
      hasValidationSchema={validationSchema !== undefined}
      hasValidate={validate !== undefined}
    >
      <Formik
        // This prop will cause the fields to update if the initialValues change.
        enableReinitialize={enableReinitialize}
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
          // Only show the validation summary if the withSummary prop is true and
          // an actual attempt to submit has been made
          const canShowValidationSummary = submitCount > 0 && withSummary;
          // Get the error count and message for any fields that have been touched
          // and have errors
          const { errorCount, errorMessages } = touchedErrors(touched, errors);
          return (
            <>
              {canShowValidationSummary && (
                <ValidationSummary
                  errorCount={errorCount}
                  errorMessages={errorMessages}
                  summaryTitle={summaryTitle}
                  submitCount={submitCount}
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
  enableReinitialize: PropTypes.bool,
  initialValues: PropTypes.object.isRequired,
  validationSchema: PropTypes.object,
  validateOnChange: PropTypes.bool,
  validateOnBlur: PropTypes.bool,
  validateOnMount: PropTypes.bool,
  validateOnSubmit: PropTypes.bool,
  validate: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  withSummary: PropTypes.bool,
  summaryTitle: PropTypes.string,
};

ValidatedForm.displayName = "ValidatedForm";

export default ValidatedForm;
