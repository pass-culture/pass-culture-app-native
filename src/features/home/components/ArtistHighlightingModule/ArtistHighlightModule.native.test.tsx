import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { api } from 'api/api'
import { mockArtist } from 'features/artist/fixtures/mockArtist'
import {
  ArtistHighlightingModule,
  ArtistHighlightingModuleProps,
} from 'features/home/components/ArtistHighlightingModule/ArtistHighlightingModule'
import { Color } from 'features/home/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent, waitFor } from 'tests/utils'

const defaultProps: ArtistHighlightingModuleProps = {
  homeEntryId: 'abcd',
  moduleId: 'module-id',
  artistId: mockArtist.id,
  subtitle: 'Interprète',
  description: 'Redécouvre sa disco en attendant la suite...',
  color: Color.Information04,
}

jest.mock('api/api')

const user = userEvent.setup()
jest.useFakeTimers()

describe('ArtistHighlightingModule', () => {
  beforeEach(() => {
    const mockApi = jest.mocked(api)
    mockApi.getNativeV1ArtistsartistId.mockResolvedValue(mockArtist)
  })

  it('should render correctly when artist data is successfully fetched', async () => {
    renderModule(defaultProps)

    expect(await screen.findByText('Avril Lavigne')).toBeOnTheScreen()
    expect(screen.getByText('Interprète')).toBeOnTheScreen()
    expect(screen.getByText('Redécouvre sa disco en attendant la suite...')).toBeOnTheScreen()
  })

  it('should render nothing when artist query encounters an error', async () => {
    const mockApi = jest.mocked(api)
    mockApi.getNativeV1ArtistsartistId.mockRejectedValueOnce(new Error('404: Artist not found'))

    renderModule(defaultProps)

    await waitFor(() => {
      expect(screen.toJSON()).not.toBeOnTheScreen()
    })
  })

  it('should navigate to the artist page when pressing the button', async () => {
    renderModule(defaultProps)

    await user.press(await screen.findByLabelText(`Découvre la page artiste de ${mockArtist.name}`))

    expect(navigate).toHaveBeenCalledWith('Artist', { id: mockArtist.id })
  })

  it('should render mobile view when viewport is mobile', async () => {
    renderModule(defaultProps)

    expect(await screen.findByTestId('mobileArtistHighlighting')).toBeOnTheScreen()
  })

  it('should render desktop view when viewport is desktop', async () => {
    renderModule(defaultProps, true)

    expect(await screen.findByTestId('desktopArtistHighlighting')).toBeOnTheScreen()
  })
})

const renderModule = (props: ArtistHighlightingModuleProps, isDesktopViewport?: boolean) =>
  render(reactQueryProviderHOC(<ArtistHighlightingModule {...props} />), {
    theme: { isDesktopViewport: isDesktopViewport ?? false },
  })
