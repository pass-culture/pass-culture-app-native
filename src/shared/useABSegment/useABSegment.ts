import { useAuthContext } from 'features/auth/context/AuthContext'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { getSegmentFromIdentifier } from 'shared/useABSegment/getSegmentFromIdentifier'

export const useABSegment = <T>(segments: T[]) => {
  const { user } = useAuthContext()
  const deviceInfo = useDeviceInfo()

  const identifier = user?.id ?? deviceInfo?.deviceId

  return getSegmentFromIdentifier(segments, identifier)
}
