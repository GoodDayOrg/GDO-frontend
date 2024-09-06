import qs from 'qs';

export const serializeParams = (
  params: Record<string, string | number | boolean | Date>,
): string => {
  const serializedParams = Object.keys(params).reduce(
    (acc, key) => {
      const value = params[key];
      if (Array.isArray(value)) {
        acc[key] = value.join(',');
      } else {
        acc[key] = String(value);
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  return qs.stringify(serializedParams, { encode: false });
};
