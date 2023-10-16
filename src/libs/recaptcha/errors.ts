export enum ReCaptchaInternalError {
  NetworkError = 'ReCaptchaNetworkError',
  NumberOfRenderRetriesExceeded = 'ReCaptchaNumberOfRenderRetriesExceeded',
  UnknownError = 'ReCaptchaUnknownError',
}
export type ReCaptchaError = ReCaptchaInternalError | 'ReCaptchaWebViewError'
