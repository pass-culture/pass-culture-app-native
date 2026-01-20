import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { useTheme } from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Warning as InitialWarning } from 'ui/svg/icons/Warning'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  text: string
}

export const BottomBanner = ({ text, ...props }: Props) => {
  const { bottom } = useSafeAreaInsets()
  const { designSystem } = useTheme()
  const paddingVertical = designSystem.size.spacing.l
  const paddingBottom = bottom === 0 ? paddingVertical : bottom

  return (
    <Container gap={4} paddingBottom={paddingBottom} paddingVertical={paddingVertical} {...props}>
      <IconContainer>
        <Warning />
      </IconContainer>
      <TextContainer>
        <Typo.BodyAccentXs>{text}</Typo.BodyAccentXs>
      </TextContainer>
    </Container>
  )
}

const Container = styled(ViewGap)<{ paddingBottom: number; paddingVertical: number }>(
  ({ paddingBottom, paddingVertical, theme }) => ({
    borderTopColor: theme.designSystem.color.border.subtle,
    borderTopWidth: getSpacing(0.25),
    paddingVertical,
    paddingHorizontal: theme.designSystem.size.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.designSystem.color.background.default,
    paddingBottom,
  })
)

const IconContainer = styled.View({
  flexShrink: 0,
})

const TextContainer = styled.View({
  flex: 1,
})

const Warning = styled(InitialWarning).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``
