import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import styled from "styled-components";

import Message from "carbon-react/lib/components/message";
import Typography from "carbon-react/lib/components/typography";
import Link from "carbon-react/lib/components/link";

import { useValidatedForm } from "./validated-form-context";

const LinkRow = styled.div`
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ErrorMessagesList = ({ errorMessages }) => {
  const { inputRefs } = useValidatedForm();

  return Object.entries(errorMessages).map(([key, value]) => {
    const focus = () => {
      const ref = inputRefs[key]?.current;

      if (ref) {
        ref.focus();
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
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
};

const ValidationSummary = ({ errorCount, errorMessages }) => {
  if (isEmpty(errorMessages)) {
    return false;
  }

  const message = (
    <Message
      variant="error"
      open
      mb={5}
      title={
        <Typography
          variant="b"
          mb={2}
        >{`There are ${errorCount} errors`}</Typography>
      }
    >
      <ErrorMessagesList errorMessages={errorMessages} />
    </Message>
  );

  return <>{message}</>;
};

ValidationSummary.propTypes = {
  errorCount: PropTypes.number,
  errorMessages: PropTypes.object,
};

export default ValidationSummary;
