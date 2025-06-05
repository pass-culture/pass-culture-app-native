import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { GeolocationBanner } from 'shared/Banners/GeolocationBanner'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  subTitle: string
  isSharingLocation: boolean
  headerMessage: string
  onPressGeolocationBanner?: VoidFunction
}

export const VenueSelectionListHeader: FunctionComponent<Props> = ({
  subTitle,
  isSharingLocation,
  headerMessage,
  onPressGeolocationBanner,
}) => {
  return (
    <ListHeaderContainer>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title3 {...getHeadingAttrs(2)}>{subTitle}</Typo.Title3>
      <Spacer.Column numberOfSpaces={6} />
      {isSharingLocation ? null : (
        <React.Fragment>
          <GeolocationBanner
            title="Active ta géolocalisation"
            subtitle="Pour trouver les lieux autour de toi"
            analyticsFrom="offer"
            onPress={onPressGeolocationBanner}
          />
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      )}
      <StyledBodyAccentXs>{headerMessage}</StyledBodyAccentXs>
      <Spacer.Column numberOfSpaces={2} />
    </ListHeaderContainer>
  )
}

const ListHeaderContainer = styled.View({
  width: '100%',
})

const StyledBodyAccentXs = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
