import { useAuthContext } from 'features/auth/context/AuthContext'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { env } from 'libs/environment/env'
import { useOverride } from 'shared/useABSegment/abTestOverrideStore'
import { getSegmentFromIdentifier } from 'shared/useABSegment/getSegmentFromIdentifier'

export const useABSegment = <T>(segments: T[], testId?: string) => {
  const { user } = useAuthContext()
  const deviceInfo = useDeviceInfo()

  const forcedSegment = useOverride(testId ?? '')
  if (testId && env.ENV !== 'production' && forcedSegment !== undefined) {
    const overrideMatch = segments.find((segment) => segment === (forcedSegment as unknown as T))
    if (overrideMatch !== undefined) {
      return overrideMatch
    }
  }

  const identifier = user?.id ?? deviceInfo?.deviceId

  return getSegmentFromIdentifier(segments, identifier)
}
