import React from 'react'

import { VenueBanner } from 'features/venue/components/VenueBody/VenueBanner'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { fireEvent, render, screen } from 'tests/utils/web'

const useRemoteConfigSpy = jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

const mockHandleImagePress = jest.fn()

describe('<VenueBanner />', () => {
  beforeEach(() => {
    useRemoteConfigSpy.mockReturnValue({
      ...remoteConfigResponseFixture,
      data: {
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: true,
      },
    })
  })

  it('should call press handler when pressing image not from google', () => {
    render(
      <VenueBanner
        bannerUrl="https://image.com"
        bannerIsFromGoogle={false}
        bannerCredit="François Boulo"
        handleImagePress={mockHandleImagePress}
      />
    )

    fireEvent.click(screen.getByLabelText('Voir l’illustration en plein écran - © François Boulo'))

    expect(mockHandleImagePress).toHaveBeenCalledTimes(1)
  })

  it('should call press handler when pressing image from google', () => {
    render(
      <VenueBanner
        bannerUrl="https://image.com"
        bannerIsFromGoogle
        bannerCredit="François Boulo"
        handleImagePress={mockHandleImagePress}
      />
    )

    fireEvent.click(screen.getByTestId('Voir l’illustration en plein écran - © François Boulo'))

    expect(mockHandleImagePress).toHaveBeenCalledTimes(1)
  })

  it('should display default venue background', async () => {
    render(
      <VenueBanner
        bannerIsFromGoogle
        bannerCredit="François Boulo"
        handleImagePress={mockHandleImagePress}
      />
    )

    expect(await screen.findByTestId('defaultVenueBackground')).toBeInTheDocument()
  })
})
