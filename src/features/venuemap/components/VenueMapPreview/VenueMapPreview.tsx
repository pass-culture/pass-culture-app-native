import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { styledButton } from 'ui/components/buttons/styledButton'
import { CloseButton } from 'ui/components/headers/CloseButton'
import { VenuePreview } from 'ui/components/VenuePreview/VenuePreview'
import { InformationTags } from 'ui/InformationTags/InformationTags'
import { getSpacing } from 'ui/theme'

type Props = {
  venueName: string
  address: string
  bannerUrl: string
  tags: string[]
}

const VENUE_THUMBNAIL_SIZE = getSpacing(12)
const CLOSE_BUTTON_HIT_SLOP = getSpacing(2)

export const VenueMapPreview: FunctionComponent<Props> = ({
  venueName,
  address,
  bannerUrl,
  tags,
}) => {
  return (
    <Container>
      <Row>
        <InformationTags tags={tags} />
        <StyledCloseButton />
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

const Container = styled.View(({ theme }) => ({
  borderRadius: theme.borderRadius.radius,
  borderColor: theme.colors.greyDark,
  borderWidth: 1,
  padding: getSpacing(4),
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
