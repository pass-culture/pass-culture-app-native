import React from 'react'
import styled from 'styled-components/native'

import { RootScreenNames } from 'features/navigation/RootNavigator/types'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { padding } from 'ui/theme'

interface Props {
  screen?: RootScreenNames
  onPress?: () => void
  title?: string
  navigateTo?: InternalNavigationProps['navigateTo']
  disabled?: boolean
  buttonHeight?: 'extraSmall' | 'small'
  isSubscreen?: boolean
}

export const LinkToScreenWithNavigateTo = ({
  screen = 'CheatcodesMenu',
  onPress,
  title,
  navigateTo,
  disabled = false,
  buttonHeight = 'small',
  isSubscreen = false,
}: Props) => {
  const Button = isSubscreen ? ButtonSecondary : ButtonPrimary
  return (
    <Row>
      {onPress || !navigateTo ? (
        <Button
          wording={title ?? screen}
          onPress={onPress}
          disabled={disabled}
          buttonHeight={buttonHeight}
        />
      ) : (
        <InternalTouchableLink
          as={Button}
          wording={title ?? screen}
          navigateTo={navigateTo}
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
