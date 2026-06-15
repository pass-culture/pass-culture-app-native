import { ApiError } from 'api/ApiError'

export const isServerError = (error: Error | null): boolean =>
  error instanceof ApiError && Math.floor(error.statusCode / 100) === 5
