import React from 'react'
import { Platform } from 'react-native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel/FilterSwitchWithLabel'
import { analytics } from 'libs/analytics/provider'
import { useOrientationLocked } from 'shared/hook/useOrientationLocked'
import { useDebounce } from 'ui/hooks/useDebounce'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { Spacer } from 'ui/theme'

const isWeb = Platform.OS === 'web'
const DEBOUNCE_TOGGLE_DELAY_MS = 5000

export const DisplayPreference = () => {
  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  const [isOrientationLocked, toggleIsOrientationLocked] = useOrientationLocked()

  const debouncedLogChangeOrientationToggle = useDebounce(
    analytics.logChangeOrientationToggle,
    DEBOUNCE_TOGGLE_DELAY_MS
  )

  return (
    <PageWithHeader
      title="Préférences d’affichage"
      onGoBack={goBack}
      scrollChildren={
        <React.Fragment>
          {isWeb ? null : (
            <FilterSwitchWithLabel
              label="Permettre l’orientation"
              subtitle="L’affichage en mode paysage peut être moins optimal"
              isActive={!isOrientationLocked}
              toggle={() => {
                toggleIsOrientationLocked()
                debouncedLogChangeOrientationToggle(!isOrientationLocked)
              }}
            />
          )}
          <Spacer.BottomScreen />
        </React.Fragment>
      }
    />
  )
}
