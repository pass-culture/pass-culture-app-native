import React from 'react'
import styled from 'styled-components/native'

import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Spacer, TypoDS } from 'ui/theme'

export const Item: React.FC<{
  Icon: React.FC<AccessibleIcon>
  message: React.JSX.Element | string
  subtext?: string
  testID?: string
}> = ({ Icon, message, subtext = '', testID }) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color: theme.colors.greyDark,
    size: theme.icons.sizes.small,
  }))``
  return (
    <Row testID={testID}>
      <IconWrapper>
        <StyledIcon />
      </IconWrapper>
      <Spacer.Row numberOfSpaces={3} />
      {typeof message === 'string' ? <TypoDS.BodyAccentXs>{message}</TypoDS.BodyAccentXs> : message}
      <Spacer.Row numberOfSpaces={2} />
      <CaptionNeutralInfo>{subtext}</CaptionNeutralInfo>
    </Row>
  )
}

const Row = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  width: theme.appContentWidth - getSpacing(24),
  paddingVertical: getSpacing(0.5),
}))

const IconWrapper = styled.View({
  flexShrink: 0,
})

const CaptionNeutralInfo = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
