import { onPressStoreLink } from './onPressStoreLink'

jest.mock('libs/firebase/analytics/analytics')

const mockAssign = jest.fn()

describe('onPressStoreLink', () => {
  beforeEach(() => {
    Object.defineProperty(global, 'sessionStorage', {
      value: { clear: jest.fn() },
      writable: true,
    })

    Object.defineProperty(global, 'localStorage', {
      value: { clear: jest.fn() },
      writable: true,
    })

    Object.defineProperty(globalThis, 'window', {
      value: { location: { href: 'https://example.com', assign: mockAssign } },
      writable: true,
    })

    jest.spyOn(global.Date, 'now').mockReturnValue(123456)
  })

  it('should clear session storage', () => {
    onPressStoreLink()

    expect(global.sessionStorage.clear).toHaveBeenCalledTimes(1)
  })

  it('should clear local storage', () => {
    onPressStoreLink()

    expect(global.localStorage.clear).toHaveBeenCalledTimes(1)
  })

  it('should reload the page with a fixed URL parameter', () => {
    onPressStoreLink()
    const assignedUrlCall = mockAssign.mock.calls[0][0].toString()

    expect(assignedUrlCall).toBe('https://example.com/?force=123456')
  })
})
