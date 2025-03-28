import React, { FunctionComponent } from 'react'
import { View, ViewProps } from 'react-native'
import styled from 'styled-components/native'

import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, getSpacingString, Typo } from 'ui/theme'

type TagProps = ViewProps & {
  label: string
  Icon?: FunctionComponent<AccessibleIcon>
}

const PADDING_VERTICAL = getSpacing(1)
const NUMBER_OF_SPACES_LINE_HEIGHT = 4
const LINE_HEIGHT = getSpacing(NUMBER_OF_SPACES_LINE_HEIGHT)

export const TAG_HEIGHT = PADDING_VERTICAL + LINE_HEIGHT + PADDING_VERTICAL

export const Tag: FunctionComponent<TagProps> = ({ label, Icon, ...props }) => {
  return (
    <Wrapper {...props}>
      {Icon ? (
        <IconContainer>
          <Icon testID="tagIcon" />
        </IconContainer>
      ) : null}
      <LabelText>{label}</LabelText>
    </Wrapper>
  )
}

const Wrapper = styled(View)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  borderRadius: 6,
  backgroundColor: theme.colors.greyLight,
  paddingVertical: PADDING_VERTICAL,
  paddingHorizontal: getSpacing(2),
}))

const LabelText = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.black,
  lineHeight: getSpacingString(NUMBER_OF_SPACES_LINE_HEIGHT),
}))

const IconContainer = styled(View)({
  marginRight: getSpacing(1),
})
