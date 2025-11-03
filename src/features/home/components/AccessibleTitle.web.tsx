import React from 'react'
import styled from 'styled-components/native'

import { AccessibleTitleProps } from 'features/home/components/AccessibleTitle'
import { separateTitleAndEmojis } from 'features/home/helpers/separateTitleAndEmojis'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export const AccessibleTitle: React.FC<AccessibleTitleProps> = ({
  title,
  TitleComponent = Typo.Title3,
  withMargin = true,
  accessibilityLabel,
}) => {
  const { titleText, titleEmoji } = separateTitleAndEmojis(title)
  const { titleText: accessibilityLabelTitleText } = separateTitleAndEmojis(
    accessibilityLabel ?? ''
  )
  const StyledTitleComponent = styled(TitleComponent || Typo.Title3)({})
  return (
    <TitleWrapper testID="playlistTitle" withMargin={withMargin}>
      <StyledTitleComponent
        numberOfLines={2}
        accessibilityLabel={accessibilityLabel ? accessibilityLabelTitleText : titleText}>
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
  ({ withMargin, theme }) => {
    return {
      marginHorizontal: withMargin ? theme.contentPage.marginHorizontal : undefined,
    }
  }
)
