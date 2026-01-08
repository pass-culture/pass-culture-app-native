import React, { FunctionComponent } from 'react'
import { styled, useTheme } from 'styled-components/native'

import { ArtistResponse } from 'api/gen'
import { OfferArtistItem } from 'features/offer/components/OfferArtistItem/OfferArtistItem'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Separator } from 'ui/components/Separator'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { Close } from 'ui/svg/icons/Close'

type Props = {
  isVisible: boolean
  closeModal: VoidFunction
  artists: ArtistResponse[]
  navigateTo: InternalNavigationProps['navigateTo']
}

export const OfferArtistsModal: FunctionComponent<Props> = ({
  isVisible,
  closeModal,
  artists,
  navigateTo,
}) => {
  const theme = useTheme()
  const { modal } = theme

  return (
    <AppModal
      animationOutTiming={1}
      visible={isVisible}
      title=""
      customModalHeader={
        <ModalHeader
          title="Artistes"
          rightIconAccessibilityLabel="Fermer la modale"
          rightIcon={Close}
          onRightIconPress={closeModal}
          modalSpacing={modal.spacing.MD}
        />
      }
      isFullscreen
      noPadding
      isUpToStatusBar>
      <Container>
        {artists.map((artist, index) => (
          <React.Fragment key={artist.id}>
            <OfferArtistItem
              artist={artist}
              navigateTo={{
                ...navigateTo,
                params: { id: artist.id },
              }}
              onBeforeNavigate={closeModal}
            />
            {index < artists.length - 1 ? <StyledSeparator /> : null}
          </React.Fragment>
        ))}
      </Container>
    </AppModal>
  )
}

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.designSystem.size.spacing.xl,
}))

const StyledSeparator = styled(Separator.Horizontal)(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
}))
