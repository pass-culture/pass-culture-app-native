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
  screen,
  onPress,
  title,
  navigateTo,
  disabled = false,
  buttonHeight = 'small',
  isSubscreen = false,
}: Props) => {
  const Button = isSubscreen ? ButtonSecondary : ButtonPrimary
  const LinkName = title ?? screen ?? 'No Name Defined'
  return (
    <Row>
      {onPress || !navigateTo ? (
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
