import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { accessibilityAndTestId } from 'tests/utils'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { Rectangle } from 'ui/svg/Rectangle'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  wording: string
  onPress: (() => void) | (() => Promise<void>) | undefined
  isDisabled: boolean
  isExternal?: boolean
  type?: 'button' | 'reset' | 'submit'
  className?: string
  name?: string
}

export const ButtonWithLinearGradient: React.FC<Props> = ({
  wording,
  onPress,
  isDisabled,
  isExternal = false,
}) => {
  const { activeOpacity, colors } = useTheme()
  return (
    <Container
      activeOpacity={activeOpacity}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityState={{ disabled: isDisabled }}
      {...accessibilityAndTestId(wording)}>
      {isDisabled ? <DisabledRectangle /> : <Rectangle height={getSpacing(12)} size="100%" />}
      <LegendContainer>
        {!!isExternal && <ExternalSite size={20} color={colors.white} />}
        <Title adjustsFontSizeToFit numberOfLines={1}>
          {wording}
        </Title>
      </LegendContainer>
    </Container>
  )
}

const Container = styled.TouchableOpacity(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.borderRadius.button,
  overflow: 'hidden',
}))

const Title = styled(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
  padding: getSpacing(5),
}))

const LegendContainer = styled.View({
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'row',
})

const DisabledRectangle = styled.View(({ theme }) => ({
  width: '100%',
  height: getSpacing(12),
  backgroundColor: theme.colors.primaryDisabled,
}))
