import React from 'react'
import styled from 'styled-components/native'

import { RootScreenNames, RootStackParamList } from 'features/navigation/RootNavigator/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { padding } from 'ui/theme'

interface Props {
  screen?: RootScreenNames
  onPress?: () => void
  title?: string
  navigationParams?: RootStackParamList[RootScreenNames]
  disabled?: boolean
  buttonHeight?: 'extraSmall' | 'small'
  isSubscreen?: boolean
}

export const LinkToCheatcodesScreen = ({
  screen,
  onPress,
  title,
  navigationParams,
  disabled = false,
  buttonHeight = 'small',
  isSubscreen = false,
}: Props) => {
  const Button = isSubscreen ? ButtonSecondary : ButtonPrimary
  const LinkName = title ?? screen ?? 'No Name Defined'
  return (
    <Row>
      {onPress ? (
        <Button
          wording={LinkName}
          onPress={onPress}
          disabled={disabled}
          buttonHeight={buttonHeight}
        />
      ) : (
        <InternalTouchableLink
          as={Button}
          wording={LinkName}
          navigateTo={{
            screen: 'CheatcodesStackNavigator',
            params: navigationParams,
          }}
          disabled={disabled}
          buttonHeight={buttonHeight}
        />
      )}
    </Row>
  )
}

const Row = styled.View(({ theme }) => ({
  width: theme.appContentWidth > theme.breakpoints.sm ? '50%' : '100%',
  ...padding(2, 0.5),
}))
