import React from 'react'
import { useWindowDimensions } from 'react-native'
import styled from 'styled-components/native'

import { AccessibleTitleProps } from 'features/home/components/AccessibleTitle'
import { separateTitleAndEmojis } from 'features/home/helpers/separateTitleAndEmojis'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export const AccessibleTitle: React.FC<AccessibleTitleProps> = ({
  title,
  TitleComponent = Typo.Title3,
  withMargin = true,
}) => {
  const { width: windowWidth } = useWindowDimensions()
  const { titleText, titleEmoji } = separateTitleAndEmojis(title)
  const StyledTitleComponent = styled(TitleComponent || Typo.Title3)({})
  return (
    <TitleWrapper testID="playlistTitle" windowWidth={windowWidth} withMargin={withMargin}>
      <StyledTitleComponent numberOfLines={2}>
        {titleText}
        {titleEmoji ? (
          <span aria-hidden>
            {SPACE}
            {titleEmoji}
          </span>
        ) : null}
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
