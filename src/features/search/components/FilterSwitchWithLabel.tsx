import React, { FunctionComponent, useMemo } from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import FilterSwitch from 'ui/components/FilterSwitch'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { Spacer, Typo } from 'ui/theme'

type Props = {
  isActive: boolean
  toggle: () => void
  label: string
  testID?: string
  subtitle?: string
}

export const FilterSwitchWithLabel: FunctionComponent<Props> = ({
  isActive,
  toggle,
  label,
  testID,
  subtitle,
}) => {
  const checkboxID = useMemo(uuidv4, [])
  const labelID = useMemo(uuidv4, [])
  const describedByID = useMemo(uuidv4, [])
  const { isDesktopViewport } = useTheme()

  const TitleWithSubtitle = useMemo(
    () =>
      function TitleWithSubtitle() {
        return (
          <View>
            <InputLabel htmlFor={checkboxID}>
              <Typo.ButtonText>{label}</Typo.ButtonText>
            </InputLabel>
            {!!subtitle && (
              <React.Fragment>
                <Spacer.Column numberOfSpaces={1} />
                <Typo.CaptionNeutralInfo>{subtitle}</Typo.CaptionNeutralInfo>
              </React.Fragment>
            )}
          </View>
        )
      },
    [checkboxID, label, subtitle]
  )

  return (
    <View>
      <Container inverseLayout={!!isDesktopViewport}>
        {!isDesktopViewport && <TitleWithSubtitle />}
        <FilterSwitch
          checkboxID={checkboxID}
          active={isActive}
          toggle={toggle}
          accessibilityLabelledBy={labelID}
          accessibilityDescribedBy={describedByID}
          testID={testID}
        />
        {!!isDesktopViewport && (
          <React.Fragment>
            <Spacer.Row numberOfSpaces={2} />
            <TitleWithSubtitle />
          </React.Fragment>
        )}
      </Container>
    </View>
  )
}

const Container = styled.View<{ inverseLayout?: boolean }>(({ inverseLayout }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  ...(!inverseLayout && { justifyContent: 'space-between' }),
}))
