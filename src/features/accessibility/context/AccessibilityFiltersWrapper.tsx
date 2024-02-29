import React, { useState, useContext, useMemo, memo } from 'react'

import { DisplayedDisabilitiesEnum } from 'features/accessibility/enums'
import { DisabilitiesProperties, IAccessibilityFiltersContext } from 'features/accessibility/types'

export const defaultProperties: DisabilitiesProperties = {
  [DisplayedDisabilitiesEnum.AUDIO]: undefined,
  [DisplayedDisabilitiesEnum.MENTAL]: undefined,
  [DisplayedDisabilitiesEnum.MOTOR]: undefined,
  [DisplayedDisabilitiesEnum.VISUAL]: undefined,
}

const AccessibilityFiltersContext = React.createContext<IAccessibilityFiltersContext>({
  disabilities: defaultProperties,
  setDisabilities: () => undefined,
})

export const AccessibilityFiltersWrapper = memo(function AccessibilityFiltersWrapper({
  children,
}: {
  children: React.JSX.Element
}) {
  const [disabilities, setDisabilities] = useState<DisabilitiesProperties>(defaultProperties)

  const value = useMemo(
    () => ({
      disabilities,
      setDisabilities,
    }),
    [disabilities, setDisabilities]
  )

  return (
    <AccessibilityFiltersContext.Provider value={value}>
      {children}
    </AccessibilityFiltersContext.Provider>
  )
})

export const useAccessibilityFiltersContext = () =>
  useContext<IAccessibilityFiltersContext>(AccessibilityFiltersContext)
