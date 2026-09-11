import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';

export interface DRFErrorResponse {
  status?: string;
  status_code?: number;
  error_type?: string;
  errors?: Record<string, string[] | string>;
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

/**
 * Extracts a human-friendly string error message from DRF error response
 */
export function extractErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (!error || typeof error !== 'object') {
    return fallback;
  }

  // Axios error structure
  const axiosError = error as {
    response?: {
      data?: DRFErrorResponse | string;
      status?: number;
    };
    message?: string;
  };

  const data = axiosError.response?.data;

  if (typeof data === 'string') {
    return data || fallback;
  }

  if (data && typeof data === 'object') {
    // 1. Check for standard global DRF custom exception handler: errors: { field: ["msg"] }
    if (data.errors && typeof data.errors === 'object') {
      const errorEntries = Object.entries(data.errors);
      if (errorEntries.length > 0) {
        const [field, messages] = errorEntries[0];
        const msg = Array.isArray(messages) ? messages[0] : String(messages);
        const fieldLabel = field === 'non_field_errors' || field === 'detail' ? '' : `${field}: `;
        return `${fieldLabel}${msg}`;
      }
    }

    // 2. Check for hand-written { detail: "error message" }
    if (typeof data.detail === 'string' && data.detail.trim().length > 0) {
      return data.detail;
    }

    // 3. Check for standard Django REST Framework field errors { field: ["msg"] } directly on data
    const nonFieldErrors = data['non_field_errors'] as string[] | undefined;
    if (Array.isArray(nonFieldErrors) && nonFieldErrors.length > 0) {
      return nonFieldErrors[0];
    }

    for (const [key, val] of Object.entries(data)) {
      if (key === 'status' || key === 'status_code' || key === 'error_type') continue;
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string') {
        return `${key}: ${val[0]}`;
      }
      if (typeof val === 'string') {
        return val;
      }
    }

    if (typeof data.message === 'string' && data.message.trim().length > 0) {
      return data.message;
    }
  }

  // Check network/CORS error
  if (axiosError.message && axiosError.message.toLowerCase().includes('network error')) {
    return 'Unable to reach the server. If developing locally, ensure the Django API is running and CORS headers or Vite proxy are configured.';
  }

  if (axiosError.message) {
    return axiosError.message;
  }

  return fallback;
}

/**
 * Maps server-side validation errors from DRF response directly to React Hook Form fields
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): boolean {
  if (!error || typeof error !== 'object') return false;

  const axiosError = error as {
    response?: {
      data?: DRFErrorResponse;
    };
  };

  const data = axiosError.response?.data;
  if (!data || typeof data !== 'object') return false;

  const errorsDict = data.errors || (data as Record<string, unknown>);
  let applied = false;

  for (const [field, errorMessages] of Object.entries(errorsDict)) {
    if (field === 'status' || field === 'status_code' || field === 'error_type') continue;

    const message = Array.isArray(errorMessages)
      ? errorMessages[0]
      : typeof errorMessages === 'string'
      ? errorMessages
      : null;

    if (message) {
      // Cast field to Path<T> or root for non_field_errors
      const targetField = field === 'non_field_errors' ? ('root' as Path<T>) : (field as Path<T>);
      setError(targetField, { type: 'server', message });
      applied = true;
    }
  }

  return applied;
}
