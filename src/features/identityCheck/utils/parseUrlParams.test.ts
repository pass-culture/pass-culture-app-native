import { parseUrlParams } from 'features/identityCheck/utils/parseUrlParams'

describe('parseUrlParams', () => {
  it('should parse url params', () => {
    const url = 'https://domain/path/fin?status=aborted&return_reason=verify_later'
    const params = parseUrlParams(url)
    expect(params['status']).toBe('aborted')
    expect(params['return_reason']).toBe('verify_later')
    expect(params['error_type']).toBeUndefined()
  })

  it('should parse empty url', () => {
    const url = 'https://domain/path/fin'
    const params = parseUrlParams(url)
    expect(params).toStrictEqual({})
  })
})
