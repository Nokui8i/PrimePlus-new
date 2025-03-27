export interface ErrorResponse {
  message: string;
  statusCode: number;
  errors?: any[];
}

export const createError = (statusCode: number, message: string, errors?: any[]): ErrorResponse => {
  return {
    message,
    statusCode,
    errors
  };
}; 