import React from 'react'
import styled from 'styled-components/native'

import { SectionWithSwitch } from 'features/profile/components/SectionWithSwitch/SectionWithSwitch'
import { analytics } from 'libs/analytics/provider'
import { InputError } from 'ui/components/inputs/InputError'
import { useDebounce } from 'ui/hooks/useDebounce'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { SECTION_ROW_ICON_SIZE } from 'ui/theme/constants'

type LocationButtonProps = {
  isGeolocSwitchActive: boolean
  geolocPositionError: { message: string } | null
  switchGeolocation: () => void
}

const DEBOUNCE_TOGGLE_DELAY_MS = 5000

export const LocationButton = ({
  isGeolocSwitchActive,
  geolocPositionError,
  switchGeolocation,
}: LocationButtonProps) => {
  const debouncedLogLocationToggle = useDebounce(
    analytics.logLocationToggle,
    DEBOUNCE_TOGGLE_DELAY_MS
  )

  const toggle = () => {
    switchGeolocation()
    void debouncedLogLocationToggle(!isGeolocSwitchActive)
  }

  return (
    <Container>
      <SectionWithSwitch
        icon={LocationPointer}
        iconSize={SECTION_ROW_ICON_SIZE}
        title="Activer ma géolocalisation"
        active={isGeolocSwitchActive}
        accessibilityHint={geolocPositionError?.message}
        toggle={toggle}
        toggleLabel="Activer ma géolocalisation"
      />
      <InputError
        visible={!!geolocPositionError}
        errorMessage={geolocPositionError?.message}
        numberOfSpacesTop={1}
      />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  paddingVertical: theme.designSystem.size.spacing.l,
}))
