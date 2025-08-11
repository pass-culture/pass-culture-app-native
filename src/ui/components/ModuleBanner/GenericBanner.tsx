import React, { FunctionComponent, ReactElement } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

type GenericBannerProps = {
  LeftIcon?: ReactElement
  RightIcon?: FunctionComponent<AccessibleIcon>
  noRightIcon?: boolean
  children: React.ReactNode
  testID?: string
}

export const GenericBanner: FunctionComponent<GenericBannerProps> = ({
  LeftIcon,
  RightIcon,
  noRightIcon = false,
  children,
  testID,
}) => {
  return (
    <Container testID={testID}>
      {LeftIcon ? <IconContainer>{LeftIcon}</IconContainer> : null}
      <DescriptionContainer>{children}</DescriptionContainer>
      {noRightIcon ? null : <View>{RightIcon ? <RightIcon /> : <StyledArrowNextIcon />}</View>}
    </Container>
  )
}

const StyledArrowNextIcon = styled(ArrowNext).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
  color: theme.designSystem.color.icon.default,
}))``

export const BANNER_BORDER_WIDTH = getSpacing(0.25)

const Container = styled.View(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  borderStyle: 'solid',
  borderWidth: BANNER_BORDER_WIDTH,
  borderRadius: getSpacing(1.8),
  borderColor: theme.designSystem.color.border.default,
  padding: getSpacing(4),
  width: '100%',
}))

const DescriptionContainer = styled.View({
  flexShrink: 1,
  flexGrow: 1,
  marginRight: getSpacing(4),
  textAlign: 'start',
})

const IconContainer = styled.View({
  alignContent: 'center',
  marginRight: getSpacing(4),
})
