import { PostgrestResponse } from '@supabase/supabase-js';

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

function snakeToCamelCase(obj: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
      value,
    ]),
  );
}

export function transformSupabaseResult<T>(result: PostgrestResponse<T>): {
  data: T[] | null;
  error: any;
} {
  return {
    data: result.data
      ? result.data.map(
          (item) => snakeToCamelCase(item as Record<string, any>) as T,
        )
      : null,
    error: result.error,
  };
}
