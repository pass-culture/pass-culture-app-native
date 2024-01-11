export class ApiError extends Error {
  name = 'ApiError'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  statusCode: number

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(statusCode: number, content: any, message?: string) {
    super(message)
    this.content = content
    this.statusCode = statusCode
  }
}
