import React, { memo } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";

import Form from "carbon-react/lib/components/form";

import { touchedErrors } from "./utils";
import ValidationSummary from "./validation-summary";
import { ValidatedFormContextProvider } from "./validated-form-context";

const withContext = (Component) =>
  memo((props) => (
    <ValidatedFormContextProvider
      validateOnMount={props.validateOnMount}
      validateOnBlur={props.validateOnBlur || true}
      validateOnChange={props.validateOnChange}
      validateOnSubmit={props.validateOnSubmit}
    >
      <Component {...props} />
    </ValidatedFormContextProvider>
  ));

const CustomSaveButton = ({ onClick, saveButton }) =>
  React.cloneElement(saveButton, {
    onClick: () => onClick && onClick(),
  });

const ValidatedForm = ({
  initialValues,
  validationSchema,
  validateOnChange = false,
  validateOnBlur = true,
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
  return (
    <Formik
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
  withSummary: PropTypes.bool,
  summaryTitle: PropTypes.string,
};

ValidatedForm.displayName = "ValidatedForm";

export default withContext(ValidatedForm);
