import { useMemo } from 'react'

import { useIsE2e } from 'libs/e2e/E2eContextProvider'

// this hook is useful when you want to set a testID/accessibilityLabel for android and iOS but only during e2e execution
// otherwise you can use the accessibilityAndTestId, which will keep the accessibilityLabel set outside of e2e execution
export function useE2eTestId(frenchText: string) {
  const isE2e = useIsE2e()
  return useMemo(
    () =>
      isE2e
        ? {
            testID: frenchText,
            accessibilityLabel: frenchText,
          }
        : {
            testID: frenchText,
          },
    [frenchText, isE2e]
  )
}
