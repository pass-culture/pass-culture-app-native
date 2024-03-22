import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { CloseButton } from 'ui/components/headers/CloseButton'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { VenuePreview } from 'ui/components/VenuePreview/VenuePreview'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { getShadow, getSpacing } from 'ui/theme'

type Props = {
  venueName: string
  address: string
  bannerUrl: string
  tags: string[]
  navigateTo: InternalNavigationProps['navigateTo']
  onClose?: VoidFunction
  onBeforeNavigate?: VoidFunction
}

const VENUE_THUMBNAIL_SIZE = getSpacing(12)
const CLOSE_BUTTON_HIT_SLOP = getSpacing(2)

export const VenueMapPreview: FunctionComponent<Props> = ({
  venueName,
  address,
  bannerUrl,
  tags,
  navigateTo,
  onClose,
  onBeforeNavigate,
  ...props
}) => {
  return (
    <Container navigateTo={navigateTo} onBeforeNavigate={onBeforeNavigate} {...props}>
      <Row>
        <InformationTags tags={tags} />
        <StyledCloseButton onClose={onClose} />
      </Row>
      <VenuePreview
        venueName={venueName}
        address={address}
        bannerUrl={bannerUrl}
        imageWidth={VENUE_THUMBNAIL_SIZE}
        imageHeight={VENUE_THUMBNAIL_SIZE}
      />
    </Container>
  )
}

const Container = styled(InternalTouchableLink)(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  borderColor: theme.colors.greyDark,
  borderWidth: 1,
  padding: getSpacing(4),
  ...getShadow({
    shadowOffset: {
      width: 0,
      height: getSpacing(1),
    },
    shadowRadius: getSpacing(4),
    shadowColor: theme.colors.secondaryDark,
    shadowOpacity: 0.2,
  }),
}))

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const StyledCloseButton = styledButton(CloseButton)({
  position: 'absolute',
  top: -CLOSE_BUTTON_HIT_SLOP,
  right: -CLOSE_BUTTON_HIT_SLOP,
})
