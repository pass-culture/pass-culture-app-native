import { useMemo } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useDeviceInfo } from 'features/trustedDevice/helpers/useDeviceInfo'
import { getSegmentFromIdentifier } from 'shared/useABSegment/getSegmentFromIdentifier'

export type SegmentResult = 'A' | 'B'

export const useABSegment = (): SegmentResult => {
  const { user } = useAuthContext()
  const deviceInfo = useDeviceInfo()

  const identifier = user?.id ?? deviceInfo?.deviceId

  const segment = useMemo(() => {
    return getSegmentFromIdentifier(identifier)
  }, [identifier])

  return segment
}
