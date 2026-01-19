import React from 'react'
import { Platform, View, useColorScheme as useSystemColorScheme } from 'react-native'
import styled from 'styled-components/native'

import { getTabHookConfig } from 'features/navigation/TabBar/getTabHookConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { FilterSwitchWithLabel } from 'features/search/components/FilterSwitchWithLabel/FilterSwitchWithLabel'
import { analytics } from 'libs/analytics/provider'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import {
  colorSchemeActions,
  ColorScheme,
  getResolvedColorScheme,
  useStoredColorScheme,
} from 'libs/styled/useColorScheme'
import { useOrientationLocked } from 'shared/hook/useOrientationLocked'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { RadioButtonGroup } from 'ui/designSystem/RadioButtonGroup/RadioButtonGroup'
import { RadioButtonGroupOption } from 'ui/designSystem/RadioButtonGroup/types'
import { useDebounce } from 'ui/hooks/useDebounce'
import { PageWithHeader } from 'ui/pages/PageWithHeader'
import { DarkThemeIllustration } from 'ui/svg/icons/darkTheme/DarkThemeIllustration'
import { DefaultThemeIllustration } from 'ui/svg/icons/darkTheme/DefaultThemeIllustration'
import { SystemThemeIllustration } from 'ui/svg/icons/darkTheme/SystemThemeIllustration'
import { Spacer } from 'ui/theme'

const isWeb = Platform.OS === 'web'
const DEBOUNCE_TOGGLE_DELAY_MS = 5000

export const Appearance = () => {
  const enableDarkMode = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_DARK_MODE)

  const { goBack } = useGoBack(...getTabHookConfig('Profile'))

  const [isOrientationLocked, toggleIsOrientationLocked] = useOrientationLocked()

  const debouncedLogChangeOrientationToggle = useDebounce(
    analytics.logChangeOrientationToggle,
    DEBOUNCE_TOGGLE_DELAY_MS
  )

  const selectedTheme = useStoredColorScheme()
  const systemScheme = useSystemColorScheme()
  const radioGroupLabel = 'Thème'

  const themeOptions: Array<
    RadioButtonGroupOption & { value: ColorScheme; label: string; description: string }
  > = [
    {
      key: 'light',
      value: ColorScheme.LIGHT,
      label: 'Mode clair',
      description: 'Affichage classique',
      asset: { variant: 'icon', iconElement: <DefaultThemeIllustration /> },
    },
    {
      key: 'dark',
      value: ColorScheme.DARK,
      label: 'Mode sombre',
      description: 'Réduit la fatigue visuelle',
      asset: { variant: 'icon', iconElement: <DarkThemeIllustration /> },
    },
    {
      key: 'system',
      value: ColorScheme.SYSTEM,
      label: 'Réglages appareil',
      description: 'Automatique selon les réglages de ton appareil',
      asset: { variant: 'icon', iconElement: <SystemThemeIllustration /> },
    },
  ]

  const currentSelectionLabel =
    themeOptions.find((option) => option.value === selectedTheme)?.label ?? ''

  const handleSelectTheme = (label: string) => {
    const next = themeOptions.find((option) => option.label === label)
    if (!next) return
    if (next.value === selectedTheme) return

    colorSchemeActions.setColorScheme({ colorScheme: next.value })
    const themeSetting = getResolvedColorScheme(next.value, systemScheme)

    const systemTheme = systemScheme === 'dark' ? ColorScheme.DARK : ColorScheme.LIGHT

    void analytics.logUpdateAppTheme({ themeSetting, systemTheme, platform: Platform.OS })
  }

  const handleGroupChange = (label: string) => handleSelectTheme(label)

  return (
    <PageWithHeader
      title="Apparence"
      onGoBack={goBack}
      scrollChildren={
        <ViewGap gap={6}>
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
          {isWeb ? null : <GreySeparator />}
          {enableDarkMode ? (
            <View>
              <RadioButtonGroup
                label={radioGroupLabel}
                description=""
                options={themeOptions}
                errorText=""
                value={currentSelectionLabel}
                onChange={handleGroupChange}
                variant="detailed"
                display="vertical"
                labelVariant="title2"
              />
            </View>
          ) : null}
          <Spacer.BottomScreen />
        </ViewGap>
      }
    />
  )
}

const GreySeparator = styled(Separator.Horizontal)(({ theme }) => ({
  backgroundColor: theme.designSystem.separator.color.subtle,
}))
