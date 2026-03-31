import React, { ComponentProps, ComponentType } from 'react'
import styled from 'styled-components/native'

import { separateTitleAndEmojis } from 'features/home/helpers/separateTitleAndEmojis'
import { hiddenFromScreenReader } from 'shared/accessibility/helpers/hiddenFromScreenReader'
import { useFontScaleValue } from 'shared/accessibility/helpers/useFontScaleValue'
import { Typo } from 'ui/theme'
import { SPACE } from 'ui/theme/constants'

export type AccessibleTitleProps = {
  title: string
  TitleComponent?: ComponentType<ComponentProps<typeof Typo.Title3>>
  withMargin?: boolean
  accessibilityLabel?: string
  withTag?: boolean
}

export const AccessibleTitle: React.FC<AccessibleTitleProps> = ({
  title,
  TitleComponent = Typo.Title3,
  withMargin = true,
  accessibilityLabel,
  withTag,
}) => {
  const numberOfLines = useFontScaleValue({ default: 2, at200PercentZoom: 3 })

  const { titleText, titleEmoji } = separateTitleAndEmojis(title)
  const { titleText: accessibilityLabelTitleText } = separateTitleAndEmojis(
    accessibilityLabel ?? ''
  )
  const StyledTitleComponent = styled(TitleComponent || Typo.Title3)({})
  return (
    <TitleWrapper testID="playlistTitle" withMargin={withMargin} withTag={withTag}>
      <StyledTitleComponent
        numberOfLines={numberOfLines}
        accessibilityLabel={accessibilityLabel ? accessibilityLabelTitleText : titleText}>
        <StyledTitleComponent {...hiddenFromScreenReader()}>
          {titleText}
          {titleEmoji ? (
            <React.Fragment>
              {SPACE}
              {titleEmoji}
            </React.Fragment>
          ) : null}
        </StyledTitleComponent>
      </StyledTitleComponent>
    </TitleWrapper>
  )
}

const TitleWrapper = styled.View<{ withMargin?: boolean; withTag?: boolean }>(
  ({ withMargin, withTag, theme }) => {
    const getMarginRight = () => {
      if (withTag) return theme.designSystem.size.spacing.s
      if (withMargin) return theme.contentPage.marginHorizontal
      return undefined
    }

    return {
      flexShrink: 1,
      marginLeft: withMargin ? theme.contentPage.marginHorizontal : undefined,
      marginRight: getMarginRight(),
    }
  }
)
