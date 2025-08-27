import React, { ComponentProps, ComponentType } from 'react'
import { Platform, useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

type Props = {
  title: string
  testID?: string
  TitleComponent?: ComponentType<ComponentProps<typeof Typo.Title3>>
  withMargin?: boolean
}

export const separateTitleAndEmojis = (title: string) => {
  const titleWithoutEndSpace = title.trimEnd()
  const emojiRegex = /(\p{Emoji})(?=\s*$)/gu
  const titleText = titleWithoutEndSpace.replace(emojiRegex, '')
  const titleEmoji = titleWithoutEndSpace.replace(titleText, '')
  return { titleText, titleEmoji }
}

export const AccessibleTitle: React.FC<Props> = ({
  title,
  testID,
  TitleComponent = Typo.Title3,
  withMargin = true,
}) => {
  const { width: windowWidth } = useWindowDimensions()
  const { titleText, titleEmoji } = separateTitleAndEmojis(title)

  const StyledTitleComponent = styled(TitleComponent || Typo.Title3)({})

  return Platform.OS === 'web' ? (
    <TitleWrapper testID={testID} windowWidth={windowWidth} withMargin={withMargin}>
      <StyledTitleComponent numberOfLines={2}>
        {titleText}
        <span aria-hidden>{titleEmoji}</span>
      </StyledTitleComponent>
    </TitleWrapper>
  ) : (
    <TitleWrapper testID={testID} withMargin={withMargin}>
      <StyledTitleComponent accessibilityHidden numberOfLines={2} accessibilityLabel={titleText}>
        {titleText}
        {titleEmoji}
      </StyledTitleComponent>
    </TitleWrapper>
  )
}

const TitleWrapper = styled.View<{ windowWidth?: number; withMargin?: boolean }>(
  ({ windowWidth, withMargin, theme }) => {
    return {
      marginHorizontal: withMargin ? theme.contentPage.marginHorizontal : undefined,
      width: windowWidth,
    }
  }
)
