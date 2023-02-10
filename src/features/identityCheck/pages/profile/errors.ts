export class IdentityCheckError extends Error {
  name = 'IdentityCheckError'
  constructor(public message: string) {
    super(message)
  }
}
