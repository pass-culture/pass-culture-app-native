import { useEffect, useRef } from 'react'

import { useMinimalBuildNumber } from 'features/forceUpdate/helpers/useMinimalBuildNumber'
import { eventMonitoring } from 'libs/monitoring'

import { build } from '../../../../package.json'

const DELAY_BEFORE_VALUE_SHOULD_BE_SET_IN_MS = 15000

export const useMustUpdateApp = () => {
  const minimalBuildNumber = useRef<null | number>(null)
  minimalBuildNumber.current = useMinimalBuildNumber()
  const mustUpdateApp = !!minimalBuildNumber.current && build < minimalBuildNumber.current

  useEffect(() => {
    const timer = globalThis.setTimeout(() => {
      if (!minimalBuildNumber) {
        eventMonitoring.captureException(new Error('MustUpdateNoMinimalBuildNumberError'), {
          extra: {
            mustUpdateApp,
            minimalBuildNumber,
            build,
          },
        })
      }
    }, DELAY_BEFORE_VALUE_SHOULD_BE_SET_IN_MS)
    return () => {
      clearInterval(timer)
    }
  }, [mustUpdateApp])

  return mustUpdateApp
}
