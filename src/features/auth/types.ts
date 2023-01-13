export type SignInResponseFailure = {
  isSuccess: false
  statusCode?: number
  content?: {
    code: 'ACCOUNT_DELETED' | 'EMAIL_NOT_VALIDATED' | 'NETWORK_REQUEST_FAILED'
    general: string[]
  }
}
