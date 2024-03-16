import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";

import Form from "carbon-react/lib/components/form";

import {
  ValidatedFormContextProvider,
  useValidatedForm,
} from "./validated-form-context";

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
  onSubmit,
  children,
  ...formProps
}) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, { validateForm, resetForm }) => {
        console.log("submit", values);
        // Validate the form one last time
        if (await validateForm()) {
          resetForm();
          onSubmit(values);
        }
      }}
      validateOnChange={validateOnChange}
      validateOnBlur={validateOnBlur}
      validateOnMount={validateOnMount}
    >
      {({ handleSubmit }) => {
        const warningCount = 0;
        const errorCount = 0;
        return (
          <Form
            {...formProps}
            onSubmit={handleSubmit}
            warningCount={warningCount}
            errorCount={errorCount}
          >
            {children}
          </Form>
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
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

ValidatedForm.defaultProps = {
  validateOnChange: false,
  validateOnBlur: true,
  validateOnMount: false,
};

export default withContext(ValidatedForm);
