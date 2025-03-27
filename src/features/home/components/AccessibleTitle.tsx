import React, { ComponentProps, ComponentType } from 'react'
import styled from 'styled-components/native'

import { Typo } from 'ui/theme'

export const separateTitleAndEmojis = (title: string) => {
  const titleWithoutEndSpace = title.trimEnd()
  const emojiRegex = /(\p{Emoji})(?=\s*$)/gu
  const titleText = titleWithoutEndSpace.replace(emojiRegex, '')
  const titleEmoji = titleWithoutEndSpace.replace(titleText, '')
  return { titleText, titleEmoji }
}

export const AccessibleTitle = ({
  title,
  testID,
  TitleComponent,
}: {
  title: string
  testID?: string
  TitleComponent?: ComponentType<ComponentProps<typeof Typo.Title3>>
}) => {
  const { titleText, titleEmoji } = separateTitleAndEmojis(title)

  const StyledTitleComponent = styled(TitleComponent || Typo.Title3)({})

  return (
    <InlineView numberOfLines={2} testID={testID}>
      <StyledTitleComponent>{titleText}</StyledTitleComponent>
      <StyledTitleComponent accessibilityHidden>{titleEmoji}</StyledTitleComponent>
    </InlineView>
  )
}

const InlineView = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  flexDirection: 'row',
  alignItems: 'center',
}))
