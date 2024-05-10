import { cloneDeep } from "lodash";

export const touchedErrors = (touched, errors) => {
  const flattenedTouched = flatten(touched);
  const flattenedErrors = flatten(errors);
  let errorCount = 0;
  let errorMessages = {};

  for (const [key, value] of Object.entries(flattenedTouched)) {
    /* istanbul ignore next */
    if (value) {
      const errorValue = flattenedErrors[key];

      if (errorValue) {
        errorMessages[key] = flattenedErrors[key];
        errorCount++;
      }
    }
  }

  return {
    errorCount,
    errorMessages,
  };
};

// Is a NumericDateObject
const isDateObject = (obj) => {
  const keys = Object.keys(obj);
  const dateKeys = ["dd", "mm", "yyyy"];
  return keys.length === 3 && dateKeys.every((key) => keys.includes(key));
};

export const flatten = (obj) => {
  let result = {};

  const recursiveFlatten = (item, path = "") => {
    for (const key in item) {
      // Construct the full path to the current key
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof item[key] === "object" && !isDateObject(item[key])) {
        recursiveFlatten(item[key], currentPath);
      } else {
        result[currentPath] = item[key];
      }
    }
  };

  recursiveFlatten(obj);
  return result;
};

// Get the value from the object using dot notation e.g. 'a.b.c.d'
export const getObjectValue = (obj, path) => {
  /* istanbul ignore next */
  if (!path) {
    return undefined;
  }

  const parts = path.split(".");
  let current = obj;

  for (let part of parts) {
    if (current[part] === undefined) {
      return undefined;
    }
    current = current[part];
  }

  return current;
};

export const removeObjectField = (obj, path) => {
  /* istanbul ignore next */
  if (!path) {
    return obj;
  }

  const parts = path.split(".");
  const newObj = cloneDeep(obj);
  let current = newObj;

  // Navigate to the second to last part of the path
  for (let i = 0; i < parts.length - 1; i++) {
    let part = parts[i];
    /* istanbul ignore next */
    if (current[part] === undefined) {
      return obj; // Return the original object if the path is invalid
    }
    // Make a shallow copy at each level
    current[part] = { ...current[part] };
    current = current[part];
  }

  // Delete the last part of the path if it exists
  const lastPart = parts[parts.length - 1];
  if (current[lastPart] !== undefined) {
    delete current[lastPart];
  }

  return newObj;
};

// Check if the path is present in the object
export const hasKey = (obj, path) => {
  /* istanbul ignore next */
  if (!path) {
    return false;
  }

  const parts = path.split(".");
  let current = obj;

  for (let part of parts) {
    /* istanbul ignore next */
    if (current[part] === undefined) {
      return false;
    }
    current = current[part];
  }

  return true;
};

export const getValue = ({ target: { value, type, checked } }) => {
  if (type === "checkbox") {
    return checked;
  }

  if (value.formattedValue !== undefined) {
    return value.formattedValue;
  }

  return value;
};
