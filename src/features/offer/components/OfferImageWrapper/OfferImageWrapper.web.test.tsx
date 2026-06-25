import React, { ComponentProps } from 'react'

import { OfferBodyImage } from 'features/offer/components/OfferBodyImage'
import { OfferImageWrapper } from 'features/offer/components/OfferImageWrapper/OfferImageWrapper'
import { mockOfferImageDimensions } from 'features/offer/fixtures/offerImageDimensions'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { render, screen, waitFor } from 'tests/utils/web'
import { theme } from 'theme'

const useRemoteConfigSpy = jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

describe('<OfferImageBody />', () => {
  beforeEach(() => {
    useRemoteConfigSpy.mockReturnValue({
      ...remoteConfigResponseFixture,
      data: {
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: true,
      },
    })
  })

  it('should apply borderRadius when not in carousel', async () => {
    renderOfferImageWrapper({
      isDesktopViewport: false,
      isInCarousel: false,
      shouldDisplayOfferPreview: true,
      imageUrl: 'some_url_to_some_resource',
    })

    const container = screen.getByTestId('imageGradient')

    await waitFor(() =>
      expect(container).toHaveStyle({
        borderTopLeftRadius: theme.designSystem.size.borderRadius.m + 'px',
        borderTopRightRadius: theme.designSystem.size.borderRadius.m + 'px',
        borderBottomRightRadius: theme.designSystem.size.borderRadius.m + 'px',
        borderBottomLeftRadius: theme.designSystem.size.borderRadius.m + 'px',
      })
    )
  })
})

type RenderOfferImageWrapperType = Partial<ComponentProps<typeof OfferImageWrapper>> & {
  isDesktopViewport?: boolean
}

function renderOfferImageWrapper({
  shouldDisplayOfferPreview,
  imageUrl,
  isDesktopViewport,
  isInCarousel,
}: RenderOfferImageWrapperType) {
  render(
    <OfferImageWrapper
      shouldDisplayOfferPreview={shouldDisplayOfferPreview}
      imageUrl={imageUrl}
      isInCarousel={isInCarousel}
      imageDimensions={mockOfferImageDimensions}>
      <OfferBodyImage
        imageUrl="some_url_to_some_resource"
        imageDimensions={mockOfferImageDimensions}
      />
    </OfferImageWrapper>,
    {
      theme: { ...theme, isDesktopViewport: isDesktopViewport ?? false },
    }
  )
}
