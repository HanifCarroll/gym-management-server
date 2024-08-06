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
  data: T | T[] | null;
  error: any;
} {
  if (result.error) {
    return { data: null, error: result.error };
  }

  if (!result.data) {
    return { data: null, error: null };
  }

  if (Array.isArray(result.data)) {
    return {
      data: result.data.map(
        (item) => snakeToCamelCase(item as Record<string, any>) as T,
      ),
      error: null,
    };
  }

  return {
    data: snakeToCamelCase(result.data as Record<string, any>) as T,
    error: null,
  };
}
