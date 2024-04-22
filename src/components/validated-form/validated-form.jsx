/* eslint-disable react/jsx-props-no-spreading */
import React, { cloneElement } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";

import Form from "carbon-react/lib/components/form";

import { touchedErrors } from "./utils";
import ValidationSummary from "./validation-summary";
import { ValidatedFormContextProvider } from "./validated-form-context";

const CustomSaveButton = ({ onClick, saveButton }) =>
  cloneElement(saveButton, {
    onClick: () => onClick && onClick(),
  });

const ValidatedForm = ({
  initialValues,
  validationSchema,
  validateOnChange = false,
  validateOnBlur = false,
  validateOnMount = false,
  validateOnSubmit = false,
  validate,
  onSubmit,
  children,
  withSummary = false,
  summaryTitle,
  saveButton,
  ...formProps
}) => {
  const key = JSON.stringify(initialValues);
  return (
    <ValidatedFormContextProvider
      validateOnMount={validateOnMount}
      validateOnBlur={validateOnBlur}
      validateOnChange={validateOnChange}
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
          if (isValid) onSubmit(values);
        }}
        validationSchema={validationSchema}
        validateOnChange={!validateOnSubmit && validateOnChange}
        validateOnBlur={!validateOnSubmit && validateOnBlur}
        validateOnMount={!validateOnSubmit && validateOnMount}
        validate={validate}
      >
        {({ handleSubmit, touched, errors, values, submitCount }) => {
          console.log("rendering");
          console.log({ touched, errors, values });
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
                saveButton={
                  <CustomSaveButton
                    onClick={saveButton?.onClick}
                    saveButton={saveButton}
                  />
                }
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
