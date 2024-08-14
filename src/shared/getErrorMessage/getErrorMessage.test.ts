import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

describe('getErrorMessage', () => {
  it('should return the error message when the error is a string', () => {
    const error = 'This is a string error'

    expect(getErrorMessage(error)).toEqual(error)
  })

  it('should return the error message when the error is an instance of Error', () => {
    const error = new Error('This is an error object')

    expect(getErrorMessage(error)).toEqual('This is an error object')
  })

  it('should return a default message for unknown error types', () => {
    const error = { someKey: 'someValue' }

    expect(getErrorMessage(error)).toEqual('An unexpected error occurred')
  })

  it('should return a default message for null error', () => {
    const error = null

    expect(getErrorMessage(error)).toEqual('An unexpected error occurred')
  })

  it('should return a default message for undefined error', () => {
    const error = undefined

    expect(getErrorMessage(error)).toEqual('An unexpected error occurred')
  })
})
