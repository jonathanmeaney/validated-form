import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { Formik } from "formik";

import Form from "carbon-react/lib/components/form";
import Message from "carbon-react/lib/components/message";
import Typography from "carbon-react/lib/components/typography";
import Link from "carbon-react/lib/components/link";

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

const extractMessages = (validationProps) => {
  const errors = {};
  const warnings = {};

  for (const [key, value] of Object.entries(validationProps)) {
    if (value.error) {
      if (!errors[key]) {
        errors[key] = [];
      }
      errors[key].push(value.error);
    }
    if (value.warning) {
      if (!warnings[key]) {
        warnings[key] = [];
      }
      warnings[key].push(value.warning);
    }
  }

  return { errors, warnings };
};

const MessagesList = ({ messages }) => {
  return (
    <div>
      {Object.entries(messages).map(([key, value]) => (
        <div key={key}>
          <Link href={`#${key}`}>{key}</Link>
          {value.length > 0 && (
            <>
              <ul>
                {value.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const ValidationSummary = ({ errorCount, validationProps }) => {
  if (isEmpty(validationProps)) {
    return false;
  }

  const { errors } = extractMessages(validationProps);

  const errorMessages = errorCount > 0 && (
    <Message
      variant="error"
      open
      mb={5}
      title={
        <Typography
          variant="h4"
          mb={2}
        >{`Please fix ${errorCount} errors`}</Typography>
      }
    >
      <MessagesList messages={errors} />
    </Message>
  );

  return <>{errorMessages}</>;
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
  ...formProps
}) => {
  const { warningCount, errorCount, validationProps } = useValidatedForm();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, { validateForm }) => {
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
      {({ handleSubmit }) => {
        return (
          <>
            <ValidationSummary
              errorCount={errorCount}
              validationProps={validationProps}
            />
            <Form
              {...formProps}
              onSubmit={handleSubmit}
              warningCount={warningCount}
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
};

ValidatedForm.defaultProps = {
  validateOnChange: false,
  validateOnBlur: true,
  validateOnMount: false,
  validateOnSubmit: false,
};

ValidatedForm.displayName = "ValidatedForm";

export default withContext(ValidatedForm);
