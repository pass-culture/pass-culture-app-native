import React from 'react'
import styled from 'styled-components/native'

import { RootScreenNames, RootStackParamList } from 'features/navigation/RootNavigator/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { padding } from 'ui/theme'

interface LinkToComponentProps {
  name?: RootScreenNames
  onPress?: () => void
  title?: string
  navigationParams?: RootStackParamList[RootScreenNames]
  disabled?: boolean
}

export const LinkToComponent = ({
  name = 'CheatcodesMenu',
  onPress,
  title,
  navigationParams,
  disabled = false,
}: LinkToComponentProps) => (
  <Row>
    {onPress ? (
      <ButtonPrimary wording={title ?? name} onPress={onPress} disabled={disabled} />
    ) : (
      <InternalTouchableLink
        as={ButtonPrimary}
        wording={title ?? name}
        navigateTo={{ screen: name, params: navigationParams }}
        disabled={disabled}
      />
    )}
  </Row>
)

const Row = styled.View(({ theme }) => ({
  width: theme.appContentWidth > theme.breakpoints.sm ? '50%' : '100%',
  ...padding(2, 0.5),
}))
