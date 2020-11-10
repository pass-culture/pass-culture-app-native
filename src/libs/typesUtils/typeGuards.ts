interface ErrorWithMessage {
  message: string
}

export const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (typeof error === 'object' && error && 'message' in error) ?? false
}
