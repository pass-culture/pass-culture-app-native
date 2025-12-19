import React from 'react'
import { Platform } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel/FilterSwitchWithLabel'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { colorSchemeActions, ColorScheme, useStoredColorScheme } from 'libs/styled/useColorScheme'
import { useOrientationLocked } from 'shared/hook/useOrientationLocked'
import { RadioSelector } from 'ui/components/radioSelector/RadioSelector'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { useDebounce } from 'ui/hooks/useDebounce'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { DarkThemeIllustration } from 'ui/svg/icons/darkTheme/DarkThemeIllustration'
import { DefaultThemeIllustration } from 'ui/svg/icons/darkTheme/DefaultThemeIllustration'
import { SystemThemeIllustration } from 'ui/svg/icons/darkTheme/SystemThemeIllustration'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const isWeb = Platform.OS === 'web'
const DEBOUNCE_TOGGLE_DELAY_MS = 5000

export const Appearance = () => {
  const titleID = uuidv4()
  const enableDarkMode = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)

  const { goBack } = useGoBack(...getTabHookConfig('Profile'))

  const [isOrientationLocked, toggleIsOrientationLocked] = useOrientationLocked()

  const debouncedLogChangeOrientationToggle = useDebounce(
    analytics.logChangeOrientationToggle,
    DEBOUNCE_TOGGLE_DELAY_MS
  )

  const selectedTheme = useStoredColorScheme()
  const radioGroupLabel = 'Thème'

  return (
    <PageWithHeader
      title="Apparence"
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
          {enableDarkMode ? (
            <DarkThemeContainer>
              <Typo.BodyAccentS nativeID={titleID} id={titleID} {...getHeadingAttrs(2)}>
                {radioGroupLabel}
              </Typo.BodyAccentS>
              <GreySeparator />
              <SelectorContainer
                gap={5}
                accessibilityRole={AccessibilityRole.RADIOGROUP}
                accessibilityLabelledBy={titleID}>
                <RadioSelector
                  radioGroupLabel={radioGroupLabel}
                  label="Mode clair"
                  description="Affichage classique"
                  checked={selectedTheme === ColorScheme.LIGHT}
                  onPress={() =>
                    colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.LIGHT })
                  }
                  rightElement={<DefaultThemeIllustration />}
                />
                <RadioSelector
                  radioGroupLabel={radioGroupLabel}
                  label="Mode sombre"
                  description="Réduit la fatigue visuelle"
                  checked={selectedTheme === ColorScheme.DARK}
                  onPress={() =>
                    colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.DARK })
                  }
                  rightElement={<DarkThemeIllustration />}
                />
                <RadioSelector
                  radioGroupLabel={radioGroupLabel}
                  label="Réglages appareil"
                  description="Automatique selon les réglages de ton appareil"
                  checked={selectedTheme === ColorScheme.SYSTEM}
                  onPress={() =>
                    colorSchemeActions.setColorScheme({ colorScheme: ColorScheme.SYSTEM })
                  }
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

const DarkThemeContainer = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xxxl,
}))

const GreySeparator = styled(Separator.Horizontal)(({ theme }) => ({
  backgroundColor: theme.designSystem.separator.color.subtle,
}))

const SelectorContainer = styled(ViewGap)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.xl,
}))
