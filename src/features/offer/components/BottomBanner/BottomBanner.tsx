import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Warning as InitialWarning } from 'ui/svg/icons/Warning'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  text: string
}

const PADDING_VERTICAL = getSpacing(4)

export const BottomBanner = ({ text, ...props }: Props) => {
  const { bottom } = useSafeAreaInsets()
  const paddingBottom = bottom === 0 ? PADDING_VERTICAL : bottom

  return (
    <Container gap={4} paddingBottom={paddingBottom} {...props}>
      <IconContainer>
        <Warning />
      </IconContainer>
      <TextContainer>
        <Typo.BodyAccentXs>{text}</Typo.BodyAccentXs>
      </TextContainer>
    </Container>
  )
}

const Container = styled(ViewGap)<{ paddingBottom: number }>(({ paddingBottom, theme }) => ({
  borderTopColor: theme.designSystem.color.border.subtle,
  borderTopWidth: getSpacing(0.25),
  paddingVertical: PADDING_VERTICAL,
  paddingHorizontal: getSpacing(6),
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: theme.designSystem.color.background.default,
  paddingBottom,
}))

const IconContainer = styled.View({
  flexShrink: 0,
})

const TextContainer = styled.View({
  flex: 1,
})

const Warning = styled(InitialWarning).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.brandPrimary,
}))``
