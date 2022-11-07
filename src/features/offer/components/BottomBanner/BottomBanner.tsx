import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { BicolorWarning } from 'ui/svg/icons/BicolorWarning'
import { getSpacing, Spacer, Typo } from 'ui/theme'

interface Props {
  text: string
}

const PADDING_VERTICAL = getSpacing(4)

export const BottomBanner = ({ text }: Props) => {
  const { bottom } = useSafeAreaInsets()
  const paddingBottom = bottom !== 0 ? bottom : PADDING_VERTICAL

  return (
    <Container paddingBottom={paddingBottom}>
      <IconContainer>
        <BicolorWarning />
      </IconContainer>
      <Spacer.Row numberOfSpaces={4} />
      <TextContainer>
        <Typo.Body>{text}</Typo.Body>
      </TextContainer>
    </Container>
  )
}

const Container = styled.View<{ paddingBottom: number }>(({ paddingBottom, theme }) => ({
  backgroundColor: theme.colors.white,
  borderTopColor: theme.colors.greyMedium,
  borderTopWidth: getSpacing(0.25),
  paddingVertical: PADDING_VERTICAL,
  paddingHorizontal: getSpacing(6),
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom,
}))

const IconContainer = styled.View({
  flexShrink: 0,
})

const TextContainer = styled.View({
  flex: 1,
})
