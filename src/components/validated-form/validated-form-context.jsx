import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";

const initialState = {
  inputRefs: {},
  validateOnMount: false,
  validateOnBlur: false,
  validateOnChange: false,
  validateOnSubmit: false,
};

export const actions = {
  REGISTER_INPUT_REF: "REGISTER_INPUT_REF",
  DEREGISTER_INPUT_REF: "DEREGISTER_INPUT_REF",
};

const validatedFormReducer = (state, action) => {
  switch (action.type) {
    case actions.REGISTER_INPUT_REF: {
      const { name, value } = action.payload;
      const inputRefs = {
        ...state.inputRefs,
        [name]: value,
      };

      return {
        ...state,
        inputRefs,
      };
    }
    case actions.DEREGISTER_INPUT_REF: {
      const { name } = action.payload;
      const inputRefs = {
        ...state.inputRefs,
      };

      delete inputRefs[name];

      return {
        ...state,
        inputRefs,
      };
    }
    default:
      return { ...state };
  }
};

const ValidatedFormContext = createContext({
  ...initialState,
  registerInputRef: () => {},
  deregisterInputRef: () => {},
});

// Custom hook to access validatedForm context value
const useValidatedForm = () => useContext(ValidatedFormContext);

const ContextProvider = ({
  initialState: propsInitialState,
  children,
  validateOnMount,
  validateOnBlur,
  validateOnChange,
  validateOnSubmit,
}) => {
  const updatedInitialState = {
    ...initialState,
    ...propsInitialState,
    validateOnMount,
    validateOnBlur,
    validateOnChange,
    validateOnSubmit,
  };

  const [state, dispatch] = useReducer(
    validatedFormReducer,
    updatedInitialState,
  );

  const registerInputRef = useCallback((name, inputRef) => {
    dispatch({
      type: actions.REGISTER_INPUT_REF,
      payload: { name, value: inputRef },
    });
  }, []);

  const deregisterInputRef = useCallback((name) => {
    dispatch({
      type: actions.DEREGISTER_INPUT_REF,
      payload: { name },
    });
  }, []);

  console.log({ state });
  // use useMemo for context value to prevent
  // needless rerenders.
  const value = useMemo(() => {
    return {
      ...state,
      registerInputRef,
      deregisterInputRef,
    };
  }, [state, registerInputRef]);

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
  validateOnMount: PropTypes.bool,
  validateOnBlur: PropTypes.bool,
  validateOnChange: PropTypes.bool,
  validateOnSubmit: PropTypes.bool,
};

ContextProvider.defaultProps = {
  initialState: {},
  validateOnMount: false,
  validateOnBlur: false,
  validateOnChange: false,
  validateOnSubmit: false,
};

const ValidatedFormContextProvider = ContextProvider;

ValidatedFormContext.displayName = "ValidatedFormContext";

export { ValidatedFormContext, ValidatedFormContextProvider, useValidatedForm };
