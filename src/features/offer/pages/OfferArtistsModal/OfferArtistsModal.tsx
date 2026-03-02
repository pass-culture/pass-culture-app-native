import React, { FunctionComponent } from 'react'
import { styled, useTheme } from 'styled-components/native'

import { OfferArtist } from 'api/gen'
import { OfferArtistItem } from 'features/offer/components/OfferArtistItem/OfferArtistItem'
import { analytics } from 'libs/analytics/provider'
import { AppModal } from 'ui/components/modals/AppModal'
import { ModalHeader } from 'ui/components/modals/ModalHeader'
import { Separator } from 'ui/components/Separator'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { Close } from 'ui/svg/icons/Close'

type Props = {
  offerId: number
  isVisible: boolean
  closeModal: VoidFunction
  artists: OfferArtist[]
  navigateTo: InternalNavigationProps['navigateTo']
}

export const OfferArtistsModal: FunctionComponent<Props> = ({
  offerId,
  isVisible,
  closeModal,
  artists,
  navigateTo,
}) => {
  const theme = useTheme()
  const { modal } = theme

  const handleOnBeforeNavigateArtistPage = (artist: OfferArtist) => {
    if (artist.id) {
      void analytics.logConsultArtist({
        offerId: offerId.toString(),
        artistId: artist.id,
        artistName: artist.name,
        from: 'offer',
      })
    }

    closeModal()
  }

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
        {artists.map((artist, index) => {
          const key = artist.id ?? `no-id-${artist.name}-${index}`

          return (
            <React.Fragment key={key}>
              <OfferArtistItem
                artist={artist}
                navigateTo={
                  artist.id
                    ? {
                        ...navigateTo,
                        params: { id: artist.id },
                      }
                    : undefined
                }
                onBeforeNavigate={
                  artist.id ? () => handleOnBeforeNavigateArtistPage(artist) : undefined
                }
              />
              {index < artists.length - 1 ? <StyledSeparator /> : null}
            </React.Fragment>
          )
        })}
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
