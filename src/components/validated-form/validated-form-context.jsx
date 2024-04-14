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
  inputRefs: {},
};

export const actions = {
  REGISTER_INPUT_REF: "REGISTER_INPUT_REF",
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
    default:
      return { ...state };
  }
};

const ValidatedFormContext = createContext({
  ...initialState,
  registerInputRef: () => {},
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

  const registerInputRef = useCallback((name, inputRef) => {
    dispatch({
      type: actions.REGISTER_INPUT_REF,
      payload: { name, value: inputRef },
    });
  }, []);

  console.log(state);

  // use useMemo for context value to prevent
  // needless rerenders.
  const value = useMemo(() => {
    return {
      ...state,
      registerInputRef,
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
