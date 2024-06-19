import React from "react";
import { Field, useFormikContext } from "formik";

import { getObjectValue } from "./utils";

const useField = (Component, props) => {
  const { values } = useFormikContext();
  const { name: fieldName } = props;
  const fieldValue = getObjectValue(values, fieldName) || "";

  return <Field as={Component} value={fieldValue} {...props} />;
};

export default useField;
