import React, { cloneElement, FunctionComponent, ReactElement } from 'react'
import { Platform, View, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { isReactElement } from 'shared/typeguards/isReactElement'
import { isStyledIcon } from 'shared/typeguards/isStyledIcon'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, getSpacingString, Typo } from 'ui/theme'

export type TagProps = ViewProps & {
  label: string
  Icon?: FunctionComponent<AccessibleIcon> | ReactElement
  backgroundColor?: string
  paddingHorizontal?: number
}

const PADDING_VERTICAL = getSpacing(1)
const NUMBER_OF_SPACES_LINE_HEIGHT = 4
const LINE_HEIGHT = getSpacing(NUMBER_OF_SPACES_LINE_HEIGHT)

export const TAG_HEIGHT = PADDING_VERTICAL + LINE_HEIGHT + PADDING_VERTICAL

export const Tag: FunctionComponent<TagProps> = ({ label, Icon, ...props }) => {
  const renderIcon = () => {
    if (!Icon) return null

    if (isReactElement(Icon)) {
      return cloneElement(Icon, { testID: 'tagIcon' })
    }
    if (isStyledIcon(Icon)) {
      return <Icon testID="tagIcon" />
    }

    return null
  }

  return (
    <Wrapper {...props}>
      {Icon ? <IconContainer>{renderIcon()}</IconContainer> : null}
      <LabelText>{label}</LabelText>
    </Wrapper>
  )
}

const Wrapper = styled(View)<{ backgroundColor?: string; paddingHorizontal?: number }>(
  ({ theme, backgroundColor, paddingHorizontal }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 6,
    backgroundColor: backgroundColor ?? theme.designSystem.color.background.subtle,
    paddingVertical: PADDING_VERTICAL,
    paddingHorizontal: paddingHorizontal ?? getSpacing(2),
  })
)

const LabelText = styled(Typo.BodyAccentXs)({
  lineHeight: getSpacingString(NUMBER_OF_SPACES_LINE_HEIGHT),
  ...(Platform.OS === 'web' && {
    textWrap: 'nowrap',
  }),
})

const IconContainer = styled(View)({
  marginRight: getSpacing(1),
})
