import React from 'react'
import styled from 'styled-components/native'

import { RootScreenNames, RootStackParamList } from 'features/navigation/RootNavigator/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { padding } from 'ui/theme'

interface LinkToComponentProps {
  screen?: RootScreenNames
  onPress?: () => void
  title?: string
  navigationParams?: RootStackParamList[RootScreenNames]
  disabled?: boolean
}

export const LinkToComponent = ({
  screen = 'CheatcodesMenu',
  onPress,
  title,
  navigationParams,
  disabled = false,
}: LinkToComponentProps) => (
  <Row>
    {onPress ? (
      <ButtonPrimary wording={title ?? screen} onPress={onPress} disabled={disabled} />
    ) : (
      <InternalTouchableLink
        as={ButtonPrimary}
        wording={title ?? screen}
        navigateTo={{ screen, params: navigationParams }}
        disabled={disabled}
      />
    )}
  </Row>
)

const Row = styled.View(({ theme }) => ({
  width: theme.appContentWidth > theme.breakpoints.sm ? '50%' : '100%',
  ...padding(2, 0.5),
}))
