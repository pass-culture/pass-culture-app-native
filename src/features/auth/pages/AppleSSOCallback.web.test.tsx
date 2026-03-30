import React from 'react'

import { render } from 'tests/utils/web'

import { AppleSSOCallback } from './AppleSSOCallback'

describe('AppleSSOCallback (web)', () => {
  const mockPostMessage = jest.fn()
  const mockClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    Object.defineProperty(window, 'opener', {
      value: { postMessage: mockPostMessage },
      writable: true,
    })
    jest.spyOn(window, 'close').mockImplementation(mockClose)
  })

  it('should post code and state to opener and close the window', () => {
    setSearchParams('?code=apple-code&state=oauth-state')

    render(<AppleSSOCallback />)

    expect(mockPostMessage).toHaveBeenCalledWith(
      { type: 'apple-sso-callback', code: 'apple-code', state: 'oauth-state', error: '' },
      window.location.origin
    )
    expect(mockClose).toHaveBeenCalledWith()
  })

  it('should post error param when Apple returns an error', () => {
    setSearchParams('?error=access_denied')

    render(<AppleSSOCallback />)

    expect(mockPostMessage).toHaveBeenCalledWith(
      { type: 'apple-sso-callback', code: '', state: '', error: 'access_denied' },
      window.location.origin
    )
    expect(mockClose).toHaveBeenCalledWith()
  })

  it('should post empty values when no params are present', () => {
    setSearchParams('')

    render(<AppleSSOCallback />)

    expect(mockPostMessage).toHaveBeenCalledWith(
      { type: 'apple-sso-callback', code: '', state: '', error: '' },
      window.location.origin
    )
  })

  it('should still close the window when there is no opener', () => {
    Object.defineProperty(window, 'opener', { value: null, writable: true })
    setSearchParams('?code=apple-code&state=oauth-state')

    render(<AppleSSOCallback />)

    expect(mockPostMessage).not.toHaveBeenCalled()
    expect(mockClose).toHaveBeenCalledWith()
  })
})

function setSearchParams(search: string) {
  Object.defineProperty(window, 'location', {
    value: { ...window.location, search, origin: window.location.origin },
    writable: true,
  })
}
