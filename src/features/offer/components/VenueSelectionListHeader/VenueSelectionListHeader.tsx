import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { GeolocationBanner } from 'shared/Banners/GeolocationBanner'
import { Spacer, TypoDS } from 'ui/theme'
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
      <TypoDS.Title3 {...getHeadingAttrs(2)}>{subTitle}</TypoDS.Title3>
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
      <HeaderMessageText>{headerMessage}</HeaderMessageText>
      <Spacer.Column numberOfSpaces={2} />
    </ListHeaderContainer>
  )
}

const ListHeaderContainer = styled.View({
  width: '100%',
})

const HeaderMessageText = styled(TypoDS.BodyAccentXs)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
