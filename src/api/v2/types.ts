class BaseError extends Error {
  route: string

  constructor(message: string, route: string) {
    super(message)
    this.name = 'BaseError'
    this.route = route
  }
}

export class NotAuthenticatedError extends BaseError {
  constructor(message: string, route: string) {
    super(message, route)
    this.name = 'NotAuthenticatedError'
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message: string, route: string) {
    super(message, route)
    this.name = 'UnauthorizedError'
  }
}

export class UnprocessableEntityError extends BaseError {
  constructor(message: string, route: string) {
    super(message, route)
    this.name = 'UnprocessableEntityError'
  }
}
