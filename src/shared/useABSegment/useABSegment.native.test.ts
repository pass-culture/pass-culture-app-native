import { beneficiaryUser } from 'fixtures/user'
import * as SegmentFromIdentifier from 'shared/useABSegment/getSegmentFromIdentifier'
import { useABSegment } from 'shared/useABSegment/useABSegment'
import { renderHook } from 'tests/utils'

const mockUseAuthContext = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

const mockUseDeviceInfo = jest.fn().mockReturnValue({
  deviceId: 'device-id',
  os: 'iOS',
  resolution: '1080x1920',
  source: 'iPhone 13',
  screenZoomLevel: undefined,
  fontScale: 1.5,
})
jest.mock('features/trustedDevice/helpers/useDeviceInfo', () => ({
  useDeviceInfo: () => mockUseDeviceInfo(),
}))

const getSegmentFromIdentifierSpy = jest.spyOn(SegmentFromIdentifier, 'getSegmentFromIdentifier')

describe('useABSegment', () => {
  it('should get AB segment from device id when user not logged in', () => {
    mockUseAuthContext.mockReturnValueOnce({ user: undefined })
    renderHook(() => useABSegment())

    expect(getSegmentFromIdentifierSpy).toHaveBeenNthCalledWith(1, 'device-id')
  })

  it('should get AB segment from user id when user logged in', () => {
    mockUseAuthContext.mockReturnValueOnce({ user: beneficiaryUser })
    renderHook(() => useABSegment())

    expect(getSegmentFromIdentifierSpy).toHaveBeenNthCalledWith(1, beneficiaryUser.id)
  })
})
