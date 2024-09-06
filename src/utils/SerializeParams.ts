import qs from 'qs';

export const serializeParams = (params: Record<string, any>): string => {
  const serializedParams = Object.keys(params).reduce(
    (acc, key) => {
      const value = params[key];
      if (Array.isArray(value)) {
        acc[key] = value.join(',');
      } else {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  return qs.stringify(serializedParams, { encode: false });
};
