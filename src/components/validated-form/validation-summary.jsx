import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";
import { isEmpty } from "lodash";
import styled from "styled-components";

import Message from "carbon-react/lib/components/message";
import Typography from "carbon-react/lib/components/typography";
import Link from "carbon-react/lib/components/link";

import { useValidatedForm } from "./validated-form-context";

import "./i18n.js";

const i18nScope = "validated_form.validation_summary";

const LinkRow = styled.div`
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ErrorMessagesList = ({ errorMessages }) => {
  const { inputRefs } = useValidatedForm();

  const list = Object.entries(errorMessages).map(([key, value]) => {
    const focus = () => {
      const ref = inputRefs[key]?.current;

      /* istanbul ignore next */
      if (ref) {
        ref.focus();
        ref.scrollIntoView({ behavior: "auto", block: "center" });
      }
    };

    return (
      <LinkRow key={key}>
        <Link variant="negative" onClick={focus}>
          {value}
        </Link>
      </LinkRow>
    );
  });

  return (
    <div
      data-testid="validation-errors-list"
      data-role="validation-errors-list"
    >
      {list}
    </div>
  );
};

const ValidationSummary = ({
  errorCount,
  errorMessages,
  summaryTitle,
  submitCount,
}) => {
  const summaryRef = useRef(null);

  useEffect(() => {
    const ref = summaryRef?.current;

    /* istanbul ignore next */
    if (ref && errorCount > 0) {
      ref.focus();
      ref.scrollIntoView({ behavior: "auto", block: "center" });
    }
  }, [errorCount, submitCount]);

  if (isEmpty(errorMessages)) {
    return false;
  }
  const title =
    summaryTitle || I18n.t(`${i18nScope}.title`, { count: errorCount });
  const message = (
    <Message
      variant="error"
      open
      mb={5}
      data-role="validation-summary"
      id="validation-summary"
      title={
        <Typography variant="b" mb={2}>
          {title}
        </Typography>
      }
      ref={summaryRef}
    >
      <ErrorMessagesList errorMessages={errorMessages} />
    </Message>
  );

  return message;
};

ValidationSummary.propTypes = {
  errorCount: PropTypes.number,
  submitCount: PropTypes.number,
  errorMessages: PropTypes.object,
  summaryTitle: PropTypes.string,
};

ValidationSummary.displayName = "ValidationSummary";

export default ValidationSummary;
