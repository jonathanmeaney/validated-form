import React, {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import { isEqual } from "lodash";
import PropTypes from "prop-types";

const initialState = {
  initialValues: {},
  touched: {},
  values: {},
};

export const actions = {
  SET_STATE: "SET_STATE",
  REGISTER_INPUT: "REGISTER_INPUT",
};

const validatedFormReducer = (state, action) => {
  switch (action.type) {
    case actions.SET_STATE: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case actions.REGISTER_INPUT: {
      const { name, value } = action.payload;
      const initialValues = {
        ...state.initialValues,
        [name]: value,
      };

      return {
        ...state,
        initialValues,
      };
    }
    default:
      return { ...state };
  }
};

const ValidatedFormContext = createContext({
  ...initialState,
  setValidatedFormState: () => {},
  registerInput: () => {},
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
    updatedInitialState,
  );

  const setValidatedFormState = useCallback((newState) => {
    dispatch({
      type: actions.SET_STATE,
      payload: newState,
    });
  }, []);

  const registerInput = useCallback((inputDetails) => {
    dispatch({
      type: actions.REGISTER_INPUT,
      payload: inputDetails,
    });
  }, []);

  console.log(state);

  // use useMemo for context value to prevent
  // needless rerenders.
  const value = useMemo(() => {
    return {
      ...state,
      setValidatedFormState,
      registerInput,
    };
  }, [state, setValidatedFormState, registerInput]);

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
