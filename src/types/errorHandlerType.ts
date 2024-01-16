export interface TErrorHandler extends Error {
  statusCode?: number;
  status?: string;
  isOperational: boolean;
}
