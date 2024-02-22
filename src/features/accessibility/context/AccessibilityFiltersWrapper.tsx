import React, { useState, useContext, useMemo, memo } from 'react'

import { DisabilitiesProperties, IAccessibilityFiltersContext } from 'features/accessibility/types'

export const defaultProperties: DisabilitiesProperties = {
  isAudioDisabilityCompliant: false,
  isMentalDisabilityCompliant: false,
  isMotorDisabilityCompliant: false,
  isVisualDisabilityCompliant: false,
}

const AccessibilityFiltersContext = React.createContext<IAccessibilityFiltersContext>({
  disabilities: { ...defaultProperties },
  setDisabilities: () => ({}),
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
    [disabilities]
  )
  return (
    <AccessibilityFiltersContext.Provider value={value}>
      {children}
    </AccessibilityFiltersContext.Provider>
  )
})

export const useAccessibilityFiltersContext = () =>
  useContext<IAccessibilityFiltersContext>(AccessibilityFiltersContext)
