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

export const flatten = (obj) => {
  let result = {};

  const recursiveFlatten = (item, path = "") => {
    for (const key in item) {
      // Construct the full path to the current key
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof item[key] === "object") {
        recursiveFlatten(item[key], currentPath);
      } else {
        result[currentPath] = item[key];
      }
    }
  };

  recursiveFlatten(obj);
  return result;
};
