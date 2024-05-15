import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { GeolocationBanner } from 'features/home/components/banners/GeolocationBanner'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

type Props = {
  subTitle: string
  isSharingLocation: boolean
  headerMessage: string
}

export const VenueSelectionListHeader: FunctionComponent<Props> = ({
  subTitle,
  isSharingLocation,
  headerMessage,
}) => {
  return (
    <ListHeaderContainer>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title3 {...getHeadingAttrs(2)}>{subTitle}</Typo.Title3>
      <Spacer.Column numberOfSpaces={6} />
      {!isSharingLocation ? (
        <React.Fragment>
          <GeolocationBanner
            title="Active ta géolocalisation"
            subtitle="Pour trouver les lieux autour de toi"
          />
          <Spacer.Column numberOfSpaces={6} />
        </React.Fragment>
      ) : null}
      <HeaderMessageText>{headerMessage}</HeaderMessageText>
      <Spacer.Column numberOfSpaces={2} />
    </ListHeaderContainer>
  )
}

const ListHeaderContainer = styled.View({
  width: '100%',
})

const HeaderMessageText = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
