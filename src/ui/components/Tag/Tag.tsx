import React, { FunctionComponent } from 'react'
import { View, Platform } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { getTagColors } from 'ui/components/Tag/helper/getTagColors'
import { getTagIcon } from 'ui/components/Tag/helper/getTagIcon'
import { renderTagIcon } from 'ui/components/Tag/helper/renderTagIcon'
import { TagProps, TagVariant } from 'ui/components/Tag/types'
import { Typo, getSpacing, getSpacingString } from 'ui/theme'

const PADDING_VERTICAL = getSpacing(1)
const NUMBER_OF_SPACES_LINE_HEIGHT = 4
const LINE_HEIGHT = getSpacing(NUMBER_OF_SPACES_LINE_HEIGHT)

export const TAG_HEIGHT = PADDING_VERTICAL + LINE_HEIGHT + PADDING_VERTICAL

export const Tag: FunctionComponent<TagProps> = ({
  label,
  variant = TagVariant.DEFAULT,
  Icon,
  ...props
}) => {
  const theme = useTheme()
  const { background, icon } = theme.designSystem.color

  const FinalIcon = getTagIcon(variant, Icon)

  const { backgroundColor, iconColor, labelColor, iconSize } = getTagColors({
    variant,
    background,
    icon,
    theme,
  })

  return (
    <Wrapper backgroundColor={backgroundColor} testID="tagWrapper" {...props}>
      {FinalIcon ? (
        <IconContainer>{renderTagIcon(iconColor, iconSize, FinalIcon)}</IconContainer>
      ) : null}
      <LabelText color={labelColor}>{label}</LabelText>
    </Wrapper>
  )
}

const Wrapper = styled(View)<{ backgroundColor: string }>(({ backgroundColor }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  borderRadius: getSpacing(1),
  backgroundColor,
  paddingVertical: PADDING_VERTICAL,
  paddingHorizontal: getSpacing(2),
}))

const LabelText = styled(Typo.BodyAccentXs)({
  lineHeight: getSpacingString(NUMBER_OF_SPACES_LINE_HEIGHT),
  ...(Platform.OS === 'web' && {
    textWrap: 'nowrap',
  }),
})

const IconContainer = styled(View)({
  marginRight: getSpacing(1),
})
