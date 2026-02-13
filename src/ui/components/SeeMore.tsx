import React from 'react'
import styled from 'styled-components/native'

import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { Button } from 'ui/designSystem/Button/Button'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'

interface SeeMoreProps {
  height: number
  width: number
  navigateTo?: InternalNavigationProps['navigateTo']
  onPress: () => void
}

export const SeeMore: React.FC<SeeMoreProps> = ({ height, width, navigateTo, onPress }) => {
  const buttonProps = {
    wording: 'En voir plus',
    accessibilityLabel: 'En voir plus',
    icon: ArrowNext,
    iconPosition: 'right' as const,
    variant: 'tertiary' as const,
    color: 'neutral' as const,
  }

  return (
    <Container height={height} width={width}>
      {navigateTo ? (
        <InternalTouchableLink
          as={Button}
          navigateTo={navigateTo}
          onBeforeNavigate={onPress}
          {...buttonProps}
        />
      ) : (
        <Button onPress={onPress} {...buttonProps} />
      )}
    </Container>
  )
}

const Container = styled.View<{ height: number; width: number }>(({ height, width }) => ({
  height,
  width,
  alignItems: 'center',
  justifyContent: 'center',
}))
