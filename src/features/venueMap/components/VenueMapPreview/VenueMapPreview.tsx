import React, { FunctionComponent, PropsWithChildren } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { CloseButton } from 'ui/components/headers/CloseButton'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import {
  InternalNavigationProps,
  InternalTouchableLinkProps,
} from 'ui/components/touchableLink/types'
import { VenueInfoHeader } from 'ui/components/VenueInfoHeader/VenueInfoHeader'
import { GroupTags } from 'ui/GroupTags/GroupTags'
import { getShadow } from 'ui/theme'

type TouchableWrapperProps = Omit<InternalTouchableLinkProps, 'as' | 'navigateTo' | 'style'> & {
  navigateTo: InternalNavigationProps['navigateTo']
  style?: Exclude<InternalTouchableLinkProps['style'], null>
}

type WrapperProps = PropsWithChildren<
  TouchableWrapperProps & {
    noBorder?: boolean
  }
>

type Props = {
  venueName: string
  address: string
  bannerUrl: string
  tags: string[]
  onClose?: VoidFunction
  noBorder?: boolean
  iconSize?: number
  withRightArrow?: boolean
} & TouchableWrapperProps

export const VenueMapPreview: FunctionComponent<Props> = ({
  venueName,
  address,
  bannerUrl,
  tags,
  navigateTo,
  onClose,
  iconSize,
  noBorder,
  withRightArrow,
  style,
  ...touchableProps
}) => {
  const { designSystem } = useTheme()

  return (
    <Wrapper
      {...touchableProps}
      navigateTo={navigateTo}
      noBorder={noBorder}
      style={style ?? undefined}>
      <Row>
        <StyledGroupTags tags={tags} />
        <StyledCloseButton onClose={onClose} size={iconSize} />
      </Row>
      <StyledVenueInfoHeader
        title={venueName}
        subtitle={address}
        imageSize={designSystem.size.image.xxs}
        showArrow={withRightArrow}
        imageURL={bannerUrl}
      />
    </Wrapper>
  )
}

const Wrapper = ({ children, noBorder, ...props }: WrapperProps) =>
  noBorder ? (
    <InternalTouchableLink {...props}>{children}</InternalTouchableLink>
  ) : (
    <Container {...props}>{children}</Container>
  )

const Container = styled(InternalTouchableLink)(({ theme }) => ({
  borderRadius: theme.designSystem.size.borderRadius.m,
  borderColor: theme.designSystem.color.border.default,
  borderWidth: 1,
  padding: theme.designSystem.size.spacing.l,
  ...getShadow(theme),
}))

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const StyledVenueInfoHeader = styled(VenueInfoHeader)(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.s,
}))

const StyledCloseButton = styledButton(CloseButton)({
  justifyContent: 'flex-start',
})

const StyledGroupTags = styled(GroupTags)({
  flexGrow: 1,
})
