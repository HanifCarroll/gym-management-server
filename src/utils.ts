export function camelToSnakeCase(
  obj: Record<string, any>,
): Record<string, any> {
  return Object.keys(obj).reduce(
    (acc, key) => {
      const newKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      );
      acc[newKey] = obj[key];
      return acc;
    },
    {} as Record<string, any>,
  );
}
