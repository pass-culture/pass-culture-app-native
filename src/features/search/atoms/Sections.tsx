import React, { PropsWithChildren } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing, Typo, Spacer } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const CenteredSection: React.FC<{
  title: JSX.Element | string
  children: JSX.Element | Array<JSX.Element | null>
}> = ({ title, children }) => (
  <MarginHorizontalContainer>
    <Title>{title}</Title>
    <Spacer.Column numberOfSpaces={4} />
    <Center>{children}</Center>
  </MarginHorizontalContainer>
)

export type InlineSectionProps = {
  title: JSX.Element | string
  subtitle?: string
  subtitleID?: string
  testID?: string
  style?: StyleProp<ViewStyle>
}

export const InlineSection = ({
  style,
  title,
  subtitle,
  subtitleID,
  children,
  testID,
}: PropsWithChildren<InlineSectionProps>) => (
  <MarginHorizontalContainer testID={testID} style={style}>
    <InlineSectionTitleContainer>
      <StyledTitle numberOfLines={2}>{title}</StyledTitle>
      {children}
    </InlineSectionTitleContainer>
    {!!subtitle && (
      <React.Fragment>
        <Spacer.Column numberOfSpaces={2} />
        <Typo.CaptionNeutralInfo nativeID={subtitleID}>{subtitle}</Typo.CaptionNeutralInfo>
      </React.Fragment>
    )}
  </MarginHorizontalContainer>
)

const Center = styled.View({ alignItems: 'center' })
const MarginHorizontalContainer = styled.View({ marginHorizontal: getSpacing(6) })

const InlineSectionTitleContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const StyledTitle = styled(Typo.Title4).attrs(() => getHeadingAttrs(2))(({ theme }) => ({
  flex: theme.isMobileViewport ? 1 : undefined,
}))

const Title = styled(Typo.Title4).attrs(() => getHeadingAttrs(2))``
