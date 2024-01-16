export interface TErrorHandler extends Error {
  statusCode?: number;
  status?: string;
  isOperational: boolean;
  path?: string;
  value?: string;
  keyValue?: {
    name: string;
  };
  errors: object;
}
