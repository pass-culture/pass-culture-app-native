import React, { useState } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel/FilterSwitchWithLabel'
import { analytics } from 'libs/analytics/provider'
import { ColorScheme } from 'libs/styled/useColorScheme'
import { useOrientationLocked } from 'shared/hook/useOrientationLocked'
import { RadioSelector } from 'ui/components/radioSelector/RadioSelector'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { useDebounce } from 'ui/hooks/useDebounce'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { DarkThemeIllustration } from 'ui/svg/icons/darkTheme/DarkThemeIllustration'
import { DefaultThemeIllustration } from 'ui/svg/icons/darkTheme/DefaultThemeIllustration'
import { SystemThemeIllustration } from 'ui/svg/icons/darkTheme/SystemThemeIllustration'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const isWeb = Platform.OS === 'web'
const DEBOUNCE_TOGGLE_DELAY_MS = 5000

export const DisplayPreference = () => {
  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  const [isOrientationLocked, toggleIsOrientationLocked] = useOrientationLocked()

  const debouncedLogChangeOrientationToggle = useDebounce(
    analytics.logChangeOrientationToggle,
    DEBOUNCE_TOGGLE_DELAY_MS
  )

  const [selectedTheme, setSelectedTheme] = useState<ColorScheme>('light')

  return (
    <PageWithHeader
      title="Préférences d’affichage"
      onGoBack={goBack}
      scrollChildren={
        <React.Fragment>
          <FilterSwitchWithLabel
            disabled={isWeb}
            testID="Rotation"
            label="Permettre l’orientation"
            subtitle={
              isWeb
                ? 'L’affichage en mode paysage n’est pas disponible en web'
                : 'L’affichage en mode paysage peut être moins optimal'
            }
            isActive={!isOrientationLocked}
            toggle={() => {
              toggleIsOrientationLocked()
              debouncedLogChangeOrientationToggle(!isOrientationLocked)
            }}
          />
          <DarkThemeContainer>
            <Typo.BodyAccentS>Thème</Typo.BodyAccentS>
            <GreySeparator />
            <SelectorContainer gap={5}>
              <RadioSelector
                label="Mode clair"
                description="Affichage classique"
                checked={selectedTheme === 'light'}
                onPress={() => setSelectedTheme('light')}
                rightElement={<DefaultThemeIllustration />}
              />
              <RadioSelector
                label="Mode sombre"
                description="Réduit la fatigue visuelle"
                checked={selectedTheme === 'dark'}
                onPress={() => setSelectedTheme('dark')}
                rightElement={<DarkThemeIllustration />}
              />
              <RadioSelector
                label="Réglages appareil"
                description="Automatique selon les réglages de ton appareil"
                checked={selectedTheme === 'system'}
                onPress={() => setSelectedTheme('system')}
                rightElement={<SystemThemeIllustration />}
              />
            </SelectorContainer>
          </DarkThemeContainer>
          <Spacer.BottomScreen />
        </React.Fragment>
      }
    />
  )
}

const DarkThemeContainer = styled.View({
  marginTop: getSpacing(10),
})

const GreySeparator = styled(Separator.Horizontal).attrs(({ theme }) => ({
  backgroundColor: theme.designSystem.separator.color.subtle,
}))``

const SelectorContainer = styled(ViewGap)({
  marginTop: getSpacing(6),
})
