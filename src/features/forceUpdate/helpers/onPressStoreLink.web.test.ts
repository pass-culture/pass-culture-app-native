import { onPressStoreLink } from './onPressStoreLink'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('libs/firebase/analytics/analytics')

const mockReload = jest.fn()

describe('onPressStoreLink', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'window', {
      value: { location: { reload: mockReload } },
      writable: true,
    })
    jest.resetAllMocks()
  })

  it('should reload the page on web', () => {
    onPressStoreLink()

    expect(mockReload).toHaveBeenCalledWith()
  })
})
