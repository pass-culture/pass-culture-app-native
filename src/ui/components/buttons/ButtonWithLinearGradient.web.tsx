import React, { SyntheticEvent, useCallback } from 'react'
import styled from 'styled-components'
import styledNative, { useTheme } from 'styled-components/native'

import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing, getSpacingString, Typo } from 'ui/theme'

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
  type = 'button',
  name,
  className,
}) => {
  const { colors } = useTheme()
  const onClick = useCallback(
    (event: SyntheticEvent) => {
      if (type === 'submit') {
        event.preventDefault()
      }
      if (onPress) {
        onPress()
      }
    },
    [onPress]
  )
  return (
    <Button name={name} onClick={onClick} disabled={isDisabled} type={type} className={className}>
      <LegendContainer>
        {!!isExternal && <ExternalSite size={24} color={colors.white} />}
        <Title adjustsFontSizeToFit numberOfLines={1}>
          {wording}
        </Title>
      </LegendContainer>
    </Button>
  )
}

const Button = styled.button`
  ${({ theme }) => `
    height: ${getSpacingString(12)};
    border-radius: ${theme.borderRadius.button}px;
    background-color: ${theme.colors.primary};
    background: linear-gradient(0.25turn, ${theme.colors.primary}, ${theme.colors.secondary});
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
    overflow: hidden;
    cursor: pointer;

    &:active {
      opacity: ${theme.activeOpacity};
    }

    &:disabled {
      cursor: initial;
      background: none;
      background-color: ${theme.colors.primaryDisabled};
    }
  `}
`

const Title = styledNative(Typo.ButtonText)(({ theme }) => ({
  color: theme.colors.white,
  padding: getSpacing(5),
}))

const LegendContainer = styledNative.View({
  position: 'absolute',
  alignItems: 'center',
  flexDirection: 'row',
})
