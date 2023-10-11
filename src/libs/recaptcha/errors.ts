export enum ReCaptchaInternalError {
  NetworkError = 'NetworkError',
  NumberOfRenderRetriesExceeded = 'NumberOfRenderRetriesExceeded',
  UnknownError = 'UnknownError',
}
export type ReCaptchaError = ReCaptchaInternalError | 'WebViewError'
