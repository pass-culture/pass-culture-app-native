import React, { ComponentProps, FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { VenuePreview } from 'ui/components/VenuePreview/VenuePreview'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  venueName: string
  address: string
  bannerUrl: string
  tags: string[]
  onClose?: VoidFunction
} & ComponentProps<typeof InternalTouchableLink>

const VENUE_THUMBNAIL_SIZE = getSpacing(12)

export const VenueMapPreview: FunctionComponent<Props> = ({
  venueName,
  address,
  bannerUrl,
  tags,
  onClose,
  ...touchableProps
}) => {
  return (
    <Container {...touchableProps}>
      <Row>
        <StyledInformationTags tags={tags} />
      </Row>
      <Spacer.Column numberOfSpaces={2} />
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
  borderWidth: 0,
  padding: getSpacing(4),
}))

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
})

const StyledInformationTags = styled(InformationTags)({
  flexGrow: 1,
})
