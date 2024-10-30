import React from 'react'
import { useTheme } from 'styled-components'

import { VenueResponse } from 'api/gen'
import { VenueTopComponentBase } from 'features/venue/components/VenueTopComponent/VenueTopComponentBase'
import { ImagesCarouselModal } from 'ui/components/ImagesCarouselModal/ImagesCarouselModal'
import { useModal } from 'ui/components/modals/useModal'

type Props = {
  venue: VenueResponse
}

export const VenueTopComponent: React.FunctionComponent<Props> = ({ venue }) => {
  const { visible, showModal, hideModal } = useModal(false)
  const { isDesktopViewport } = useTheme()

  return (
    <React.Fragment>
      <ImagesCarouselModal
        imagesURL={[venue.bannerUrl || '']}
        hideModal={hideModal}
        isVisible={visible}
      />
      <VenueTopComponentBase
        venue={venue}
        onPressBannerImage={isDesktopViewport ? showModal : undefined}
      />
    </React.Fragment>
  )
}
