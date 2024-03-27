import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import { isEqual } from "lodash";
import PropTypes from "prop-types";

const initialState = {
  validationProps: {},
  inputs: [],
  warningCount: 0,
  errorCount: 0,
};

export const actions = {
  SET_STATE: "SET_STATE",
  REGISTER_INPUT: "REGISTER_INPUT",
  RESET_VALIDATION_PROPS: "RESET_VALIDATION_PROPS",
  UPDATE_VALIDATION_PROPS: "UPDATE_VALIDATION_PROPS",
};

const countWarningsAndErrors = (validationProps) => {
  let [warningCount, errorCount] = [0, 0];
  console.log("counting", validationProps);
  Object.entries(validationProps).forEach(([_, value]) => {
    if (value.error) {
      errorCount++;
    }
    if (value.warning) {
      warningCount++;
    }
  });

  return {
    warningCount,
    errorCount,
  };
};

const validatedFormReducer = (state, action) => {
  switch (action.type) {
    case actions.REGISTER_INPUT: {
      const { input } = action.payload;
      const inputs = [...state.inputs, input];

      return {
        ...state,
        inputs,
      };
    }
    case actions.RESET_VALIDATION_PROPS: {
      const { name } = action.payload;
      const validationProps = {
        ...state.validationProps,
      };
      delete validationProps[name];
      const { warningCount, errorCount } =
        countWarningsAndErrors(validationProps);
      return {
        ...state,
        validationProps,
        warningCount,
        errorCount,
      };
    }
    case actions.UPDATE_VALIDATION_PROPS: {
      const { name, value } = action.payload;
      const validationProps = {
        ...state.validationProps,
        [name]: value,
      };

      const { warningCount, errorCount } =
        countWarningsAndErrors(validationProps);

      return {
        ...state,
        validationProps,
        warningCount,
        errorCount,
      };
    }
    default:
      return { ...state };
  }
};

const ValidatedFormContext = createContext({
  ...initialState,
  registerInput: () => {},
  resetValidationProps: () => {},
  updateValidationProps: () => {},
});

// Custom hook to access validatedForm context value
const useValidatedForm = () => useContext(ValidatedFormContext);

const ContextProvider = ({ initialState: propsInitialState, children }) => {
  const updatedInitialState = {
    ...initialState,
    ...propsInitialState,
  };

  const [state, dispatch] = useReducer(
    validatedFormReducer,
    updatedInitialState
  );

  const registerInput = useCallback((input) => {
    dispatch({
      type: actions.REGISTER_INPUT,
      payload: { input },
    });
  }, []);

  const resetValidationProps = useCallback((name) => {
    dispatch({
      type: actions.RESET_VALIDATION_PROPS,
      payload: { name },
    });
  }, []);

  const updateValidationProps = useCallback((name, validationProps) => {
    dispatch({
      type: actions.UPDATE_VALIDATION_PROPS,
      payload: { name, value: validationProps },
    });
  }, []);

  console.log(state);

  // use useMemo for context value to prevent
  // needless rerenders.
  const value = useMemo(() => {
    return {
      ...state,
      updateValidationProps,
      resetValidationProps,
      registerInput,
    };
  }, [state, registerInput, updateValidationProps]);

  return (
    <ValidatedFormContext.Provider value={value}>
      {children}
    </ValidatedFormContext.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  initialState: PropTypes.object,
};

ContextProvider.defaultProps = {
  initialState: {},
};

// Use React.memo to prevent rerenders when unnecessary.
// Unnecessary rerenders can cause the state to reset to default.
/* istanbul ignore next */
const areEqual = (props, nextProps) => {
  return isEqual(props.initialState, nextProps.initialState);
};
const ValidatedFormContextProvider = React.memo(ContextProvider, areEqual);
ValidatedFormContext.displayName = "ValidatedFormContext";
export { ValidatedFormContext, ValidatedFormContextProvider, useValidatedForm };
