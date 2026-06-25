import React from 'react'

import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { render, screen } from 'tests/utils'
import { ImageTile } from 'ui/components/ImageTile'

const useRemoteConfigSpy = jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

const props = {
  height: 100,
  width: 100,
  uri: 'uri_thumb_url',
}

describe('<ImageTile/>', () => {
  beforeEach(() => {
    useRemoteConfigSpy.mockReturnValue({
      ...remoteConfigResponseFixture,
      data: {
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: true,
      },
    })
  })

  it('should render image when uri defined', () => {
    render(<ImageTile {...props} onlyTopBorderRadius />)

    expect(screen.getByTestId('tileImage')).toBeOnTheScreen()
  })

  it('should render image placeholder when uri not defined', () => {
    render(<ImageTile {...props} onlyTopBorderRadius uri={undefined} />)

    expect(screen.getByTestId('imagePlaceholder')).toBeOnTheScreen()
  })
})
