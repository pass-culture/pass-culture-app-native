import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel/FilterSwitchWithLabel'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import {
  colorSchemeActions,
  ColorSchemeEnum,
  ColorSchemeFull,
  useStoredColorScheme,
} from 'libs/styled/useColorScheme'
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
  const enableDarkMode = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)

  const { goBack } = useGoBack(...getTabNavConfig('Profile'))

  const [isOrientationLocked, toggleIsOrientationLocked] = useOrientationLocked()

  const debouncedLogChangeOrientationToggle = useDebounce(
    analytics.logChangeOrientationToggle,
    DEBOUNCE_TOGGLE_DELAY_MS
  )

  const [selectedTheme, setSelectedTheme] = useState<ColorSchemeFull>(useStoredColorScheme())

  useEffect(() => {
    colorSchemeActions.setColorScheme({ colorScheme: selectedTheme })
  }, [selectedTheme])

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
          {enableDarkMode ? (
            <DarkThemeContainer>
              <Typo.BodyAccentS>Thème</Typo.BodyAccentS>
              <GreySeparator />
              <SelectorContainer gap={5}>
                <RadioSelector
                  label="Mode clair"
                  description="Affichage classique"
                  checked={selectedTheme === ColorSchemeEnum.LIGHT}
                  onPress={() => setSelectedTheme(ColorSchemeEnum.LIGHT)}
                  rightElement={<DefaultThemeIllustration />}
                />
                <RadioSelector
                  label="Mode sombre"
                  description="Réduit la fatigue visuelle"
                  checked={selectedTheme === ColorSchemeEnum.DARK}
                  onPress={() => setSelectedTheme(ColorSchemeEnum.DARK)}
                  rightElement={<DarkThemeIllustration />}
                />
                <RadioSelector
                  label="Réglages appareil"
                  description="Automatique selon les réglages de ton appareil"
                  checked={selectedTheme === ColorSchemeEnum.SYSTEM}
                  onPress={() => setSelectedTheme(ColorSchemeEnum.SYSTEM)}
                  rightElement={<SystemThemeIllustration />}
                />
              </SelectorContainer>
            </DarkThemeContainer>
          ) : null}
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
